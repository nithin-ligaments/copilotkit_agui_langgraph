# Human-in-the-Loop Agent with CopilotKit

This project demonstrates a Human-in-the-Loop (HITL) agent implementation using LangGraph and CopilotKit. The agent can generate task steps and pause execution to get user input on which steps to perform.

## Features

- **LangGraph Agent**: A sophisticated agent that can plan and execute tasks
- **Human-in-the-Loop**: Interactive step selection where users can enable/disable specific steps
- **CopilotKit Integration**: Modern UI components for seamless interaction
- **Real-time Updates**: Dynamic UI that responds to agent state changes

## How It Works

1. **Task Planning**: When a user asks the agent to perform a task, it generates a list of steps
2. **Step Selection**: The agent pauses execution and presents the steps to the user
3. **User Interaction**: Users can enable/disable specific steps using checkboxes
4. **Execution**: The agent continues with only the enabled steps and provides a creative description

## Usage

1. Navigate to `/hitl` in your browser
2. Start a conversation with the agent
3. Ask it to plan a task (e.g., "Plan a trip to Mars" or "Plan a pasta dish")
4. The agent will generate steps and pause for your input
5. Select which steps to enable/disable
6. Click "Perform Steps" to continue

## Example Prompts

- "Please plan a trip to Mars in 5 steps"
- "Plan a pasta dish in 10 steps"
- "Create a morning routine with 8 steps"
- "Plan a garden project in 6 steps"

## Technical Implementation

### Backend (LangGraph Agent)
- **File**: `agent/human_in_the_loop_agent.py`
- Uses LangGraph's `interrupt()` function to pause execution
- Implements step planning and user interaction handling
- Generates creative responses based on user selections

### Frontend (CopilotKit UI)
- **File**: `src/app/hitl/page.tsx`
- Uses `useLangGraphInterrupt` hook for HITL interactions
- Provides interactive step selection interface
- Real-time UI updates based on agent state

### API Route
- **File**: `src/app/api/copilotkit/langgraph/route.ts`
- Handles communication between frontend and LangGraph agent
- Uses CopilotKit runtime for seamless integration

## Key Components

### InterruptHumanInTheLoop
Handles the main HITL interaction where users select steps:
- Displays step checkboxes
- Tracks enabled/disabled state
- Provides "Perform Steps" button

### StepsFeedback
Alternative component for non-LangGraph integrations:
- Similar functionality to InterruptHumanInTheLoop
- Includes Accept/Reject buttons
- Shows confirmation status

### Step Components
- **StepContainer**: Main wrapper with theme support
- **StepHeader**: Progress bar and step count
- **StepItem**: Individual step with checkbox
- **ActionButton**: Styled buttons for actions

## Styling

The interface uses:
- Gradient backgrounds and modern design
- Smooth animations and transitions
- Responsive design for different screen sizes
- Dark/light theme support (currently defaulted to light)

## Dependencies

- `@copilotkit/react-core`: Core CopilotKit functionality
- `@copilotkit/react-ui`: UI components
- `@copilotkit/runtime`: Runtime for API integration
- `langgraph`: Agent framework
- `langchain`: LLM integration

## Getting Started

1. Install dependencies: `npm install`
2. Set up your OpenAI API key
3. Run the development server: `npm run dev`
4. Navigate to `/hitl` to try the Human-in-the-Loop agent

The agent will automatically handle the conversation flow and pause for user input when generating task steps.
