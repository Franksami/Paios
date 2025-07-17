export interface Agent {
  id: string;
  agentNumber: number;
  name: string;
  description: string;
  isActive: boolean;
  config: AgentConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentConfig {
  apiKeys?: Record<string, string>;
  settings?: Record<string, unknown>;
  permissions?: string[];
  voiceEnabled?: boolean;
  voiceSettings?: VoiceSettings;
}

export interface VoiceSettings {
  wakeWord?: string;
  voiceId?: string;
  language?: string;
  voiceSpeed?: number;
  voicePitch?: number;
}

export interface AgentCommand {
  action: string;
  parameters: Record<string, unknown>;
  context?: Record<string, unknown>;
  userId: string;
  requestId: string;
  timestamp: Date;
}

export interface AgentResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata?: {
    executionTime: number;
    resourcesUsed: string[];
    nextSuggestedActions?: string[];
  };
}

export interface AgentMemory {
  id: string;
  agentId: string;
  type: "short-term" | "long-term" | "episodic";
  content: unknown;
  relevanceScore: number;
  expiresAt?: Date;
  createdAt: Date;
}

export interface AgentCapability {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  voiceCommands?: string[];
}
