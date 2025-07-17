'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AgentDisplay } from '@/components/agents/AgentDisplay'
import { VoiceButton } from '@/components/VoiceButton'
import { useAgentStore } from '@/stores/agent-store'
import { AGENT_NUMBERS, AGENT_NAMES, AGENT_DESCRIPTIONS } from '@/types/shared'

export default function HomePage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const { connect, isConnected } = useAgentStore()

  // Create agent data from constants
  const agents = Object.entries(AGENT_NUMBERS).map(([key, number]) => ({
    number,
    name: AGENT_NAMES[number] || `Agent ${number}`,
    description: AGENT_DESCRIPTIONS[number] || 'No description available'
  })).sort((a, b) => a.number - b.number)

  // Pad with placeholder agents to reach 33
  const allAgents = [...agents]
  for (let i = 1; i <= 33; i++) {
    if (!allAgents.find(a => a.number === i)) {
      allAgents.push({
        number: i,
        name: `Agent ${i}`,
        description: 'Coming soon...'
      })
    }
  }
  allAgents.sort((a, b) => a.number - b.number)

  // Connect to WebSocket on mount (in production, use actual auth token)
  useEffect(() => {
    if (!isConnected) {
      // In production, get token from auth context
      const token = 'demo-token'
      connect(token).catch(console.error)
    }
  }, [connect, isConnected])

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl font-light text-black dark:text-white mb-4">
            Personal AI Operating System
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Click any number to explore
          </p>
        </motion.header>

        {/* Connection Status */}
        {!isConnected && (
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Connecting to server...
            </p>
          </div>
        )}

        {/* Accordion List */}
        <div className="space-y-2">
          {allAgents.map((agent, index) => (
            <motion.div
              key={agent.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full text-left p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-light text-black dark:text-white">
                    {agent.number}
                  </span>
                  <span className="text-gray-400 dark:text-gray-600">
                    {expandedIndex === index ? '−' : '+'}
                  </span>
                </div>
              </button>

              {/* Expanded Content */}
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  {(agent.number === 1 || agent.number === 31) ? (
                    <AgentDisplay
                      agentNumber={agent.number}
                      agentName={agent.name}
                      agentDescription={agent.description}
                    />
                  ) : (
                    <>
                      <h3 className="text-lg font-medium mb-2">{agent.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {agent.description}
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Voice Button */}
        <VoiceButton activeAgent={expandedIndex !== null ? allAgents[expandedIndex].number : null} />
      </div>
    </main>
  )
}