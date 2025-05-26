import { createOllama } from "ollama-ai-provider";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const ollama = createOllama();

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: ollama("incept5/llama3.1-claude:latest"),
    messages,
  });

  return result.toDataStreamResponse();
}
