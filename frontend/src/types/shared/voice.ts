export interface VoiceCommand {
  id: string;
  text: string;
  confidence: number;
  language: string;
  userId: string;
  agentId?: string;
  timestamp: Date;
}

export interface VoiceResponse {
  id: string;
  text: string;
  audioUrl?: string;
  voiceId?: string;
  duration?: number;
  timestamp: Date;
}

export interface VoiceInteraction {
  id: string;
  userId: string;
  agentId?: string;
  command: VoiceCommand;
  response: VoiceResponse;
  executionTime: number;
  status: "success" | "error" | "timeout";
  error?: string;
  createdAt: Date;
}

export interface VoicePattern {
  patterns: string[];
  action: string;
  parameters?: Record<string, unknown>;
  confidence?: number;
  examples?: string[];
}

export interface VoiceCapabilities {
  languages: string[];
  wakeWords: string[];
  voiceIds: string[];
  features: VoiceFeature[];
}

export interface VoiceFeature {
  name: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}
