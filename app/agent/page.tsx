"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  Connection,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { NodeStatusIndicator } from "@/components/node-status-indicator";

// Initial state: Only the Start node
const initialNodes: Node[] = [
  {
    id: "start-node",
    type: "input",
    data: { label: "Start" },
    position: { x: 250, y: 5 },
  },
];

// Node IDs
const START_NODE_ID = "start-node";
const LLM_NODE_ID = "llm-node";
const OUTPUT_NODE_ID = "output-node";

function FlowComponent() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [promptInput, setPromptInput] = useState("");

  const { messages, append, isLoading, error, setMessages } = useChat({
    api: "/api/agent",
  });

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleRunAI = async () => {
    if (!promptInput.trim()) return; // Don't run if prompt is empty

    // Reset messages for a fresh chat session for this run
    setMessages([]);

    // Show loading skeleton
    setNodes((nds) => {
      const startNode = nds.find((n) => n.id === START_NODE_ID);
      if (!startNode) return nds; // Should not happen

      return [
        startNode,
        {
          id: LLM_NODE_ID,
          data: {
            label: (
              <NodeStatusIndicator status="loading">
                Processing...
              </NodeStatusIndicator>
            ),
          },
          position: { x: startNode.position.x, y: startNode.position.y + 75 },
          style: {
            width: "auto", // Allow node to size based on content
            height: "auto",
            padding: "10px", // Add some padding
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        },
      ];
    });
    setEdges([
      {
        id: `e-${START_NODE_ID}-${LLM_NODE_ID}`,
        source: START_NODE_ID,
        target: LLM_NODE_ID,
      },
    ]);

    await append({ role: "user", content: promptInput });
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (
        lastMessage.role === "assistant" &&
        lastMessage.content &&
        !isLoading
      ) {
        setNodes((nds) => {
          const llmNode = nds.find((n) => n.id === LLM_NODE_ID);
          if (!llmNode) return nds;

          const updatedLlmNode = {
            ...llmNode,
            data: { label: lastMessage.content },
            style: {
              ...llmNode.style,
              width: "auto",
              height: "auto",
              padding: "10px",
              whiteSpace: "pre-wrap",
            }, // Adjust style for content
          };

          const outputNode = {
            id: OUTPUT_NODE_ID,
            type: "output",
            data: { label: "End" },
            position: {
              x: updatedLlmNode.position.x,
              y: updatedLlmNode.position.y + (llmNode.height || 60) + 75,
            },
          };
          return [
            nds.find((n) => n.id === START_NODE_ID)!,
            updatedLlmNode,
            outputNode,
          ];
        });

        setEdges((eds) => [
          eds.find((e) => e.target === LLM_NODE_ID)!, // Keep edge to LLM node
          {
            id: `e-${LLM_NODE_ID}-${OUTPUT_NODE_ID}`,
            source: LLM_NODE_ID,
            target: OUTPUT_NODE_ID,
          },
        ]);
      }
    }
    // Ensure isLoading is a dependency to re-evaluate when loading finishes
  }, [messages, setNodes, setEdges, isLoading]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #eee",
          background: "white",
          color: "black",
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          placeholder="Enter your prompt"
          style={{
            padding: "8px",
            marginRight: "10px",
            flexGrow: 1,
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) handleRunAI();
          }}
        />
        <Button
          onClick={handleRunAI}
          disabled={isLoading || !promptInput.trim()}
          style={{
            padding: "8px 12px",
            marginRight: "10px",
            cursor:
              isLoading || !promptInput.trim() ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Processing..." : "Run AI Step"}
        </Button>
        {error && (
          <span style={{ color: "red", marginRight: "10px" }}>
            Error: {error.message}
          </span>
        )}
      </div>
      <div style={{ flexGrow: 1 }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            attributionPosition="bottom-left"
          >
            <Background />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default function AgentPage() {
  return (
    <ReactFlowProvider>
      <FlowComponent />
    </ReactFlowProvider>
  );
}
