// functions/api.js
export async function onRequestPost(context) {
  const { request, env } = context; // env will have your secret if set in Cloudflare Dashboard
  try {
    const body = await request.json();
    const message = body.message || body.text || body.prompt || "";

    if (!env.GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: "GROQ_API_KEY missing in Cloudflare env" }), { status: 500 });
    }

    const groqResp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // or whichever model you have access to
        messages: [
          { role: "system", content: "You are Finvella AI — be helpful and short." },
          { role: "user", content: message }
        ],
        stream: false,
      }),
    });

    if (!groqResp.ok) {
      const t = await groqResp.text().catch(()=>null);
      return new Response(JSON.stringify({ error: `Groq error ${groqResp.status}`, detail: t }), { status: 502 });
    }

    const data = await groqResp.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}
