"use client";

import { useCoAgent, useCopilotAction, useLangGraphInterrupt, CopilotKit } from "@copilotkit/react-core";
import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

// Dynamically import CopilotSidebar with SSR disabled to prevent hydration issues
const CopilotSidebarNoSSR = dynamic(
  () => import("@copilotkit/react-ui").then((mod) => ({ default: mod.CopilotSidebar })),
  { 
    ssr: false,
    loading: () => null // Don't show loading state
  }
);

export default function CopilotKitPage() {
  const [themeColor, setThemeColor] = useState("#6366f1");

  return (
    <CopilotKit
      runtimeUrl={`/api/copilotkit/langgraph`}
      showDevConsole={false}
      agent="human_in_the_loop"
    >
      <MainContentWithActions themeColor={themeColor} setThemeColor={setThemeColor} />
    </CopilotKit>
  );
}

function MainContentWithActions({ themeColor, setThemeColor }: { themeColor: string; setThemeColor: (color: string) => void }) {
  // 🪁 Frontend Actions: https://docs.copilotkit.ai/guides/frontend-actions
  useCopilotAction({
    name: "setThemeColor",
    parameters: [{
      name: "themeColor",
      description: "The theme color to set. Make sure to pick nice colors.",
      required: true, 
    }],
    handler({ themeColor }) {
      setThemeColor(themeColor);
    },
  });

  return (
    <main style={{ "--copilot-kit-primary-color": themeColor } as CopilotKitCSSProperties}>
      <HITLMainContent themeColor={themeColor} />
      <CopilotSidebarNoSSR
        clickOutsideToClose={false}
        defaultOpen={true}
        labels={{
          title: "Human-in-the-Loop Agent",
          initial: "👋 Hi! I'm your Human-in-the-Loop agent. I can help you plan tasks and get your input on the steps.\n\nTry asking me to:\n- **Plan a trip to Mars in 5 steps**\n- **Create a morning routine with 8 steps**\n- **Plan a pasta dish in 10 steps**\n\nI'll generate step-by-step plans and ask for your approval before proceeding!"
        }}
        className="copilot-sidebar-custom !fixed !bottom-4 !right-4 !z-50"
      />
    </main>
  );
}

// State of the agent, make sure this aligns with your agent's state.
type AgentState = {
  proverbs: string[];
  // Weather state
  weather_data: {
    location: string;
    temperature: string;
    condition: string;
    humidity: string;
    wind_speed: string;
    wind_direction: string;
    feels_like: string;
    visibility: string;
    uv_index: string;
    precipitation_chance: string;
    recommendations: string[];
    clothing_suggestion: string;
    activity_suggestion: string;
  } | null;
  // HITL (Human-in-the-Loop) state
  hitl_pending: boolean;
  hitl_question: string;
  hitl_response: string;
  hitl_context: string;
}

// HITL Step Interface
interface Step {
  description: string;
  status: "disabled" | "enabled" | "executing";
}

// HITL UI Components
const StepContainer = ({ theme, children }: { theme?: string; children: React.ReactNode }) => (
  <div data-testid="select-steps" className="flex justify-center">
    <div
      className={`relative rounded-xl w-[600px] p-6 shadow-lg backdrop-blur-sm ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700/50 shadow-2xl"
          : "bg-gradient-to-br from-white via-gray-50 to-white text-gray-800 border border-gray-200/80"
      }`}
    >
      {children}
    </div>
  </div>
);

const StepHeader = ({
  theme,
  enabledCount,
  totalCount,
  status,
  showStatus = false,
}: {
  theme?: string;
  enabledCount: number;
  totalCount: number;
  status?: string;
  showStatus?: boolean;
}) => (
  <div className="mb-5">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Select Steps
      </h2>
      <div className="flex items-center gap-3">
        <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}>
          {enabledCount}/{totalCount} Selected
        </div>
        {showStatus && (
          <div
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              status === "executing"
                ? theme === "dark"
                  ? "bg-blue-900/30 text-blue-300 border border-blue-500/30"
                  : "bg-blue-50 text-blue-600 border border-blue-200"
                : theme === "dark"
                  ? "bg-slate-700 text-slate-300"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {status === "executing" ? "Ready" : "Waiting"}
          </div>
        )}
      </div>
    </div>

    <div
      className={`relative h-2 rounded-full overflow-hidden ${theme === "dark" ? "bg-slate-700" : "bg-gray-200"}`}
    >
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${totalCount > 0 ? (enabledCount / totalCount) * 100 : 0}%` }}
      />
    </div>
  </div>
);

const StepItem = ({
  step,
  theme,
  status,
  onToggle,
  disabled = false,
}: {
  step: { description: string; status: string };
  theme?: string;
  status?: string;
  onToggle: () => void;
  disabled?: boolean;
}) => (
  <div
    className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
      step.status === "enabled"
        ? theme === "dark"
          ? "bg-gradient-to-r from-blue-900/20 to-purple-900/10 border border-blue-500/30"
          : "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/60"
        : theme === "dark"
          ? "bg-slate-800/30 border border-slate-600/30"
          : "bg-gray-50/50 border border-gray-200/40"
    }`}
  >
    <label data-testid="step-item" className="flex items-center cursor-pointer w-full">
      <div className="relative">
        <input
          type="checkbox"
          checked={step.status === "enabled"}
          onChange={onToggle}
          className="sr-only"
          disabled={disabled}
        />
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            step.status === "enabled"
              ? "bg-gradient-to-br from-blue-500 to-purple-600 border-blue-500"
              : theme === "dark"
                ? "border-slate-400 bg-slate-700"
                : "border-gray-300 bg-white"
          } ${disabled ? "opacity-60" : ""}`}
        >
          {step.status === "enabled" && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      <span
        data-testid="step-text"
        className={`ml-3 font-medium transition-all duration-300 ${
          step.status !== "enabled" && status != "inProgress"
            ? `line-through ${theme === "dark" ? "text-slate-500" : "text-gray-400"}`
            : theme === "dark"
              ? "text-white"
              : "text-gray-800"
        } ${disabled ? "opacity-60" : ""}`}
      >
        {step.description}
      </span>
    </label>
  </div>
);

const ActionButton = ({
  variant,
  theme,
  disabled,
  onClick,
  children,
}: {
  variant: "primary" | "secondary" | "success" | "danger";
  theme?: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-all duration-200";
  const enabledClasses = "hover:scale-105 shadow-md hover:shadow-lg";
  const disabledClasses = "opacity-50 cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg hover:shadow-xl",
    secondary:
      theme === "dark"
        ? "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500"
        : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 hover:border-gray-400",
    success:
      "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl",
  };

  return (
    <button
      className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses} ${
        disabled && variant === "secondary"
          ? "bg-gray-200 text-gray-500"
          : disabled && variant === "success"
            ? "bg-gray-400"
            : variantClasses[variant]
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const DecorativeElements = ({
  theme,
  variant = "default",
}: {
  theme?: string;
  variant?: "default" | "success" | "danger";
}) => (
  <>
    <div
      className={`absolute top-3 right-3 w-16 h-16 rounded-full blur-xl ${
        variant === "success"
          ? theme === "dark"
            ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10"
            : "bg-gradient-to-br from-green-200/30 to-emerald-200/30"
          : variant === "danger"
            ? theme === "dark"
              ? "bg-gradient-to-br from-red-500/10 to-pink-500/10"
              : "bg-gradient-to-br from-red-200/30 to-pink-200/30"
            : theme === "dark"
              ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10"
              : "bg-gradient-to-br from-blue-200/30 to-purple-200/30"
      }`}
    />
    <div
      className={`absolute bottom-3 left-3 w-12 h-12 rounded-full blur-xl ${
        variant === "default"
          ? theme === "dark"
            ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10"
            : "bg-gradient-to-br from-purple-200/30 to-pink-200/30"
          : "opacity-50"
      }`}
    />
  </>
);

function HITLMainContent({ themeColor }: { themeColor: string }) {
  const { theme } = useTheme();
  const [localSteps, setLocalSteps] = useState<Step[]>([]);
  const [accepted, setAccepted] = useState<boolean | null>(null);

  // LangGraph interrupt handler for HITL functionality
  useLangGraphInterrupt({
    render: ({ event, resolve }) => {
      let initialSteps: Step[] = [];
      if (event.value && event.value.steps && Array.isArray(event.value.steps)) {
        initialSteps = event.value.steps.map((step: any) => ({
          description: typeof step === "string" ? step : step.description || "",
          status: typeof step === "object" && step.status ? step.status : "enabled",
        }));
      }

      const enabledCount = initialSteps.filter((step) => step.status === "enabled").length;

      const handleStepToggle = (index: number) => {
        setLocalSteps((prevSteps) =>
          prevSteps.map((step, i) =>
            i === index
              ? { ...step, status: step.status === "enabled" ? "disabled" : "enabled" }
              : step,
          ),
        );
      };

      const handlePerformSteps = () => {
        const selectedSteps = localSteps
          .filter((step) => step.status === "enabled")
          .map((step) => step.description);
        resolve("The user selected the following steps: " + selectedSteps.join(", "));
      };

      return (
        <StepContainer theme={theme}>
          <StepHeader theme={theme} enabledCount={enabledCount} totalCount={initialSteps.length} />

          <div className="space-y-3 mb-6">
            {initialSteps.map((step, index) => (
              <StepItem
                key={index}
                step={step}
                theme={theme}
                onToggle={() => handleStepToggle(index)}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <ActionButton variant="primary" theme={theme} onClick={handlePerformSteps}>
              <span className="text-lg">✨</span>
              Perform Steps
              <span
                className={`ml-1 px-2 py-1 rounded-full text-xs font-bold ${
                  theme === "dark" ? "bg-purple-800/50" : "bg-purple-600/20"
                }`}
              >
                {enabledCount}
              </span>
            </ActionButton>
          </div>

          <DecorativeElements theme={theme} />
        </StepContainer>
      );
    },
  });

  return (
    <div
      style={{ backgroundColor: "white" }}
      className="h-screen w-screen flex justify-center items-center flex-col transition-colors duration-300"
    >
      <div className="bg-gray-100 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">Human-in-the-Loop Agent</h1>
        <p className="text-gray-600 text-center italic mb-6">Plan tasks and get your input on the steps! 🚀</p>
        
        <div className="text-center">
          <div className="bg-white backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-2xl mb-2">💬</div>
                <h3 className="font-semibold text-gray-800 mb-2">1. Ask for a Plan</h3>
                <p>Use the sidebar to ask me to plan tasks like "Plan a trip to Mars in 5 steps"</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-2xl mb-2">✅</div>
                <h3 className="font-semibold text-gray-800 mb-2">2. Select Steps</h3>
                <p>I'll show you step-by-step plans where you can select which steps to execute</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold text-gray-800 mb-2">3. Execute</h3>
                <p>Confirm your selection and I'll provide a creative description of the execution</p>
              </div>
            </div>
          </div>
            </div>
            
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-3">Available Agents:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
              <a 
                href="/insurance" 
                className="bg-white p-3 rounded border border-blue-100 hover:bg-blue-50 transition-colors"
              >
                🛡️ Insurance Advisor
              </a>
              <div className="bg-white p-3 rounded border border-blue-100">
                <span className="block">🚀 Task Planner (Current)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple sun icon for the weather card
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-yellow-200">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeWidth="2" stroke="currentColor" />
    </svg>
  );
}

// Weather card component where the location and themeColor are based on what the agent
// sets via tool calls.
function WeatherCard({ location, themeColor }: { location?: string, themeColor: string }) {
  return (
    <div
    style={{ backgroundColor: themeColor }}
    className="rounded-xl shadow-xl mt-6 mb-4 max-w-md w-full"
  >
    <div className="bg-white/20 p-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white capitalize">{location}</h3>
          <p className="text-white">Current Weather</p>
        </div>
        <SunIcon />
      </div>
      
      <div className="mt-4 flex items-end justify-between">
        <div className="text-3xl font-bold text-white">70°</div>
        <div className="text-sm text-white">Clear skies</div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-white text-xs">Humidity</p>
            <p className="text-white font-medium">45%</p>
          </div>
          <div>
            <p className="text-white text-xs">Wind</p>
            <p className="text-white font-medium">5 mph</p>
          </div>
          <div>
            <p className="text-white text-xs">Feels Like</p>
            <p className="text-white font-medium">72°</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

// Clock icon for the time card
function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-blue-200">
      <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="none" />
      <path d="M12 6v6l4 2" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Time card component where the timezone and themeColor are based on what the agent
// sets via tool calls.
function TimeCard({ timezone, themeColor }: { timezone?: string, themeColor: string }) {
  const [currentTime, setCurrentTime] = useState("");
  const [mounted, setMounted] = useState(false);
  
  // Update time every second
  useEffect(() => {
    // Set mounted to true and initialize time on client side only
    setMounted(true);
    setCurrentTime(new Date().toLocaleTimeString());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="rounded-xl shadow-xl mt-6 mb-4 max-w-md w-full"
    >
      <div className="bg-white/20 p-4 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white capitalize">{timezone || 'Local Time'}</h3>
            <p className="text-white">Current Time</p>
          </div>
          <ClockIcon />
        </div>
        
        <div className="mt-4 flex items-end justify-between">
          <div className="text-3xl font-bold text-white font-mono">
            {mounted ? currentTime : "--:--:--"}
          </div>
          <div className="text-sm text-white">Live</div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <p className="text-white text-xs">Date</p>
              <p className="text-white font-medium">
                {mounted ? new Date().toLocaleDateString() : "--/--/----"}
              </p>
            </div>
            <div>
              <p className="text-white text-xs">Timezone</p>
              <p className="text-white font-medium">{timezone || 'Local'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Human icon for the HITL card
function HumanIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-orange-200">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  );
}

// HITL card component for human input requests
function HITLCard({ 
  question, 
  context, 
  themeColor, 
  onResponse,
  onStart
}: { 
  question: string, 
  context?: string, 
  themeColor: string, 
  onResponse: (response: string) => void,
  onStart?: () => void
}) {
  const [response, setResponse] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Call onStart when component mounts
  useEffect(() => {
    if (onStart) {
      onStart();
    }
  }, [onStart]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (response.trim() && !isSubmitted) {
      setIsSubmitted(true);
      onResponse(response.trim());
      setResponse("");
    }
  };

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="rounded-xl shadow-xl mt-6 mb-4 max-w-md w-full"
    >
      <div className="bg-white/20 p-4 w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Human Input Required</h3>
            <p className="text-white text-sm">The agent needs your input</p>
          </div>
          <HumanIcon />
        </div>
        
        <div className="mb-4">
          <p className="text-white font-medium mb-2">Question:</p>
          <p className="text-white/90 text-sm bg-white/10 p-3 rounded-lg">{question}</p>
          {context && (
            <div className="mt-2">
              <p className="text-white/70 text-xs mb-1">Context:</p>
              <p className="text-white/80 text-xs bg-white/5 p-2 rounded">{context}</p>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-white text-sm font-medium block mb-1">
              Your Response:
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder={isSubmitted ? "Response submitted, waiting for agent..." : "Type your response here..."}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
              rows={3}
              required
              disabled={isSubmitted}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitted || !response.trim()}
            className={`w-full font-medium py-2 px-4 rounded-lg transition-colors duration-200 border ${
              isSubmitted 
                ? "bg-green-500/20 text-green-200 border-green-400/30 cursor-not-allowed" 
                : "bg-white/20 hover:bg-white/30 text-white border-white/30"
            }`}
          >
            {isSubmitted ? "Response Submitted ✓" : "Submit Response"}
          </button>
        </form>
      </div>
    </div>
  );
}

