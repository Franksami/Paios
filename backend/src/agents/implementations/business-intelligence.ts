import { MCPAgent } from '../base/mcp-agent'
import { AgentCommand, AgentResponse, AgentConfig, VoicePattern } from '@paios/shared'
import { AGENT_NUMBERS } from '@paios/shared'

interface RevenueData {
  month: string
  revenue: number
  expenses: number
  profit: number
  growth: number
}

interface MetricsData {
  totalRevenue: number
  totalExpenses: number
  totalProfit: number
  averageGrowth: number
  bestMonth: string
  worstMonth: string
}

export class BusinessIntelligenceAgent extends MCPAgent {
  agentNumber = AGENT_NUMBERS.BUSINESS_INTELLIGENCE
  name = 'Business Intelligence'
  description = 'Revenue tracking and financial analytics with Stripe integration'

  private sampleData: RevenueData[] = [
    { month: 'January', revenue: 125000, expenses: 85000, profit: 40000, growth: 0 },
    { month: 'February', revenue: 132000, expenses: 88000, profit: 44000, growth: 5.6 },
    { month: 'March', revenue: 145000, expenses: 92000, profit: 53000, growth: 9.8 },
    { month: 'April', revenue: 138000, expenses: 90000, profit: 48000, growth: -4.8 },
    { month: 'May', revenue: 155000, expenses: 95000, profit: 60000, growth: 12.3 },
    { month: 'June', revenue: 168000, expenses: 98000, profit: 70000, growth: 8.4 },
  ]

  async initialize(config: AgentConfig): Promise<void> {
    this.validateConfig(config)
    this.config = config

    // Set up voice commands
    this.voiceCommands = [
      {
        patterns: ['show revenue', 'display income', 'financial status', 'how much money'],
        action: 'get_revenue',
        description: 'Display current revenue data'
      },
      {
        patterns: ['show expenses', 'display costs', 'spending report'],
        action: 'get_expenses',
        description: 'Display expense breakdown'
      },
      {
        patterns: ['revenue for (.*)', 'income in (.*)'],
        action: 'get_revenue_period',
        description: 'Get revenue for specific period'
      },
      {
        patterns: ['profit margin', 'show profit', 'net income'],
        action: 'get_profit',
        description: 'Display profit analysis'
      },
      {
        patterns: ['growth rate', 'show growth', 'performance trend'],
        action: 'get_growth',
        description: 'Display growth metrics'
      }
    ]

    this.isInitialized = true
    this.log('info', 'Business Intelligence agent initialized')
    this.emitStatus('idle')
  }

  async execute(command: AgentCommand): Promise<AgentResponse> {
    this.checkInitialized()
    this.emitStatus('executing', { action: command.action })

    try {
      let result: any

      switch (command.action) {
        case 'get_revenue':
          result = await this.getRevenue()
          break
        case 'get_expenses':
          result = await this.getExpenses()
          break
        case 'get_revenue_period':
          result = await this.getRevenuePeriod(command.parameters?.period || command.parameters?.param1)
          break
        case 'get_profit':
          result = await this.getProfit()
          break
        case 'get_growth':
          result = await this.getGrowth()
          break
        case 'get_metrics':
          result = await this.getMetrics()
          break
        default:
          throw new Error(`Unknown action: ${command.action}`)
      }

      this.emitStatus('idle')
      return {
        success: true,
        data: result,
        metadata: {
          executionTime: Date.now() - command.timestamp.getTime(),
          agentNumber: this.agentNumber
        }
      }
    } catch (error: any) {
      this.emitStatus('error', { error: error.message })
      this.log('error', 'Command execution failed', { error: error.message, command })
      
      return {
        success: false,
        error: error.message,
        metadata: {
          executionTime: Date.now() - command.timestamp.getTime(),
          agentNumber: this.agentNumber
        }
      }
    }
  }

  private async getRevenue(): Promise<any> {
    const currentMonth = this.sampleData[this.sampleData.length - 1]
    const totalRevenue = this.sampleData.reduce((sum, month) => sum + month.revenue, 0)

    return {
      current: {
        month: currentMonth.month,
        revenue: currentMonth.revenue,
        formatted: `$${currentMonth.revenue.toLocaleString()}`
      },
      total: {
        revenue: totalRevenue,
        formatted: `$${totalRevenue.toLocaleString()}`
      },
      monthly: this.sampleData.map(month => ({
        month: month.month,
        revenue: month.revenue,
        formatted: `$${month.revenue.toLocaleString()}`
      }))
    }
  }

  private async getExpenses(): Promise<any> {
    const currentMonth = this.sampleData[this.sampleData.length - 1]
    const totalExpenses = this.sampleData.reduce((sum, month) => sum + month.expenses, 0)

    return {
      current: {
        month: currentMonth.month,
        expenses: currentMonth.expenses,
        formatted: `$${currentMonth.expenses.toLocaleString()}`
      },
      total: {
        expenses: totalExpenses,
        formatted: `$${totalExpenses.toLocaleString()}`
      },
      monthly: this.sampleData.map(month => ({
        month: month.month,
        expenses: month.expenses,
        formatted: `$${month.expenses.toLocaleString()}`
      }))
    }
  }

  private async getRevenuePeriod(period: string): Promise<any> {
    const monthData = this.sampleData.find(
      data => data.month.toLowerCase() === period.toLowerCase()
    )

    if (!monthData) {
      throw new Error(`No data found for period: ${period}`)
    }

    return {
      month: monthData.month,
      revenue: monthData.revenue,
      expenses: monthData.expenses,
      profit: monthData.profit,
      growth: monthData.growth,
      formatted: {
        revenue: `$${monthData.revenue.toLocaleString()}`,
        expenses: `$${monthData.expenses.toLocaleString()}`,
        profit: `$${monthData.profit.toLocaleString()}`,
        growth: `${monthData.growth > 0 ? '+' : ''}${monthData.growth}%`
      }
    }
  }

  private async getProfit(): Promise<any> {
    const totalProfit = this.sampleData.reduce((sum, month) => sum + month.profit, 0)
    const averageProfit = totalProfit / this.sampleData.length
    const currentMonth = this.sampleData[this.sampleData.length - 1]

    return {
      current: {
        month: currentMonth.month,
        profit: currentMonth.profit,
        margin: ((currentMonth.profit / currentMonth.revenue) * 100).toFixed(1),
        formatted: `$${currentMonth.profit.toLocaleString()}`
      },
      total: {
        profit: totalProfit,
        formatted: `$${totalProfit.toLocaleString()}`
      },
      average: {
        profit: averageProfit,
        formatted: `$${Math.round(averageProfit).toLocaleString()}`
      },
      monthly: this.sampleData.map(month => ({
        month: month.month,
        profit: month.profit,
        margin: ((month.profit / month.revenue) * 100).toFixed(1),
        formatted: `$${month.profit.toLocaleString()}`
      }))
    }
  }

  private async getGrowth(): Promise<any> {
    const growthRates = this.sampleData.map(month => month.growth).filter(g => g !== 0)
    const averageGrowth = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length
    const currentGrowth = this.sampleData[this.sampleData.length - 1].growth

    return {
      current: {
        month: this.sampleData[this.sampleData.length - 1].month,
        growth: currentGrowth,
        formatted: `${currentGrowth > 0 ? '+' : ''}${currentGrowth}%`
      },
      average: {
        growth: averageGrowth,
        formatted: `${averageGrowth > 0 ? '+' : ''}${averageGrowth.toFixed(1)}%`
      },
      trend: currentGrowth > averageGrowth ? 'improving' : 'declining',
      monthly: this.sampleData.map(month => ({
        month: month.month,
        growth: month.growth,
        formatted: `${month.growth > 0 ? '+' : ''}${month.growth}%`
      }))
    }
  }

  private async getMetrics(): Promise<MetricsData> {
    const totalRevenue = this.sampleData.reduce((sum, month) => sum + month.revenue, 0)
    const totalExpenses = this.sampleData.reduce((sum, month) => sum + month.expenses, 0)
    const totalProfit = this.sampleData.reduce((sum, month) => sum + month.profit, 0)
    
    const growthRates = this.sampleData.map(month => month.growth).filter(g => g !== 0)
    const averageGrowth = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length

    const bestMonth = this.sampleData.reduce((best, month) => 
      month.profit > best.profit ? month : best
    ).month

    const worstMonth = this.sampleData.reduce((worst, month) => 
      month.profit < worst.profit ? month : worst
    ).month

    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      averageGrowth,
      bestMonth,
      worstMonth
    }
  }

  protected formatVoiceResponse(response: AgentResponse): string {
    if (!response.success) {
      return super.formatVoiceResponse(response)
    }

    const data = response.data

    // Format response based on the type of data
    if (data.current && data.total) {
      if (data.current.revenue) {
        return `Current revenue for ${data.current.month} is ${data.current.formatted}. Total revenue is ${data.total.formatted}.`
      } else if (data.current.expenses) {
        return `Current expenses for ${data.current.month} are ${data.current.formatted}. Total expenses are ${data.total.formatted}.`
      } else if (data.current.profit) {
        return `Current profit for ${data.current.month} is ${data.current.formatted} with a margin of ${data.current.margin}%. Total profit is ${data.total.formatted}.`
      }
    }

    if (data.current && data.current.growth !== undefined) {
      return `Growth rate for ${data.current.month} is ${data.current.formatted}. Average growth is ${data.average.formatted}. The trend is ${data.trend}.`
    }

    if (data.month) {
      return `For ${data.month}: Revenue is ${data.formatted.revenue}, expenses are ${data.formatted.expenses}, profit is ${data.formatted.profit} with ${data.formatted.growth} growth.`
    }

    return 'Financial data retrieved successfully.'
  }

  async cleanup(): Promise<void> {
    this.isInitialized = false
    this.memory.clear()
    this.removeAllListeners()
    this.log('info', 'Business Intelligence agent cleaned up')
  }
}