"use client";

import { useState } from "react";

export default function HomePage() {
  const [expanded, setExpanded] = useState(false);

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-light text-black dark:text-white mb-4">
            Personal AI Operating System
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Click to explore
          </p>
        </header>

        <div className="space-y-2">
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full text-left p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-light text-black dark:text-white">
                  1
                </span>
                <span className="text-gray-400 dark:text-gray-600">
                  {expanded ? "−" : "+"}
                </span>
              </div>
            </button>

            {expanded && (
              <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Business Intelligence</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Revenue tracking and financial analytics with Stripe integration
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-black rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Current Month
                    </h4>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                      $12,500
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      December 2024
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-black rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Revenue
                    </h4>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                      $125,000
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Year to date
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}