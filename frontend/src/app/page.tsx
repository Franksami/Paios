"use client";

import { useState } from "react";

export default function HomePage() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const handleNumberClick = (num: number) => {
    setSelectedNumber(num);
  };

  const handleNextClick = () => {
    if (selectedNumber === null) {
      setSelectedNumber(1);
    } else {
      setSelectedNumber(selectedNumber === 5 ? 1 : selectedNumber + 1);
    }
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
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Button */}
      {selectedNumber !== null && (
        <button
          onClick={handleNextClick}
          className="fixed bottom-8 right-8 w-12 h-12 bg-black rounded-full hover:opacity-80 transition-opacity duration-200"
          aria-label="Next"
        />
      )}
    </main>
  );
}