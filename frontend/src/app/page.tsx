"use client";

import { useState } from "react";

export default function HomePage() {
  const [expanded, setExpanded] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-8 py-24">
        <header className="mb-32">
          <h1 className="text-2xl font-extralight tracking-wider">
            PAIOS
          </h1>
        </header>

        <div className="space-y-16">
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-6xl font-extralight hover:opacity-60 transition-opacity duration-200"
            >
              1
            </button>

            {expanded && (
              <div className="mt-8 space-y-6 text-lg font-light">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">
                    Business Intelligence
                  </p>
                  <p className="text-gray-600">
                    Revenue tracking and financial analytics
                  </p>
                </div>
                
                <div className="space-y-3 pt-4">
                  <div>
                    <p className="text-gray-400 text-sm">Current Month</p>
                    <p className="text-2xl">$12,500</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-2xl">$125,000</p>
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