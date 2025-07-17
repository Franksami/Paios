export const AGENT_NUMBERS = {
  BUSINESS_INTELLIGENCE: 1,
  WEB_SCRAPING: 7,
  SOCIAL_MEDIA: 8,
  INVOICING: 15,
  RESEARCH: 18,
  PUBLISHING: 29,
  SYSTEM_RULES: 30,
  SYSTEM_ARCHITECTURE: 31,
  PASSWORD_VAULT: 32,
  PERSONAL_DIRECTORY: 33,
} as const

export const AGENT_NAMES: Record<number, string> = {
  [AGENT_NUMBERS.BUSINESS_INTELLIGENCE]: 'Business Intelligence',
  [AGENT_NUMBERS.WEB_SCRAPING]: 'Web Scraping',
  [AGENT_NUMBERS.SOCIAL_MEDIA]: 'Social Media',
  [AGENT_NUMBERS.INVOICING]: 'Invoicing',
  [AGENT_NUMBERS.RESEARCH]: 'Research',
  [AGENT_NUMBERS.PUBLISHING]: 'Publishing',
  [AGENT_NUMBERS.SYSTEM_RULES]: 'System Rules',
  [AGENT_NUMBERS.SYSTEM_ARCHITECTURE]: 'System Architecture',
  [AGENT_NUMBERS.PASSWORD_VAULT]: 'Password Vault',
  [AGENT_NUMBERS.PERSONAL_DIRECTORY]: 'Personal Directory',
}

export const AGENT_DESCRIPTIONS: Record<number, string> = {
  [AGENT_NUMBERS.BUSINESS_INTELLIGENCE]: 'Revenue tracking and financial analytics with Stripe integration',
  [AGENT_NUMBERS.WEB_SCRAPING]: 'Data extraction and web scraping with Apify integration',
  [AGENT_NUMBERS.SOCIAL_MEDIA]: 'Multi-platform social media content management',
  [AGENT_NUMBERS.INVOICING]: 'Automated invoice generation and delivery',
  [AGENT_NUMBERS.RESEARCH]: 'Data gathering and research report generation',
  [AGENT_NUMBERS.PUBLISHING]: 'Content distribution across multiple platforms',
  [AGENT_NUMBERS.SYSTEM_RULES]: 'Workflow automation and rule engine',
  [AGENT_NUMBERS.SYSTEM_ARCHITECTURE]: 'Real-time system visualization and monitoring',
  [AGENT_NUMBERS.PASSWORD_VAULT]: 'Secure credential storage with biometric authentication',
  [AGENT_NUMBERS.PERSONAL_DIRECTORY]: 'Bookmarks, shortcuts, and personal organization',
}

export type AgentNumber = typeof AGENT_NUMBERS[keyof typeof AGENT_NUMBERS]