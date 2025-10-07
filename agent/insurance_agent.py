"""
A LangGraph implementation of the insurance advisor agent with human-in-the-loop functionality.
"""

from typing import Dict, List, Any, Annotated, Optional
import os

# LangGraph imports
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import SystemMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END, START
from langgraph.types import Command, interrupt
from langgraph.graph import MessagesState
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

class InsuranceDetails(BaseModel):
    """
    Insurance requirements details.
    """
    number_of_persons: int = Field(description="Number of people to be covered")
    budget_range: str = Field(description="Budget range for insurance premium")
    insurance_type: str = Field(description="Type of insurance needed")
    location: str = Field(description="Location/state for insurance coverage")

@tool
def collect_insurance_details(
    details: Annotated[
        InsuranceDetails,
        "Insurance requirements including number of persons, budget, type, and location"
    ]
):
    """
    ALWAYS call this function when users ask about insurance. Collect detailed insurance requirements from the user including family size, 
    budget range, insurance type, and location to provide personalized recommendations.
    
    This function MUST be called immediately when users mention insurance needs.
    """

class AgentState(MessagesState):
    """
    State of the insurance agent.
    """
    insurance_details: Dict[str, Any] = {}

async def start_node(state: Dict[str, Any], config: RunnableConfig): # pylint: disable=unused-argument
    """
    This is the entry point for the insurance advisor flow.
    """
    # Initialize insurance details if not exists
    if "insurance_details" not in state:
        state["insurance_details"] = {}

    # Return command to route to chat_node
    return Command(
        goto="chat_node",
        update={
            "messages": state["messages"],
            "insurance_details": state["insurance_details"],
        }
    )

async def chat_node(state: AgentState, config: Optional[RunnableConfig] = None):
    """
    Standard chat node where the agent processes messages and generates responses.
    If insurance details are needed, the agent will interrupt to collect them.
    """
    system_prompt = """
    You are an expert insurance advisor AI assistant. Your primary role is to help users find the best insurance coverage by analyzing their needs, researching providers, and providing personalized recommendations.

    CRITICAL INSTRUCTION: When users ask about insurance (like "I need health insurance for my family of 4"), you MUST immediately call the `collect_insurance_details` function. Do NOT provide a text response asking for details - use the tool instead.

    Example: If user says "I need health insurance for my family of 4", immediately call:
    collect_insurance_details(details={
        "number_of_persons": 4,
        "budget_range": "",
        "insurance_type": "health", 
        "location": ""
    })

    The tool will collect:
    - Number of persons to be covered
    - Budget range for premiums  
    - Type of insurance needed (health, life, auto, home, etc.)
    - Location/state for coverage

    Always call the tool first when users mention insurance needs, then provide recommendations based on their input.
    """

    # Define the model
    model = ChatOpenAI(model="gpt-4o-mini")

    # Define config for the model
    if config is None:
        config = RunnableConfig(recursion_limit=25)

    # Use "predict_state" metadata to set up streaming for the collect_insurance_details tool
    config["metadata"]["predict_state"] = [{
        "state_key": "insurance_details",
        "tool": "collect_insurance_details",
        "tool_argument": "details"
    }]

    # Bind the tools to the model
    model_with_tools = model.bind_tools(
        [
            collect_insurance_details
        ],
        # Disable parallel tool calls to avoid race conditions
        parallel_tool_calls=False,
    )

    # Run the model and generate a response
    response = await model_with_tools.ainvoke([
        SystemMessage(content=system_prompt),
        *state["messages"],
    ], config)

    # Update messages with the response
    messages = state["messages"] + [response]

    # Handle tool calls
    if hasattr(response, "tool_calls") and response.tool_calls and len(response.tool_calls) > 0:
        # Handle dicts or object (backward compatibility)
        tool_call = (response.tool_calls[0]
                     if isinstance(response.tool_calls[0], dict)
                     else vars(response.tool_calls[0]))

        if tool_call["name"] == "collect_insurance_details":
            # Get the insurance details from the tool call
            details_raw = tool_call["args"]["details"]

            # Process the insurance details
            insurance_data = {}
            if isinstance(details_raw, dict):
                insurance_data = {
                    "number_of_persons": details_raw.get("number_of_persons", 1),
                    "budget_range": details_raw.get("budget_range", ""),
                    "insurance_type": details_raw.get("insurance_type", ""),
                    "location": details_raw.get("location", "")
                }

            # If no details were processed correctly, return to END with the updated messages
            if not insurance_data or not any(insurance_data.values()):
                return Command(
                    goto=END,
                    update={
                        "messages": messages,
                        "insurance_details": state["insurance_details"],
                    }
                )

            # Update insurance details in state
            state["insurance_details"] = insurance_data

            # Add a tool response to satisfy OpenAI's requirements
            from langchain_core.messages import ToolMessage
            tool_response = ToolMessage(
                content="Insurance details collected successfully.",
                tool_call_id=tool_call["id"]
            )

            messages = messages + [tool_response]

            # Move to the process_insurance_node which will handle the interrupt and final response
            return Command(
                goto="process_insurance_node",
                update={
                    "messages": messages,
                    "insurance_details": state["insurance_details"],
                }
            )

    # If no tool calls or not collect_insurance_details, return to END with the updated messages
    return Command(
        goto=END,
        update={
            "messages": messages,
            "insurance_details": state["insurance_details"],
        }
    )

async def process_insurance_node(state: Dict[str, Any], config: RunnableConfig):
    """
    This node handles the user interrupt for insurance details collection and generates recommendations.
    """
    # Check if we already have user_response in the state
    # This happens when the node restarts after an interrupt
    if "user_response" in state and state["user_response"]:
        user_response = state["user_response"]
    else:
        # Use LangGraph interrupt to get user input on insurance details
        # This will pause execution and wait for user input in the frontend
        user_response = interrupt({"insurance_details": state["insurance_details"]})
        # Store the user response in state for when the node restarts
        state["user_response"] = user_response

    # Generate personalized insurance recommendations
    final_prompt = f"""
    Based on the user's insurance requirements, provide personalized insurance recommendations.
    
    User Requirements:
    - Number of persons: {state['insurance_details'].get('number_of_persons', 'Not specified')}
    - Budget range: {state['insurance_details'].get('budget_range', 'Not specified')}
    - Insurance type: {state['insurance_details'].get('insurance_type', 'Not specified')}
    - Location: {state['insurance_details'].get('location', 'Not specified')}
    
    Provide 3-5 specific insurance recommendations with:
    1. Company name and plan name
    2. Coverage details
    3. Estimated monthly/annual premium
    4. Key benefits and features
    5. Why this plan fits their needs
    
    Make the recommendations practical, detailed, and tailored to their specific situation.
    Format the response in a clear, easy-to-read manner.
    """

    final_response = await ChatOpenAI(model="gpt-4o").ainvoke([
        SystemMessage(content=final_prompt),
        {"role": "user", "content": user_response}
    ], config)

    # Add the final response to messages
    # Ensure the final_response is properly formatted as a LangChain message
    if not hasattr(final_response, 'id'):
        from langchain_core.messages import AIMessage
        final_response = AIMessage(content=final_response.content)
    
    messages = state["messages"] + [final_response]

    # Clear the user_response from state to prepare for future interactions
    if "user_response" in state:
        state.pop("user_response")

    # Return to END with the updated messages
    return Command(
        goto=END,
        update={
            "messages": messages,
            "insurance_details": state["insurance_details"],
        }
    )

# Define the graph
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("start_node", start_node)
workflow.add_node("chat_node", chat_node)
workflow.add_node("process_insurance_node", process_insurance_node)

# Add edges
workflow.set_entry_point("start_node")
workflow.add_edge(START, "start_node")
workflow.add_edge("start_node", "chat_node")
workflow.add_edge("process_insurance_node", END)

# Conditionally use a checkpointer based on the environment
# Check for multiple indicators that we're running in LangGraph dev/API mode
is_fast_api = os.environ.get("LANGGRAPH_FAST_API", "false").lower() == "true"

# Compile the graph
if is_fast_api:
    # For CopilotKit and other contexts, use MemorySaver
    from langgraph.checkpoint.memory import MemorySaver
    memory = MemorySaver()
    graph = workflow.compile(checkpointer=memory)
else:
    # When running in LangGraph API/dev, don't use a custom checkpointer
    graph = workflow.compile()
