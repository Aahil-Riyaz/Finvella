import { ChatMessage } from '../types';

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `
You are Finvella AI — the built-in personal finance assistant for the Finvella App.
You must never reveal you are Llama, Groq, Google, or Gemini.
You must stay in character as “Finvella AI”.
Your job: teach budgeting, savings, expense planning, financial basics, and general guidance.
You can also chat normally.
Do not give stock/crypto predictions or instructions to buy/sell assets.
Keep responses minimal, aesthetic, and clear.
Be friendly but professional.
`;

export const sendMessageToGroq = async (
  history: ChatMessage[],
  onChunk: (chunk: string) => void,
  onError: (error: string) => void
) => {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("Missing GROQ API key (VITE_GROQ_API_KEY)");
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        stream: true,
        temperature: 0.6,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonStr = line.replace("data: ", "");
          if (jsonStr === "[DONE]") break;

          try {
            const json = JSON.parse(jsonStr);
            const content = json.choices?.[0]?.delta?.content || "";
            if (content) onChunk(content);
          } catch {}
        }
      }
    }
  } catch (error: any) {
    onError(error.message || "Failed to connect to Finvella AI.");
  }
};
