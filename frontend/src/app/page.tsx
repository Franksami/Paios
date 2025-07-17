"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [showData, setShowData] = useState(true);
  const [nodeButtonPosition, setNodeButtonPosition] = useState("right-8");
  const [isAnimating, setIsAnimating] = useState(false);

  const nodeColors = {
    1: "bg-black",
    2: "bg-orange-300", // Pastel Anthropic orange
    3: "bg-sky-300",    // Pastel blue
    4: "bg-green-300",  // Pastel green
    5: "bg-purple-300", // Pastel purple
  };

  const handleNumberClick = (num: number) => {
    setSelectedNumber(num);
    setShowData(true);
    // Trigger magnetic animation
    setIsAnimating(true);
    setTimeout(() => {
      setNodeButtonPosition("right-24");
    }, 50);
  };

  const handleMainNavClick = () => {
    // Hide current node button with animation
    setNodeButtonPosition("right-8");
    setIsAnimating(false);
    
    setTimeout(() => {
      if (selectedNumber === null) {
        setSelectedNumber(1);
      } else {
        setSelectedNumber(selectedNumber === 5 ? 1 : selectedNumber + 1);
      }
      setShowData(true);
      
      // Show new node button with magnetic animation
      setTimeout(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setNodeButtonPosition("right-24");
        }, 50);
      }, 100);
    }, 200);
  };

  const handleNodeControlClick = () => {
    setShowData(!showData);
  };

  const numbers = [1, 2, 3, 4, 5];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-8 py-24">
        <header className="mb-32">
          <h1 className="text-2xl font-extralight tracking-wider">
            PAIOS
          </h1>
        </header>

        <div className="space-y-4">
          {numbers.map((num) => (
            <div key={num}>
              <button
                onClick={() => handleNumberClick(num)}
                className={`text-xl font-light transition-all duration-200 ${
                  selectedNumber === null
                    ? "text-black hover:opacity-60"
                    : selectedNumber === num
                    ? "text-black"
                    : "text-gray-300"
                }`}
              >
                {num}.
              </button>

              {selectedNumber === num && (
                <div className="ml-6 mt-3 space-y-4 text-base font-light">
                  {num === 1 && (
                    <>
                      <div>
                        <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">
                          Business Intelligence
                        </p>
                        <p className="text-gray-600">
                          Revenue tracking and financial analytics
                        </p>
                      </div>
                      
                      {showData && (
                        <div className="space-y-3 pt-2">
                          <div>
                            <p className="text-gray-400 text-sm">Current Month</p>
                            <p className="text-xl">$12,500</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-400 text-sm">Total Revenue</p>
                            <p className="text-xl">$125,000</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {num === 2 && (
                    <div>
                      <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">
                        Web Scraping
                      </p>
                      <p className="text-gray-600">
                        Data extraction and automation
                      </p>
                      {showData && (
                        <div className="pt-2">
                          <p className="text-gray-400 text-sm">Active scrapers: 3</p>
                        </div>
                      )}
                    </div>
                  )}
                  {num === 3 && (
                    <div>
                      <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">
                        Social Media
                      </p>
                      <p className="text-gray-600">
                        Multi-platform content management
                      </p>
                      {showData && (
                        <div className="pt-2">
                          <p className="text-gray-400 text-sm">Scheduled posts: 12</p>
                        </div>
                      )}
                    </div>
                  )}
                  {num === 4 && (
                    <div>
                      <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">
                        Research
                      </p>
                      <p className="text-gray-600">
                        Data gathering and report generation
                      </p>
                      {showData && (
                        <div className="pt-2">
                          <p className="text-gray-400 text-sm">Reports generated: 24</p>
                        </div>
                      )}
                    </div>
                  )}
                  {num === 5 && (
                    <div>
                      <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">
                        System Architecture
                      </p>
                      <p className="text-gray-600">
                        Real-time visualization and monitoring
                      </p>
                      {showData && (
                        <div className="pt-2">
                          <p className="text-gray-400 text-sm">System uptime: 99.9%</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Navigation Button - Always Visible */}
      <button
        onClick={handleMainNavClick}
        className="fixed top-1/2 right-1/3 -translate-y-1/2 w-24 h-24 bg-black rounded-full hover:opacity-80 transition-opacity duration-200 z-10"
        aria-label="Navigate"
      />

      {/* Node Control Button - Only when selected */}
      {selectedNumber !== null && (
        <button
          onClick={handleNodeControlClick}
          className={`fixed top-1/2 -translate-y-1/2 w-12 h-12 rounded-full hover:opacity-80 transition-all duration-500 ${
            nodeColors[selectedNumber as keyof typeof nodeColors]
          } ${nodeButtonPosition} ${
            isAnimating ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Toggle data"
        />
      )}
    </main>
  );
}