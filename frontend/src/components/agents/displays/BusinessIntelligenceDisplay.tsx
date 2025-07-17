"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAgentStore } from "@/stores/agent-store";

interface BusinessIntelligenceDisplayProps {
  agent: any;
}

export function BusinessIntelligenceDisplay({}: BusinessIntelligenceDisplayProps) {
  const { executeCommand } = useAgentStore();
  const [activeView, setActiveView] = useState<
    "revenue" | "expenses" | "profit" | "growth"
  >("revenue");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load initial data
    loadData("revenue");
  }, []);

  const loadData = async (view: string) => {
    setIsLoading(true);
    try {
      const command = {
        action: `get_${view}`,
        parameters: {},
        userId: "demo-user",
        requestId: `req-${Date.now()}`,
        timestamp: new Date(),
      };

      const response = await executeCommand(1, command);
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewChange = (
    view: "revenue" | "expenses" | "profit" | "growth",
  ) => {
    setActiveView(view);
    loadData(view);
  };

  const renderMetricCard = (
    title: string,
    value: string,
    subtitle?: string,
    trend?: string,
  ) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6"
    >
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </h4>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
        {value}
      </p>
      {subtitle && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {subtitle}
        </p>
      )}
      {trend && (
        <p
          className={`text-sm mt-2 ${trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}
        >
          {trend}
        </p>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-800">
        {(["revenue", "expenses", "profit", "growth"] as const).map((view) => (
          <button
            key={view}
            onClick={() => handleViewChange(view)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeView === view
                ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      {/* Data Display */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full"
          />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeView === "revenue" && data.current && (
              <>
                {renderMetricCard(
                  "Current Month",
                  data.current.formatted,
                  data.current.month,
                )}
                {renderMetricCard(
                  "Total Revenue",
                  data.total.formatted,
                  "Year to date",
                )}
              </>
            )}
            {activeView === "expenses" && data.current && (
              <>
                {renderMetricCard(
                  "Current Month",
                  data.current.formatted,
                  data.current.month,
                )}
                {renderMetricCard(
                  "Total Expenses",
                  data.total.formatted,
                  "Year to date",
                )}
              </>
            )}
            {activeView === "profit" && data.current && (
              <>
                {renderMetricCard(
                  "Current Month",
                  data.current.formatted,
                  `${data.current.month} (${data.current.margin}% margin)`,
                )}
                {renderMetricCard(
                  "Average Profit",
                  data.average.formatted,
                  "Monthly average",
                )}
              </>
            )}
            {activeView === "growth" && data.current && (
              <>
                {renderMetricCard(
                  "Current Growth",
                  data.current.formatted,
                  data.current.month,
                )}
                {renderMetricCard(
                  "Average Growth",
                  data.average.formatted,
                  `Trend: ${data.trend}`,
                )}
              </>
            )}
          </div>

          {/* Monthly Data */}
          {data.monthly && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Monthly Breakdown
              </h4>
              <div className="space-y-3">
                {data.monthly.map((month: any, index: number) => (
                  <motion.div
                    key={month.month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-800 last:border-0"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {month.month}
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {month.formatted}
                      </span>
                      {month.margin && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          ({month.margin}%)
                        </span>
                      )}
                      {month.growth !== undefined && month.growth !== 0 && (
                        <span
                          className={`text-xs ml-2 ${
                            month.growth > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {month.growth > 0 ? "+" : ""}
                          {month.growth}%
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
        <button className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          Export Data
        </button>
        <button className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          Generate Report
        </button>
        <button className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          Connect Stripe
        </button>
      </div>
    </div>
  );
}
