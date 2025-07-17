import { TemplateAgent } from './index'
import { AgentCommand, AgentConfig } from '@paios/shared'

describe('TemplateAgent', () => {
  let agent: TemplateAgent
  let mockConfig: AgentConfig

  beforeEach(() => {
    agent = new TemplateAgent()
    mockConfig = {
      apiKeys: {
        exampleKey: 'test-api-key-12345'
      },
      settings: {
        refreshInterval: 300,
        maxRetries: 3,
        timeout: 30000
      },
      voiceEnabled: true
    }
  })

  afterEach(async () => {
    await agent.cleanup()
  })

  describe('initialization', () => {
    it('should initialize successfully with valid config', async () => {
      await expect(agent.initialize(mockConfig)).resolves.not.toThrow()
    })

    it('should throw error with missing API key', async () => {
      const invalidConfig = { ...mockConfig, apiKeys: {} }
      await expect(agent.initialize(invalidConfig)).rejects.toThrow('Missing required API key')
    })
  })

  describe('command execution', () => {
    beforeEach(async () => {
      await agent.initialize(mockConfig)
    })

    it('should execute example_action successfully', async () => {
      const command: AgentCommand = {
        action: 'example_action',
        parameters: {},
        userId: 'test-user',
        requestId: 'test-123',
        timestamp: new Date()
      }

      const response = await agent.execute(command)

      expect(response.success).toBe(true)
      expect(response.data).toHaveProperty('message', 'Example action completed')
      expect(response.metadata?.executionTime).toBeGreaterThan(0)
    })

    it('should return error for unknown action', async () => {
      const command: AgentCommand = {
        action: 'unknown_action',
        parameters: {},
        userId: 'test-user',
        requestId: 'test-124',
        timestamp: new Date()
      }

      const response = await agent.execute(command)

      expect(response.success).toBe(false)
      expect(response.error).toContain('Unknown action')
    })
  })

  describe('voice command processing', () => {
    beforeEach(async () => {
      await agent.initialize(mockConfig)
    })

    it('should process valid voice command', async () => {
      const voiceResponse = await agent.processVoiceCommand('example command')
      
      expect(voiceResponse).toContain('Operation completed successfully')
    })

    it('should handle unrecognized voice command', async () => {
      const voiceResponse = await agent.processVoiceCommand('random gibberish')
      
      expect(voiceResponse).toContain("I didn't understand that command")
    })

    it('should handle voice command variations', async () => {
      const voiceResponse = await agent.processVoiceCommand('DO SOMETHING')
      
      expect(voiceResponse).toContain('Operation completed successfully')
    })
  })

  describe('cleanup', () => {
    it('should cleanup resources without error', async () => {
      await agent.initialize(mockConfig)
      await expect(agent.cleanup()).resolves.not.toThrow()
    })
  })

  describe('error handling', () => {
    beforeEach(async () => {
      await agent.initialize(mockConfig)
    })

    it('should handle execution errors gracefully', async () => {
      // Mock an error scenario
      jest.spyOn(agent as any, 'handleExampleAction').mockRejectedValue(
        new Error('Test error')
      )

      const command: AgentCommand = {
        action: 'example_action',
        parameters: {},
        userId: 'test-user',
        requestId: 'test-125',
        timestamp: new Date()
      }

      const response = await agent.execute(command)

      expect(response.success).toBe(false)
      expect(response.error).toBe('Test error')
    })
  })
})