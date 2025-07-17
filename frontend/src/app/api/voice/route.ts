import { NextRequest, NextResponse } from 'next/server'
import { AGENT_NUMBERS } from '@paios/shared'

// Mock voice command processing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, activeAgent } = body

    // Process voice command
    const command = text.toLowerCase()
    const response = await processVoiceCommand(command, activeAgent)

    return NextResponse.json({
      success: true,
      data: {
        text: response.text,
        action: response.action,
        agentNumber: response.agentNumber,
        audioUrl: null // In production, this would be TTS audio
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process voice command' },
      { status: 500 }
    )
  }
}

// Mock voice command processor
async function processVoiceCommand(command: string, activeAgent: number | null) {
  // Check for agent navigation commands
  const agentMatch = command.match(/(?:show|open|go to|agent)\s*(\d+)/i)
  if (agentMatch) {
    const agentNumber = parseInt(agentMatch[1])
    if (Object.values(AGENT_NUMBERS).includes(agentNumber)) {
      return {
        text: `Opening agent ${agentNumber}`,
        action: 'navigate',
        agentNumber
      }
    }
  }

  // Check for specific agent commands
  if (command.includes('revenue') || command.includes('income')) {
    return {
      text: 'Showing revenue dashboard',
      action: 'navigate',
      agentNumber: 1
    }
  }

  if (command.includes('scrape') || command.includes('extract')) {
    return {
      text: 'Opening web scraping agent',
      action: 'navigate', 
      agentNumber: 7
    }
  }

  if (command.includes('social') || command.includes('post')) {
    return {
      text: 'Opening social media manager',
      action: 'navigate',
      agentNumber: 8
    }
  }

  if (command.includes('architecture') || command.includes('system')) {
    return {
      text: 'Showing system architecture',
      action: 'navigate',
      agentNumber: 31
    }
  }

  // Context-aware commands for active agent
  if (activeAgent) {
    return {
      text: `Processing command for agent ${activeAgent}: ${command}`,
      action: 'execute',
      agentNumber: activeAgent
    }
  }

  // Default response
  return {
    text: "I didn't understand that command. Try saying 'Show agent 1' or 'Open revenue dashboard'",
    action: 'help',
    agentNumber: null
  }
}