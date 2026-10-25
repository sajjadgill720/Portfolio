# Chatbot review and next improvements

## Current state

The local preview's `/api/config` returned `ai:false` during this review. The assistant currently answers from the curated portfolio data and local matching logic. Server-side AI integration already exists, but live provider responses require configured credentials and a model. No paid AI requests were made in this review.

The public contact email is now `self.starter.sr@gmail.com`, supplied by the user. The email link opens an in-site contact card through a procedural spiral mask. Compose email opens the visitor's email app; it does not send anything automatically. Chat uses the same mask to reveal its real content. This replaces the earlier decorative vortex overlay.

## Improvements implemented

- Word-boundary intent matching avoids the `rate` substring in `generate` and similar accidental matches.
- Explicit project aliases and recent conversation context keep follow-up questions such as “What technologies does it use?” attached to the previous project in both local-server and static-hosting fallback modes.
- New-project, pricing, and contact questions can show a working Prepare a project brief button.
- Knowledge answers carry project source links. In AI mode the auxiliary links are labelled Related repositories, since the current local matcher does not prove which sources support each generated sentence.
- Reduced motion and the global pause control skip the spiral reveal. Reveal cancellation cleans up the clipping state.

## Recommended next work, in order

1. **Enable and verify the existing AI backend.** Configure `OPENAI_API_KEY` and `OPENAI_MODEL` on the Node deployment. Test the actual provider with project questions, unknown facts, follow-ups, provider failures, and requests to invent prices or experience. Keep the local knowledge fallback. Static hosting alone cannot execute the server endpoint.
2. **Improve the knowledge before adding more UI.** Write one approved case study per featured project: problem, intended users, actual role, architecture, important decisions, current state, limitations, and demonstrable outcomes. Add README excerpts with source URLs and revision dates. Avoid invented metrics and claims of production readiness.
3. **Use passage retrieval with verifiable citations.** Select the relevant case-study/README passages and have the model cite their stable source IDs. Validate those IDs and allowed URLs on the server. The current approach sends all short summaries and chooses auxiliary links separately; those are related links, not verified sentence-level citations.
4. **Improve response controls.** Add streamed answers, a Stop button, an explicit Retry action, and separate messages for a provider timeout versus rate limiting. Preserve the user's question when retrying, without duplicating it in the transcript. Test cancellation and partial responses.
5. **Strengthen enquiry assistance.** Let visitors explicitly transfer their chat idea into the guided brief, review any extracted fields, and then choose to email it. Do not silently populate contact details or send a message. The existing brief CTA is the first part of this flow.
6. **Prepare the public endpoint for real traffic.** Replace the per-process socket-IP limiter with a shared limiter appropriate to the deployment and its trusted proxies. Add a daily provider-spend/request budget, generic client errors, and server metrics for latency, provider errors, and fallback rate. Avoid logging message bodies by default.
7. **Maintain a small answer evaluation set.** Include project-specific, ambiguous, out-of-scope, hostile-instruction, pricing, and multi-turn questions. Score accuracy, correct sources, appropriate uncertainty, and whether the response helps the visitor take a useful next step.

## Reference observation

REA evidence `ev_990378aee57db6eafb304a0be11f27366f5d4aa32071e40e7c23df177ae853bd`: inspected `https://awadul.github.io` with motion enabled. Observed an opening intro and, after clicking its chat launcher, a chat panel with an inline `clip-path: path(...)` beginning as a spiral. A subsequent capture showed the complete panel in a connection/loading state. The portfolio's mask is an independent procedural implementation. The reference's chatbot backend and successful response behavior were not established by this observation.
