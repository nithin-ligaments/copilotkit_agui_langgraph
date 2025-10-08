"use client";

import React, { useState } from "react";
import { CopilotKit, useLangGraphInterrupt } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { InsuranceForm } from "../../components/InsuranceForm";

const CopilotSidebarNoSSR = dynamic(
  () => import("@copilotkit/react-ui").then((mod) => ({ default: mod.CopilotSidebar })),
  { 
    ssr: false,
    loading: () => null 
  }
);

export default function InsurancePage() {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit/langgraph"
      showDevConsole={false}
      agent="insurance_advisor"
    >
      <InsuranceMainContent />
    </CopilotKit>
  );
}

function InsuranceMainContent() {
  const { theme } = useTheme();

  useLangGraphInterrupt({
    render: ({ event, resolve }) => {
      return <InsuranceForm event={event} resolve={resolve} />;
    },
  });

  return (
    <div className="h-screen flex">
      <div className="flex-1">
        <div className="h-screen w-full flex justify-center items-center flex-col transition-colors duration-300" style={{ backgroundColor: "white" }}>
          <div className="bg-gray-100 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-4xl w-full">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">Insurance Advisor</h1>
            <p className="text-gray-600 text-center italic mb-6">Get personalized insurance recommendations! 🛡️</p>
            
            <div className="text-center">
              <div className="bg-white backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="text-2xl mb-2">💬</div>
                    <h3 className="font-semibold text-gray-800 mb-2">1. Ask for Insurance</h3>
                    <p>Use the sidebar to ask me about insurance like "I need health insurance for my family"</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="text-2xl mb-2">📋</div>
                    <h3 className="font-semibold text-gray-800 mb-2">2. Provide Details</h3>
                    <p>I'll ask for your family size, budget, insurance type, and location</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="text-2xl mb-2">🎯</div>
                    <h3 className="font-semibold text-gray-800 mb-2">3. Get Recommendations</h3>
                    <p>I'll provide personalized insurance recommendations based on your needs</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-3">Try These Examples:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
                  <div className="bg-white p-3 rounded border border-blue-100">
                    <span className="block">"I need health insurance for my family of 4"</span>
                  </div>
                  <div className="bg-white p-3 rounded border border-blue-100">
                    <span className="block">"Find me the best auto insurance in California"</span>
                  </div>
                  <div className="bg-white p-3 rounded border border-blue-100">
                    <span className="block">"I want life insurance with a $500/month budget"</span>
                  </div>
                  <div className="bg-white p-3 rounded border border-blue-100">
                    <span className="block">"Recommend home insurance for my new house"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CopilotSidebarNoSSR
        clickOutsideToClose={false}
        defaultOpen={true}
        labels={{
          title: "Insurance Advisor",
          initial: "👋 Hi! I'm your AI insurance advisor. I can help you find the best insurance coverage by analyzing your needs and comparing providers.\n\nTry asking me:\n- \"I need health insurance for my family of 4\"\n- \"Find me the best auto insurance in California\"\n- \"I want life insurance with a $500/month budget\"\n\nI'll collect your requirements and provide personalized recommendations!"
        }}
        className="copilot-sidebar-custom"
      />
    </div>
  );
}
