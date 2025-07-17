#!/usr/bin/env ts-node

import { Command } from 'commander'
import inquirer from 'inquirer'
import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'

const program = new Command()

interface AgentOptions {
  number: number
  name: string
  description?: string
  voiceEnabled?: boolean
}

program
  .name('agent-generator')
  .description('Generate a new PAIOS agent from template')
  .option('-n, --number <number>', 'Agent number', parseInt)
  .option('-N, --name <name>', 'Agent name')
  .option('-d, --description <description>', 'Agent description')
  .option('--no-voice', 'Disable voice commands')
  .action(async (options) => {
    try {
      // Collect missing information
      const answers = await inquirer.prompt([
        {
          type: 'number',
          name: 'number',
          message: 'Agent number:',
          when: !options.number,
          validate: (input) => {
            if (input < 1 || input > 100) {
              return 'Agent number must be between 1 and 100'
            }
            return true
          }
        },
        {
          type: 'input',
          name: 'name',
          message: 'Agent name:',
          when: !options.name,
          validate: (input) => {
            if (!input || input.trim().length === 0) {
              return 'Agent name is required'
            }
            return true
          }
        },
        {
          type: 'input',
          name: 'description',
          message: 'Agent description:',
          when: !options.description
        }
      ])

      const agentConfig: AgentOptions = {
        number: options.number || answers.number,
        name: options.name || answers.name,
        description: options.description || answers.description || `${options.name || answers.name} agent`,
        voiceEnabled: options.voice !== false
      }

      await generateAgent(agentConfig)
    } catch (error) {
      console.error(chalk.red('Error:'), error)
      process.exit(1)
    }
  })

async function generateAgent(config: AgentOptions) {
  console.log(chalk.blue('Generating agent...'))

  const agentDirName = config.name.toLowerCase().replace(/\s+/g, '-')
  const agentClassName = config.name.replace(/\s+/g, '')
  
  const templatePath = path.join(__dirname, '../../agents/agent-template')
  const targetPath = path.join(__dirname, `../../backend/src/agents/${agentDirName}`)
  const specPath = path.join(__dirname, `../../agents/specifications/${String(config.number).padStart(2, '0')}-${agentDirName}.md`)

  // Check if agent already exists
  if (await fs.pathExists(targetPath)) {
    console.error(chalk.red(`Agent directory already exists: ${targetPath}`))
    process.exit(1)
  }

  // Copy template files
  await fs.copy(templatePath, targetPath)

  // Update agent files with config
  const files = ['index.ts', 'README.md', 'config.schema.json', 'test.template.ts']
  
  for (const file of files) {
    const filePath = path.join(targetPath, file)
    if (await fs.pathExists(filePath)) {
      let content = await fs.readFile(filePath, 'utf8')
      
      // Replace placeholders
      content = content.replace(/TemplateAgent/g, `${agentClassName}Agent`)
      content = content.replace(/Template Agent/g, config.name)
      content = content.replace(/template-agent/g, agentDirName)
      content = content.replace(/agentNumber = 99/g, `agentNumber = ${config.number}`)
      content = content.replace(/Template for creating new agents/g, config.description || '')
      
      await fs.writeFile(filePath, content)
      
      // Rename test file
      if (file === 'test.template.ts') {
        const newTestPath = path.join(targetPath, `${agentDirName}.test.ts`)
        await fs.rename(filePath, newTestPath)
      }
    }
  }

  // Create agent specification
  const specContent = `# Agent #${config.number}: ${config.name}

## Overview
${config.description}

## Capabilities
- TODO: List agent capabilities

## Voice Commands
${config.voiceEnabled ? '- TODO: List voice commands' : '- Voice commands disabled'}

## Configuration
\`\`\`json
{
  "apiKeys": {
    // Required API keys
  },
  "settings": {
    // Agent settings
  }
}
\`\`\`

## Implementation Status
- [ ] Base implementation
- [ ] Voice command processing
- [ ] External API integration
- [ ] Unit tests
- [ ] Integration tests
- [ ] Documentation
`

  await fs.writeFile(specPath, specContent)

  // Update agent registry
  await updateAgentRegistry(config)

  console.log(chalk.green('✓'), 'Agent generated successfully!')
  console.log(chalk.gray('  Agent directory:'), targetPath)
  console.log(chalk.gray('  Specification:'), specPath)
  console.log()
  console.log(chalk.yellow('Next steps:'))
  console.log('  1. Implement agent logic in', chalk.cyan(`${targetPath}/index.ts`))
  console.log('  2. Update configuration schema in', chalk.cyan(`${targetPath}/config.schema.json`))
  console.log('  3. Add voice commands to', chalk.cyan('agents/configurations/voice-commands.json'))
  console.log('  4. Write tests in', chalk.cyan(`${targetPath}/${agentDirName}.test.ts`))
  console.log('  5. Update specification in', chalk.cyan(specPath))
}

async function updateAgentRegistry(config: AgentOptions) {
  // This would update the agent registry in the backend
  // For now, we'll just log a reminder
  console.log(chalk.yellow('Remember to register the agent in:'))
  console.log('  -', chalk.cyan('backend/src/agents/index.ts'))
  console.log('  -', chalk.cyan('shared/src/constants/agent-numbers.ts'))
}

program.parse()