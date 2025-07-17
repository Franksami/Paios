"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAgentStore } from "../../stores/agent-store";
import { BusinessIntelligenceDisplay } from "./displays/BusinessIntelligenceDisplay";
// Temporarily commented out for single-agent deployment
// import { SystemArchitectureDisplay } from "./displays/SystemArchitectureDisplay";

interface AgentDisplayProps {
  agentNumber: number;
  agentName: string;
  agentDescription: string;
}

export function AgentDisplay({
  agentNumber,
  agentName,
  agentDescription,
}: AgentDisplayProps) {
  const { initializeAgent, agents } = useAgentStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const agent = agents[agentNumber];

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await initializeAgent(agentNumber);
      } catch (err: any) {
        setError(err.message || "Failed to initialize agent");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [agentNumber, initializeAgent]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full"
          />
          <p className="text-gray-600 dark:text-gray-400">
            Initializing {agentName}...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  // Render agent-specific display component
  const renderAgentContent = () => {
    switch (agentNumber) {
      case 1:
        return <BusinessIntelligenceDisplay agent={agent} />;
      // Temporarily commented out for single-agent deployment
      // case 31:
      //   return <SystemArchitectureDisplay agent={agent} />;
      // Add other agent displays here as they are implemented
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              {agentName} is ready. Implementation coming soon.
            </p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {agentName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {agentDescription}
        </p>
      </div>

      {renderAgentContent()}
    </motion.div>
  );
}
