# CopilotKit <> LangGraph Starter

This is a comprehensive starter template for building AI agents using [LangGraph](https://www.langchain.com/langgraph) and [CopilotKit](https://copilotkit.ai). It provides a modern Next.js application with integrated LangGraph agents, including Human-in-the-Loop (HITL) functionality and insurance processing capabilities.

## 🚀 Features

- **Multiple Agent Types**: 
  - General purpose LangGraph agent
  - Human-in-the-Loop (HITL) agent with interactive step selection
  - Insurance processing agent
- **Modern UI**: Next.js 15 with React 19 and Tailwind CSS 4
- **Easy Development**: One-command setup and startup
- **TypeScript**: Full TypeScript support
- **Responsive Design**: Mobile-friendly interface

## Prerequisites

- **Node.js 18+** 
- **Python 3.8+**
- **pnpm** (recommended) or npm
- **OpenAI API Key** (for the LangGraph agents)

## 🛠️ Quick Start

### Option 1: One-Command Setup (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd copilotkit_agui_langgraph

# Set up your OpenAI API key
echo 'OPENAI_API_KEY=your-openai-api-key-here' > .env

# Start everything with one command
./start-dev.sh
```

This will:
- Install all dependencies (frontend + backend)
- Set up Python virtual environment
- Start both UI and agent servers
- Handle port management automatically

### Option 2: Manual Setup

1. **Install dependencies:**
```bash
# Using pnpm (recommended)
pnpm install

# Using npm
npm install
```

2. **Set up your OpenAI API key:**
```bash
echo 'OPENAI_API_KEY=your-openai-api-key-here' > .env
```

3. **Start the development server:**
```bash
# Using pnpm
pnpm dev

# Using npm
npm run dev
```

## 📱 Available Pages

- **`/`** - Insurance advisor landing page with "Try Assistant" button
- **`/insurance`** - Insurance processing agent with form interface

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `./start-dev.sh` | **One-command setup** - Installs dependencies and starts all servers |
| `pnpm dev` | Starts both UI and agent servers in development mode |
| `pnpm dev:debug` | Starts development servers with debug logging enabled |
| `pnpm dev:ui` | Starts only the Next.js UI server (port 3000) |
| `pnpm dev:agent` | Starts only the LangGraph agent server (port 8123) |
| `pnpm build` | Builds the Next.js application for production |
| `pnpm start` | Starts the production server |
| `pnpm lint` | Runs ESLint for code linting |
| `pnpm install:agent` | Installs Python dependencies for the agent |

## 🏗️ Project Structure

```
├── agent/                          # Python LangGraph agents
│   ├── insurance_agent.py         # Insurance processing agent
│   ├── requirements.txt           # Python dependencies
│   └── langgraph.json            # LangGraph configuration
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main application page
│   │   ├── insurance/            # Insurance agent page
│   │   └── api/copilotkit/       # API routes for CopilotKit
│   └── components/
│       └── InsuranceForm.tsx     # Insurance form component
├── scripts/
│   ├── setup-agent.sh           # Agent setup script
│   └── setup-agent.bat          # Windows agent setup script
├── start-dev.sh                 # One-command development setup
└── package.json                 # Node.js dependencies and scripts
```

## 🎯 Agent Types

### Insurance Agent (`/` and `/insurance`)
- Specialized for insurance processing
- Form-based interface for data collection
- Structured data handling and validation
- Provides personalized insurance recommendations

## 🚀 Development Workflow

### Using the Development Script
The `start-dev.sh` script provides a complete development environment:

```bash
# Start everything
./start-dev.sh

# The script will:
# 1. Clear ports 3000 and 8123
# 2. Install frontend dependencies
# 3. Set up Python virtual environment
# 4. Install Python dependencies
# 5. Start both servers concurrently
```

### Manual Development
If you prefer manual control:

```bash
# Terminal 1: Start frontend
pnpm dev:ui

# Terminal 2: Start agent
pnpm dev:agent
```

## 📚 Documentation

- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/) - Learn more about LangGraph and its features
- [CopilotKit Documentation](https://docs.copilotkit.ai) - Explore CopilotKit's capabilities
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Styling framework

## 🔧 Troubleshooting

### Port Already in Use
If you get port conflicts:
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9
lsof -ti:8123 | xargs kill -9

# Or use the development script which handles this automatically
./start-dev.sh
```

### Agent Connection Issues
If you see "I'm having trouble connecting to my tools":
1. Ensure the LangGraph agent is running on port 8123 (not 8000)
2. Check your OpenAI API key in `.env`
3. Verify both servers started successfully

### Python Dependencies
If you encounter Python import errors:
```bash
# Reinstall Python dependencies
pnpm install:agent

# Or manually
cd agent
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Permission Errors
If you get permission errors with npm:
```bash
# Use pnpm instead (recommended)
pnpm install
pnpm dev

# Or fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

## 🤝 Contributing

Feel free to submit issues and enhancement requests! This starter is designed to be easily extensible.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.