'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAgentStore } from '@/stores/agent-store'
import mermaid from 'mermaid'

interface SystemArchitectureDisplayProps {
  agent: any
}

export function SystemArchitectureDisplay({ agent }: SystemArchitectureDisplayProps) {
  const { executeCommand } = useAgentStore()
  const [activeView, setActiveView] = useState<'diagram' | 'metrics' | 'connections' | 'dataflow'>('diagram')
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const mermaidRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#1e293b',
        primaryTextColor: '#e2e8f0',
        primaryBorderColor: '#334155',
        lineColor: '#475569',
        secondaryColor: '#475569',
        tertiaryColor: '#1e293b',
        background: '#0f172a',
        mainBkg: '#1e293b',
        secondBkg: '#334155',
        tertiaryBkg: '#0f172a',
        darkMode: true
      }
    })

    // Load initial data
    loadData('diagram')
  }, [])

  useEffect(() => {
    // Re-render mermaid diagram when data changes
    if (data?.diagram && mermaidRef.current && activeView === 'diagram') {
      mermaidRef.current.innerHTML = ''
      const id = `mermaid-${Date.now()}`
      const div = document.createElement('div')
      div.id = id
      mermaidRef.current.appendChild(div)
      
      mermaid.render(id, data.diagram).then(({ svg }) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg
        }
      })
    }
  }, [data, activeView])

  const loadData = async (view: string) => {
    setIsLoading(true)
    try {
      const command = {
        action: `get_${view}`,
        parameters: {}
      }
      
      const response = await executeCommand(31, command)
      if (response.success) {
        setData(response.data)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewChange = (view: 'diagram' | 'metrics' | 'connections' | 'dataflow') => {
    setActiveView(view)
    loadData(view)
  }

  const renderMetricCard = (title: string, value: string | number, subtitle?: string, color?: string) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6"
    >
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
      <p className={`text-2xl font-semibold mt-2 ${color || 'text-gray-900 dark:text-white'}`}>
        {value}
      </p>
      {subtitle && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
      )}
    </motion.div>
  )

  const renderConnection = (connection: any, index: number) => (
    <motion.div
      key={`${connection.from}-${connection.to}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800 last:border-0"
    >
      <div className="flex items-center space-x-3">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-sm text-gray-700 dark:text-gray-300">{connection.from}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
        <span className="text-sm text-gray-700 dark:text-gray-300">{connection.to}</span>
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {connection.count} messages
      </span>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-800">
        {(['diagram', 'metrics', 'connections', 'dataflow'] as const).map((view) => (
          <button
            key={view}
            onClick={() => handleViewChange(view)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeView === view
                ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {view === 'dataflow' ? 'Data Flow' : view}
          </button>
        ))}
      </div>

      {/* Data Display */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full"
          />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* System Diagram */}
          {activeView === 'diagram' && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Live System Architecture
              </h4>
              <div 
                ref={mermaidRef}
                className="overflow-x-auto"
                style={{ minHeight: '400px' }}
              />
              {data.metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {data.metrics.activeAgents}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Active Agents</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {data.metrics.totalMessages}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Messages</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {data.metrics.websocketConnections}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Connections</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {data.metrics.memoryUsage} MB
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Memory</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* System Metrics */}
          {activeView === 'metrics' && data.current && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderMetricCard(
                  'Active Agents',
                  data.current.activeAgents,
                  'Currently running'
                )}
                {renderMetricCard(
                  'Uptime',
                  data.current.formatted.uptime,
                  'System running time'
                )}
                {renderMetricCard(
                  'Memory Usage',
                  data.current.formatted.memory,
                  'Heap memory'
                )}
                {renderMetricCard(
                  'Response Time',
                  data.current.formatted.responseTime,
                  'Average latency'
                )}
                {renderMetricCard(
                  'Messages/Min',
                  data.performance?.messagesPerMinute || 0,
                  'Throughput'
                )}
                {renderMetricCard(
                  'Error Rate',
                  `${data.performance?.errorRate || 0}%`,
                  'Failed requests',
                  data.performance?.errorRate > 5 ? 'text-red-600' : undefined
                )}
              </div>

              {/* Resource Usage */}
              {data.resources && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Resource Usage
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">CPU</span>
                        <span className="text-gray-900 dark:text-white">
                          {Math.round((data.resources.cpu.user + data.resources.cpu.system) / 1000)}ms
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Memory (RSS)</span>
                        <span className="text-gray-900 dark:text-white">
                          {Math.round(data.resources.memory.rss / 1024 / 1024)} MB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Agent Connections */}
          {activeView === 'connections' && data.connections && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Agent Communication Paths ({data.totalConnections} total)
              </h4>
              <div className="space-y-2">
                {data.connections.length > 0 ? (
                  data.connections.map((conn: any, index: number) => renderConnection(conn, index))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No inter-agent communications yet
                  </p>
                )}
              </div>
              {data.mostActive && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Most active: <span className="font-medium text-gray-900 dark:text-white">
                      {data.mostActive.from} → {data.mostActive.to}
                    </span> ({data.mostActive.count} messages)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Data Flow */}
          {activeView === 'dataflow' && data.recentFlow && (
            <>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Recent Data Flow
                </h4>
                <div className="space-y-3">
                  {data.recentFlow.length > 0 ? (
                    data.recentFlow.map((flow: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center space-x-3 text-sm"
                      >
                        <span className="text-gray-500 dark:text-gray-400 w-20">
                          {new Date(flow.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{flow.from}</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{flow.to}</span>
                        <span className="text-gray-500 dark:text-gray-400">({flow.action})</span>
                        {flow.duration && (
                          <span className="text-xs text-gray-400">{flow.duration}ms</span>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      No recent data flow
                    </p>
                  )}
                </div>
              </div>

              {/* Flow Patterns */}
              {data.patterns && data.patterns.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Common Patterns
                  </h4>
                  <div className="space-y-2">
                    {data.patterns.map((pattern: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{pattern.pattern}</span>
                        <span className="text-gray-900 dark:text-white">{pattern.count} times</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
        <button 
          onClick={() => loadData(activeView)}
          className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Refresh Data
        </button>
        <button className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          Export Diagram
        </button>
        <button className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          Performance Report
        </button>
      </div>
    </div>
  )
}