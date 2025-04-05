import { createMistral } from "@ai-sdk/mistral";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: mistral("open-mistral-7b"),
    messages,
  });

  return result.toDataStreamResponse();
}
