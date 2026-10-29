import { profile, projects, projectUrl } from '../public/data.js';
import { answerLocally } from '../public/knowledge.js';

const limits = new Map();

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Same-origin check
  if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}` && req.headers.origin !== `https://${req.headers.host}`) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  if (!req.headers['content-type']?.startsWith('application/json')) {
    return res.status(415).json({ error: 'Expected JSON' });
  }

  // Rate limiting
  const now = Date.now();
  const key = (process.env.VERCEL && req.headers['x-forwarded-for']) || req.socket?.remoteAddress || 'client';
  for (const [ip, value] of limits) if (now - value.time > 60000) limits.delete(ip);
  const limit = limits.get(key) || { time: now, count: 0 };
  if (++limit.count > 25) return res.status(429).json({ error: 'Please wait a minute' });
  limits.set(key, limit);

  let data;
  try {
    if (typeof req.body === 'string' && Buffer.byteLength(req.body) > 24000) {
      return res.status(413).json({ error: 'Request too large' });
    }
    data = typeof req.body === 'object' && req.body !== null ? req.body : JSON.parse(req.body || '{}');
    if (Buffer.byteLength(JSON.stringify(data)) > 24000) {
      return res.status(413).json({ error: 'Request too large' });
    }
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  if (!data || !Array.isArray(data.messages) || !data.messages.length || data.messages.length > 12 ||
    data.messages.some(m => !m || !['user', 'assistant'].includes(m.role) || typeof m.content !== 'string' || m.content.length > 6000) ||
    data.messages.at(-1).role !== 'user' || data.messages.at(-1).content.trim().length < 1 ||
    data.messages.at(-1).content.length > 1500) {
    return res.status(400).json({ error: 'Invalid messages' });
  }

  const question = data.messages.at(-1).content;
  const local = answerLocally(question, data.messages.slice(0, -1));

  const apiKey = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ ...local, mode: 'knowledge' });
  }

  // Auto-detect provider & model (Groq keys start with gsk_)
  const isGroq = apiKey.startsWith('gsk_');
  const baseURL = isGroq
    ? (process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1')
    : (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1');
  const model = process.env.OPENAI_MODEL || process.env.GROQ_MODEL || (isGroq ? 'qwen/qwen3.8-27b' : 'gpt-4o-mini');

  const verifiedContext = JSON.stringify({
    profile: {
      name: profile.name,
      role: 'Full-stack software engineer & applied AI automation builder',
      bio: profile.bio,
      email: profile.email,
      github: profile.github,
      skills: profile.skills
    },
    projects: projects.map(p => ({
      name: p.name,
      category: p.category,
      short: p.short,
      description: p.description,
      techStack: p.tags,
      status: p.status,
      url: projectUrl(p)
    }))
  });

  const systemPrompt = `You are SR's Portfolio Knowledge Assistant, responding with the authoritative expertise, architectural clarity, and practical rigor of a Senior Software Engineer & AI Systems Architect.

Portfolio & Engineering Context:
${verifiedContext}

Senior Engineer Persona & Guidelines:
1. Architectural Depth & Technical Mastery:
   - When answering questions about software development, system design, frameworks, or SR's projects, answer with deep technical insight. Explain the architectural trade-offs (e.g., stateful agent loops vs. linear prompt chains, FastAPI async concurrency vs. WSGI overhead, PostgreSQL relational integrity vs. document stores, vector embedding search vs. lexical search, token latency, and deterministic retries).
   - Talk about code, architectures, and design patterns with clarity, pragmatism, and engineering discipline. Avoid fluff or superficial buzzwords.
   - For general engineering or technical questions, provide high-signal, practical senior engineering answers, clean patterns, or code snippets when helpful.

2. Grounded in SR's Authentic Portfolio:
   - Accurately reference SR's real builds:
     - Demo Automation Platform (TypeScript, FastAPI, LangGraph cyclic state-machine agent graphs, real-time audio orchestration).
     - GymRetain (Multi-tenant SaaS, attendance streak tracking, member retention automation, PostgreSQL).
     - AQI Predictor (Time-series air quality forecasting for Pakistani cities, data ingestion pipelines, automated retraining).
     - AutoML Platform (Modular tabular machine learning pipeline, automated preprocessing, scikit-learn, hyperparameter tuning).
     - PSX Halal Screener (Equities screening with AAOIFI financial ratio filtering, zakat calculation).
     - Academic Policy Q&A (NUST policy retrieval with TF-IDF, MinHash, SimHash sublinear indexing).
     - Giftify / Keepsake (Customization pipeline with proof generation & review).
     - AI vs. Dot-Com Cycle (Empirical market cycle research, valuation multiples, concentration analysis).
     - Current  project: Knovera (personalized adaptive learning platform for children aged 4-14).
   - Do not hallucinate fake phone numbers, fake prices, or unverified claims. Explain clearly when something is outside your verified knowledge.

3. Problem Breakdown & Project Architecture:
   - When a visitor asks about building an application, designing a system, or automating a workflow (e.g., "restaurant automation", "inventory sync", "booking engine", "voice agent", "real-time analytics"): IMMEDIATELY break down the problem with the architectural rigor of a Senior Systems Architect:
     a. Core State & Data Model: Define the key entities, schema requirements, status transitions, and relational/ACID vs document trade-offs.
     b. Real-Time & Event Architecture: Specify communication layers (FastAPI/Node, WebSockets, background workers, event queues, retry policies).
     c. Reliability & Edge Cases: Highlight critical failure modes (e.g., race conditions, network drops, idempotency, offline sync).
     d. Actionable Strategy: Relate architectural patterns to relevant lessons from SR's builds (like state machines from Demo Automation or multi-tenant isolation from GymRetain) and encourage them to click "Project brief" or connect at ${profile.email}.

Formatting:
- Format responses cleanly with Markdown (bullet points, bold highlights, code blocks where appropriate).
- Be conversational, direct, and senior-grade.`;

  try {
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...data.messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    ];

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        max_tokens: 750,
        temperature: 0.4
      }),
      signal: AbortSignal.timeout(18000)
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw Error(errBody.error?.message || `Provider returned HTTP ${response.status}`);
    }

    const result = await response.json();
    const text = result.choices?.[0]?.message?.content?.trim();
    if (!text) throw Error('Empty answer from AI model');

    return res.status(200).json({
      text,
      sources: local.sources,
      action: local.action,
      mode: 'ai'
    });
  } catch {
    return res.status(200).json({
      ...local,
      mode: 'knowledge',
      notice: 'AI is temporarily unavailable. Answered from portfolio knowledge.'
    });
  }
}
