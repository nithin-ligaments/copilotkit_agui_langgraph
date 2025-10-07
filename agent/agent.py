"""
This is the main entry point for the agent.
It defines the workflow graph, state, tools, nodes and edges.
"""

from typing import Any, List
from typing_extensions import Literal
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, BaseMessage
from langchain_core.runnables import RunnableConfig
from langchain.tools import tool
from langgraph.graph import StateGraph, END
from langgraph.types import Command
from langgraph.graph import MessagesState
from langgraph.prebuilt import ToolNode

class AgentState(MessagesState):
    """
    Here we define the state of the agent

    In this instance, we're inheriting from CopilotKitState, which will bring in
    the CopilotKitState fields. We're also adding a custom field, `language`,
    which will be used to set the language of the agent.
    """
    proverbs: List[str] = []
    tools: List[Any]
    # Weather state
    weather_data: dict = None
    # HITL (Human-in-the-Loop) state
    hitl_pending: bool = False
    hitl_question: str = ""
    hitl_response: str = ""
    hitl_context: str = ""
    # your_custom_agent_state: str = ""

@tool
def get_weather(location: str):
    """
    Get detailed weather information for a given location using OpenAI. Returns comprehensive weather data including temperature, conditions, humidity, wind, and recommendations.
    """
    from langchain_openai import ChatOpenAI
    import json
    
    # Initialize OpenAI model
    model = ChatOpenAI(model="gpt-4o", temperature=0.3)
    
    # Create a prompt for weather generation
    prompt = f"""Generate realistic weather information for {location}. Please provide the following information in JSON format:

{{
    "location": "{location}",
    "temperature": "XX°F/°C",
    "condition": "Sunny/Cloudy/Rainy/etc",
    "humidity": "XX%",
    "wind_speed": "XX mph/kmh",
    "wind_direction": "North/South/East/West",
    "feels_like": "XX°F/°C",
    "visibility": "XX miles/km",
    "uv_index": "X",
    "precipitation_chance": "XX%",
    "recommendations": ["recommendation1", "recommendation2", "..."],
    "clothing_suggestion": "What to wear",
    "activity_suggestion": "Best activities for this weather"
}}

Make the weather data realistic and location-appropriate. Include helpful recommendations for the user."""
    
    try:
        # Generate weather using OpenAI
        response = model.invoke(prompt)
        weather_text = response.content
        
        # Try to extract JSON from the response
        import re
        json_match = re.search(r'\{.*\}', weather_text, re.DOTALL)
        if json_match:
            weather_json = json.loads(json_match.group())
            
            # Format the response
            formatted_response = f"""🌤️ **Weather Report for {weather_json.get('location', location)}**

**Current Conditions:** {weather_json.get('condition', 'Unknown')}
**Temperature:** {weather_json.get('temperature', 'N/A')} (Feels like {weather_json.get('feels_like', 'N/A')})
**Humidity:** {weather_json.get('humidity', 'N/A')}
**Wind:** {weather_json.get('wind_speed', 'N/A')} {weather_json.get('wind_direction', '')}
**Visibility:** {weather_json.get('visibility', 'N/A')}
**UV Index:** {weather_json.get('uv_index', 'N/A')}
**Precipitation Chance:** {weather_json.get('precipitation_chance', 'N/A')}

**💡 Recommendations:**
{chr(10).join([f"• {rec}" for rec in weather_json.get('recommendations', [])])}

**👕 Clothing:** {weather_json.get('clothing_suggestion', 'Dress appropriately for the weather')}
**🎯 Activities:** {weather_json.get('activity_suggestion', 'Enjoy outdoor activities')}"""
            
            return formatted_response, weather_json
        else:
            # Fallback if JSON parsing fails
            return weather_text, {
                "location": location,
                "temperature": "72°F",
                "condition": "Sunny",
                "humidity": "45%",
                "wind_speed": "5 mph",
                "feels_like": "75°F"
            }
            
    except Exception as e:
        # Fallback response if OpenAI fails
        return f"I apologize, but I encountered an error getting weather information for {location}. Please try again.", {
            "location": location,
            "temperature": "Unknown",
            "condition": "Unknown",
            "humidity": "Unknown",
            "wind_speed": "Unknown",
            "feels_like": "Unknown"
        }



@tool
def get_time(timezone: str = "UTC"):
    """
    Get the current time for a given timezone. Defaults to UTC if no timezone is specified.
    Common timezones: UTC, EST, PST, GMT, Europe/London, America/New_York, etc.
    """
    from datetime import datetime
    import pytz
    
    try:
        if timezone.upper() in ['UTC', 'GMT']:
            tz = pytz.UTC
        elif timezone.upper() in ['EST', 'EDT']:
            tz = pytz.timezone('America/New_York')
        elif timezone.upper() in ['PST', 'PDT']:
            tz = pytz.timezone('America/Los_Angeles')
        elif timezone.upper() in ['CST', 'CDT']:
            tz = pytz.timezone('America/Chicago')
        else:
            tz = pytz.timezone(timezone)
        
        current_time = datetime.now(tz)
        formatted_time = current_time.strftime("%Y-%m-%d %H:%M:%S %Z")
        return f"The current time in {timezone} is {formatted_time}"
    except Exception as e:
        return f"Error getting time for timezone '{timezone}': {str(e)}. Please use a valid timezone like 'UTC', 'EST', 'PST', 'Europe/London', etc."

@tool
def request_human_input(question: str, context: str = ""):
    """
    Request human input for a specific question. This will pause the agent and wait for human response.
    Use this when you need clarification, approval, or additional information from the user.
    
    Args:
        question: The question to ask the human
        context: Optional context to help the human understand what's needed
    """
    return f"HUMAN_INPUT_REQUESTED: {question} | Context: {context}"

@tool
def provide_human_response(response: str):
    """
    Provide a response to a human input request. This should only be called by the system
    when processing human input, not by the agent directly.
    """
    return f"HUMAN_RESPONSE: {response}"

# @tool
# def your_tool_here(your_arg: str):
#     """Your tool description here."""
#     print(f"Your tool logic here")
#     return "Your tool response here."

backend_tools = [
    get_weather,
    get_time,
    request_human_input,
    provide_human_response
    # your_tool_here
]

# Extract tool names from backend_tools for comparison
backend_tool_names = [tool.name for tool in backend_tools]


async def chat_node(state: AgentState, config: RunnableConfig) -> Command[Literal["tool_node", "hitl_node", "__end__"]]:
    """
    Standard chat node based on the ReAct design pattern. It handles:
    - The model to use (and binds in CopilotKit actions and the tools defined above)
    - The system prompt
    - Getting a response from the model
    - Handling tool calls

    For more about the ReAct design pattern, see:
    https://www.perplexity.ai/search/react-agents-NcXLQhreS0WDzpVaS4m9Cg
    """

    # 1. Define the model
    model = ChatOpenAI(model="gpt-4o")

    # 2. Bind the tools to the model
    model_with_tools = model.bind_tools(
        [
            *state.get("tools", []), # bind tools defined by ag-ui
            *backend_tools,
            # your_tool_here
        ],

        # 2.1 Disable parallel tool calls to avoid race conditions,
        #     enable this for faster performance if you want to manage
        #     the complexity of running tool calls in parallel.
        parallel_tool_calls=False,
    )

    # 3. Define the system message by which the chat model will be run
    system_message = SystemMessage(
        content=f"""You are a helpful assistant. The current proverbs are {state.get('proverbs', [])}.

You have access to several tools:
- get_weather: Get weather information for locations
- get_time: Get current time for timezones
- request_human_input: Ask for human input when needed
- provide_human_response: Provide responses to human input requests"""
    )

    # 4. Run the model to generate a response
    response = await model_with_tools.ainvoke([
        system_message,
        *state["messages"],
    ], config)

    # Check for HITL requests first
    if route_to_hitl_node(response):
        print("routing to HITL node")
        return Command(
            goto="hitl_node",
            update={
                "messages": [response],
            }
        )
    
    # Route to weather tool node if weather tool is called
    if route_to_weather_tool_node(response):
        print("routing to weather tool node")
        return Command(
            goto="weather_tool_node",
            update={
                "messages": [response],
            }
        )
    
    # Route to tool node if tool is not in the tools list
    if route_to_tool_node(response):
        print("routing to tool node")
        return Command(
            goto="tool_node",
            update={
                "messages": [response],
            }
        )

    # 5. We've handled all tool calls, so we can end the graph.
    return Command(
        goto=END,
        update={
            "messages": [response],
        }
    )


def route_to_weather_tool_node(response: BaseMessage):
    """
    Route to weather tool node if the response contains a weather tool call.
    """
    tool_calls = getattr(response, "tool_calls", None)
    if not tool_calls:
        return False

    for tool_call in tool_calls:
        if tool_call.get("name") == "get_weather":
            return True
    return False


def route_to_tool_node(response: BaseMessage):
    """
    Route to tool node if any tool call in the response matches a backend tool name.
    """
    tool_calls = getattr(response, "tool_calls", None)
    if not tool_calls:
        return False

    for tool_call in tool_calls:
        if tool_call.get("name") in backend_tool_names:
            return True
    return False

def route_to_hitl_node(response: BaseMessage):
    """
    Route to HITL node if the response contains a human input request.
    """
    tool_calls = getattr(response, "tool_calls", None)
    if not tool_calls:
        return False

    for tool_call in tool_calls:
        if tool_call.get("name") == "request_human_input":
            return True
    return False

async def hitl_node(state: AgentState, config: RunnableConfig) -> Command[Literal["chat_node", "__end__"]]:
    """
    Human-in-the-Loop node that handles human input requests.
    This node will pause execution and wait for human input.
    """
    # Check if we have a pending HITL request
    if state.get("hitl_pending", False):
        # If we have a response, process it and continue
        if state.get("hitl_response"):
            return Command(
                goto="chat_node",
                update={
                    "hitl_pending": False,
                    "hitl_question": "",
                    "hitl_response": "",
                    "hitl_context": "",
                    "messages": [{"role": "user", "content": f"Human response: {state.get('hitl_response')}"}]
                }
            )
        else:
            # Still waiting for human input, stay in HITL node
            return Command(goto="hitl_node")
    
    # Process the tool call that requested human input
    last_message = state["messages"][-1]
    if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
        for tool_call in last_message.tool_calls:
            if tool_call.get("name") == "request_human_input":
                args = tool_call.get("args", {})
                question = args.get("question", "Please provide input")
                context = args.get("context", "")
                
                return Command(
                    goto="hitl_node",
                    update={
                        "hitl_pending": True,
                        "hitl_question": question,
                        "hitl_context": context,
                        "hitl_response": "",
                    }
                )
    
    # No HITL request found, continue to chat
    return Command(goto="chat_node")


async def weather_tool_node(state: AgentState, config: RunnableConfig) -> Command[Literal["chat_node"]]:
    """
    Custom tool node that handles weather tool calls and updates the shared state.
    """
    from langchain_core.messages import ToolMessage
    
    # Get the last message which should contain tool calls
    last_message = state["messages"][-1]
    tool_calls = getattr(last_message, "tool_calls", [])
    
    tool_messages = []
    weather_data = None
    
    for tool_call in tool_calls:
        if tool_call["name"] == "get_weather":
            # Execute the weather tool
            location = tool_call["args"]["location"]
            result = get_weather(location)
            
            # The get_weather function now returns a tuple (response, weather_data)
            if isinstance(result, tuple) and len(result) == 2:
                response_text, weather_data = result
                # Ensure all required fields have default values
                weather_data = {
                    "location": weather_data.get("location", location),
                    "temperature": weather_data.get("temperature", "N/A"),
                    "condition": weather_data.get("condition", "Unknown"),
                    "humidity": weather_data.get("humidity", "N/A"),
                    "wind_speed": weather_data.get("wind_speed", "N/A"),
                    "wind_direction": weather_data.get("wind_direction", ""),
                    "feels_like": weather_data.get("feels_like", "N/A"),
                    "visibility": weather_data.get("visibility", ""),
                    "uv_index": weather_data.get("uv_index", ""),
                    "precipitation_chance": weather_data.get("precipitation_chance", ""),
                    "recommendations": weather_data.get("recommendations", []),
                    "clothing_suggestion": weather_data.get("clothing_suggestion", "Dress appropriately for the weather"),
                    "activity_suggestion": weather_data.get("activity_suggestion", "Enjoy outdoor activities")
                }
            else:
                response_text = str(result)
                weather_data = {
                    "location": location,
                    "temperature": "N/A",
                    "condition": "Unknown",
                    "humidity": "N/A",
                    "wind_speed": "N/A",
                    "wind_direction": "",
                    "feels_like": "N/A",
                    "visibility": "",
                    "uv_index": "",
                    "precipitation_chance": "",
                    "recommendations": [],
                    "clothing_suggestion": "Dress appropriately for the weather",
                    "activity_suggestion": "Enjoy outdoor activities"
                }
            
            # Create tool message
            tool_message = ToolMessage(
                content=response_text,
                tool_call_id=tool_call["id"]
            )
            tool_messages.append(tool_message)
    
    # Update state with weather data and tool messages
    update_data = {
        "messages": [*state["messages"], *tool_messages]
    }
    
    if weather_data:
        update_data["weather_data"] = weather_data
    
    return Command(goto="chat_node", update=update_data)


# Define the workflow graph
workflow = StateGraph(AgentState)
workflow.add_node("chat_node", chat_node)
workflow.add_node("tool_node", ToolNode(tools=backend_tools))
workflow.add_node("weather_tool_node", weather_tool_node)
workflow.add_node("hitl_node", hitl_node)
workflow.add_edge("tool_node", "chat_node")
workflow.add_edge("weather_tool_node", "chat_node")
workflow.add_edge("hitl_node", "chat_node")
workflow.set_entry_point("chat_node")

graph = workflow.compile()
