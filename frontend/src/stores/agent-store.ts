import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { AgentCommand, AgentResponse } from "@/types/shared";

interface AgentState {
  socket: Socket | null;
  isConnected: boolean;
  agents: Record<number, any>;
  activeAgent: number | null;
  isMockMode: boolean;

  // Actions
  connect: (token: string) => Promise<void>;
  disconnect: () => void;
  initializeAgent: (agentNumber: number, config?: any) => Promise<void>;
  executeCommand: (
    agentNumber: number,
    command: AgentCommand,
  ) => Promise<AgentResponse>;
  processVoiceCommand: (agentNumber: number, text: string) => Promise<string>;
  setActiveAgent: (agentNumber: number | null) => void;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  socket: null,
  isConnected: false,
  agents: {},
  activeAgent: null,
  isMockMode: process.env.NEXT_PUBLIC_MOCK_MODE === "true",

  connect: async (token: string) => {
    const { socket, isMockMode } = get();

    if (socket?.connected) {
      return;
    }

    // In mock mode, simulate connection without actual WebSocket
    if (isMockMode) {
      console.log("Running in mock mode - simulating connection");
      set({ isConnected: true });
      return;
    }

    const newSocket = io(
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
      {
        auth: { token },
        transports: ["websocket"],
      },
    );

    // Set up event listeners
    newSocket.on("connect", () => {
      console.log("WebSocket connected");
      set({ isConnected: true });
    });

    newSocket.on("disconnect", () => {
      console.log("WebSocket disconnected");
      set({ isConnected: false });
    });

    newSocket.on("agent:status", (data) => {
      console.log("Agent status update:", data);
      set((state) => ({
        agents: {
          ...state.agents,
          [data.agentNumber]: {
            ...state.agents[data.agentNumber],
            status: data.status,
            details: data.details,
          },
        },
      }));
    });

    newSocket.on("agent:response", (data) => {
      console.log("Agent response:", data);
      set((state) => ({
        agents: {
          ...state.agents,
          [data.agentNumber]: {
            ...state.agents[data.agentNumber],
            lastResponse: data.response,
          },
        },
      }));
    });

    newSocket.on("agent:error", (data) => {
      console.error("Agent error:", data);
      set((state) => ({
        agents: {
          ...state.agents,
          [data.agentNumber]: {
            ...state.agents[data.agentNumber],
            error: data.error,
          },
        },
      }));
    });

    set({ socket: newSocket });

    // Wait for connection
    await new Promise<void>((resolve) => {
      newSocket.once("connect", resolve);
    });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  initializeAgent: async (agentNumber: number, config?: any) => {
    const { socket, isMockMode } = get();

    // Mock mode implementation
    if (isMockMode) {
      set((state) => ({
        agents: {
          ...state.agents,
          [agentNumber]: {
            initialized: true,
            config,
            status: "idle",
          },
        },
      }));
      return;
    }

    if (!socket) throw new Error("Not connected");

    return new Promise((resolve, reject) => {
      socket.emit(
        "agent:initialize",
        { agentNumber, config },
        (response: any) => {
          if (response.success) {
            set((state) => ({
              agents: {
                ...state.agents,
                [agentNumber]: {
                  initialized: true,
                  config,
                  status: "idle",
                },
              },
            }));
            resolve();
          } else {
            reject(new Error(response.error || "Failed to initialize agent"));
          }
        },
      );
    });
  },

  executeCommand: async (agentNumber: number, command: AgentCommand) => {
    const { socket, isMockMode } = get();

    // Mock mode implementation
    if (isMockMode) {
      const response = await fetch(`/api/agents/${agentNumber}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(command),
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || "Command execution failed");
      }
    }

    if (!socket) throw new Error("Not connected");

    return new Promise((resolve, reject) => {
      socket.emit(
        "agent:execute",
        { agentNumber, command },
        (response: any) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.error || "Command execution failed"));
          }
        },
      );
    });
  },

  processVoiceCommand: async (agentNumber: number, text: string) => {
    const { socket, isMockMode } = get();

    // Mock mode implementation
    if (isMockMode) {
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, activeAgent: agentNumber }),
      });
      const data = await response.json();
      if (data.success) {
        return data.data.text;
      } else {
        throw new Error(data.error || "Voice command failed");
      }
    }

    if (!socket) throw new Error("Not connected");

    return new Promise((resolve, reject) => {
      socket.emit("agent:voice", { agentNumber, text }, (response: any) => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response.error || "Voice command failed"));
        }
      });
    });
  },

  setActiveAgent: (agentNumber: number | null) => {
    const { socket } = get();

    // Unsubscribe from previous agent
    const { activeAgent } = get();
    if (activeAgent !== null && socket) {
      socket.emit("agent:unsubscribe", activeAgent);
    }

    // Subscribe to new agent
    if (agentNumber !== null && socket) {
      socket.emit("agent:subscribe", agentNumber);
    }

    set({ activeAgent: agentNumber });
  },
}));
