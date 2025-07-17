import { NextRequest, NextResponse } from "next/server";
import { AGENT_NUMBERS, AGENT_NAMES, AGENT_DESCRIPTIONS } from "@/types/shared";

// Mock agent data store (in production, this would be in a database)
const mockAgentStates = new Map<string, any>();

// GET /api/agents/[id] - Get agent details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const agentNumber = parseInt(id);

  // Check if agent exists
  const validAgentNumbers = Object.values(AGENT_NUMBERS) as number[];
  if (!validAgentNumbers.includes(agentNumber)) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const agent = {
    id,
    number: agentNumber,
    name: AGENT_NAMES[agentNumber] || `Agent ${agentNumber}`,
    description: AGENT_DESCRIPTIONS[agentNumber] || "No description available",
    status: "active",
    config: mockAgentStates.get(id) || {},
    capabilities: getAgentCapabilities(agentNumber),
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    data: agent,
  });
}

// POST /api/agents/[id]/execute - Execute agent command
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const agentNumber = parseInt(id);

  try {
    const body = await request.json();
    const { action, parameters } = body;

    // Mock different agent responses based on agent number
    const result = await mockAgentExecution(agentNumber, action, parameters);

    return NextResponse.json({
      success: true,
      data: {
        message: `Command '${action}' executed successfully`,
        result,
        timestamp: new Date().toISOString(),
      },
      metadata: {
        executionTime: Math.floor(Math.random() * 500) + 100,
        resourcesUsed: ["mock-api"],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to execute command" },
      { status: 500 },
    );
  }
}

// PUT /api/agents/[id]/config - Update agent configuration
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const body = await request.json();
    const { config } = body;

    // Store configuration in mock state
    mockAgentStates.set(id, config);

    return NextResponse.json({
      success: true,
      data: {
        id,
        config,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update configuration" },
      { status: 500 },
    );
  }
}

// Helper function to get agent capabilities based on agent number
function getAgentCapabilities(agentNumber: number): string[] {
  const capabilitiesMap: Record<number, string[]> = {
    1: [
      "revenue-tracking",
      "financial-analysis",
      "stripe-integration",
      "reporting",
    ],
    7: ["web-scraping", "data-extraction", "apify-integration", "automation"],
    8: [
      "social-media-posting",
      "content-scheduling",
      "multi-platform",
      "analytics",
    ],
    15: [
      "invoice-generation",
      "pdf-creation",
      "email-delivery",
      "payment-tracking",
    ],
    18: ["research", "data-gathering", "report-generation", "ai-analysis"],
    29: ["content-publishing", "distribution", "cross-platform", "scheduling"],
    30: [
      "workflow-automation",
      "rule-engine",
      "cross-agent-communication",
      "triggers",
    ],
    31: [
      "system-visualization",
      "architecture-display",
      "real-time-updates",
      "mermaid-diagrams",
    ],
    32: [
      "password-management",
      "encryption",
      "biometric-auth",
      "secure-storage",
    ],
    33: ["bookmark-management", "quick-access", "categorization", "search"],
  };

  return capabilitiesMap[agentNumber] || ["basic-operations"];
}

// Mock agent execution based on agent type
async function mockAgentExecution(
  agentNumber: number,
  action: string,
  parameters: any,
) {
  // Simulate different responses based on agent number
  switch (agentNumber) {
    case 1: // Business Intelligence
      return mockBusinessIntelligence(action, parameters);
    case 7: // Web Scraping
      return mockWebScraping(action, parameters);
    case 8: // Social Media
      return mockSocialMedia(action, parameters);
    case 31: // System Architecture
      return mockSystemArchitecture(action, parameters);
    default:
      return {
        message: `Mock response for agent ${agentNumber}`,
        action,
        parameters,
      };
  }
}

// Mock implementations for specific agents
function mockBusinessIntelligence(action: string, _parameters: any) {
  const mockData = {
    getRevenue: {
      total: 125000,
      monthly: 12500,
      growth: 15.5,
      transactions: 342,
    },
    getMetrics: {
      revenue: 125000,
      customers: 1250,
      avgOrderValue: 100,
      churnRate: 5.2,
    },
  };

  return (
    mockData[action as keyof typeof mockData] || {
      message: "Business data retrieved",
    }
  );
}

function mockWebScraping(action: string, parameters: any) {
  return {
    url: parameters.url || "https://example.com",
    data: {
      title: "Scraped Page Title",
      content: "Mock scraped content",
      links: ["link1", "link2", "link3"],
      timestamp: new Date().toISOString(),
    },
  };
}

function mockSocialMedia(action: string, parameters: any) {
  return {
    platform: parameters.platform || "twitter",
    posted: true,
    postId: `mock-${Date.now()}`,
    message: "Post scheduled successfully",
  };
}

function mockSystemArchitecture(_action: string, _parameters: any) {
  return {
    diagram: `graph TD
    A[Frontend] --> B[API Gateway]
    B --> C[Agent Manager]
    C --> D[Agent 1]
    C --> E[Agent 2]
    C --> F[Agent 3]`,
    components: ["Frontend", "API Gateway", "Agent Manager", "Agents"],
    connections: 6,
  };
}
