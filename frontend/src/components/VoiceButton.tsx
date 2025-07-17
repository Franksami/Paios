'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVoiceStore } from '@/stores/voice-store'
import { useAgentStore } from '@/stores/agent-store'

interface VoiceButtonProps {
  activeAgent: number | null
}

export function VoiceButton({ activeAgent }: VoiceButtonProps) {
  const { isListening, transcript, interimTranscript, startListening, stopListening, clearTranscript, error } = useVoiceStore()
  const { processVoiceCommand } = useAgentStore()
  const [showTranscript, setShowTranscript] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [response, setResponse] = useState<string | null>(null)

  useEffect(() => {
    if (transcript && !isListening && !isProcessing) {
      handleVoiceCommand()
    }
  }, [transcript, isListening])

  const handleVoiceCommand = async () => {
    if (!transcript.trim()) return

    setIsProcessing(true)
    setResponse(null)

    try {
      // Process the voice command
      const commandText = transcript.trim()
      
      // Check if an agent is active
      if (activeAgent) {
        const result = await processVoiceCommand(activeAgent, commandText)
        setResponse(result)
      } else {
        // Try to detect agent number from command
        const agentMatch = commandText.match(/agent (\d+)/i)
        if (agentMatch) {
          const agentNumber = parseInt(agentMatch[1])
          setResponse(`Please open Agent ${agentNumber} first by clicking on it.`)
        } else {
          setResponse('Please select an agent first by clicking on its number.')
        }
      }
    } catch (error: any) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setIsProcessing(false)
      // Clear transcript after processing
      setTimeout(() => {
        clearTranscript()
        setShowTranscript(false)
      }, 3000)
    }
  }

  const handleClick = () => {
    if (isListening) {
      stopListening()
    } else {
      clearTranscript()
      setResponse(null)
      setShowTranscript(true)
      startListening()
    }
  }

  return (
    <>
      {/* Voice Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        className={`fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isListening
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200'
        }`}
        aria-label="Voice Command"
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="relative"
            >
              {/* Pulse animation */}
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 w-16 h-16 bg-red-500 rounded-full opacity-30"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="white"
                className="w-6 h-6 relative z-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                />
              </svg>
            </motion.div>
          ) : (
            <motion.svg
              key="idle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-white dark:text-black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Transcript Display */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 right-8 max-w-sm bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-200 dark:border-gray-700"
          >
            {error ? (
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            ) : isProcessing ? (
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">Processing...</p>
              </div>
            ) : response ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">You said:</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{transcript}</p>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Response:</p>
                  <p className="text-sm text-gray-900 dark:text-white">{response}</p>
                </div>
              </div>
            ) : (
              <div>
                {isListening && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Listening...</p>
                )}
                {(transcript || interimTranscript) && (
                  <p className="text-sm text-gray-900 dark:text-white">
                    {transcript}
                    <span className="text-gray-400">{interimTranscript}</span>
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}