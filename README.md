# Sajjad Ur Rehman — Portfolio

A complete portfolio based on Sajjad's public GitHub work, with an original cream-and-lime visual system, an animated canvas vortex, project filters, a repository archive, service accordions, and a portfolio assistant. No npm dependencies are required.

## Run it

Requires Node.js 22.6 or later (tested with 24.22).

```powershell
cd E:\Portfolio
npm run dev
```

Open http://localhost:3000. The development server also serves the production app; `npm start` uses the same command. If that port is occupied, set `PORT` in `.env`.

## What you need to do

1. Review the name, bio, skills, project descriptions, and project status in `public/data.js`. Eight documented projects are featured; the remaining twelve public project repositories are linked in the archive. No employment history or qualifications have been invented.
2. Optionally add your email: copy `.env.example` to `.env`, then set `CONTACT_EMAIL`. The contact link currently points to your verified GitHub profile. A photo, LinkedIn, CV, and custom domain can be added later when you provide them.
3. To enable AI conversations, put `OPENAI_API_KEY` and an available Responses API model ID in `OPENAI_MODEL` in `.env`, then restart. Use an API account with billing enabled. Keep the key on the server and never put `.env` in a repository. No paid API call has been tested without your credentials.
4. Deploy either the whole project to a Node-capable host using `npm start`, or run `npm run build` and publish the contents of `dist` to static hosting. The Node version supports AI. Static hosting, including GitHub Pages, supports the built-in knowledge assistant and brief builder, but cannot run the AI endpoint. Serve static files over HTTP(S), rather than double-clicking the HTML file.
5. After deployment, check a project filter, ask the assistant about GymRetain, download a project brief, and test your contact link on a phone. If using AI, verify a real response and set provider usage limits before sharing publicly.

## Chat features

- Grounded local answers about projects, background, and tools, with repository source links.
- Optional server-side OpenAI Responses API integration; source knowledge is supplied in the server instructions. The model has no action tools and cannot send messages or book meetings.
- Session-only browser history, New chat, conversation export, keyboard submission, loading feedback, and graceful fallback when the provider is unavailable.
- An editable project brief with copy and text download. Drafts remain in browser session storage. Nothing is submitted or emailed automatically.
- Input limits, same-origin validation, request timeouts, an explicit static-file allowlist, and a simple in-memory rate limit of 20 requests per minute per socket IP. This limit is per server process; multiple instances need a shared limiter. Behind a reverse proxy, visitors may share the proxy's IP; configure a trusted deployment-specific limiter before a high-traffic AI launch.

Messages are stored in sessionStorage on the visitor's browser. With AI configured, the latest 12 messages are sent through the server to OpenAI with `store:false`. This is not a promise of zero provider retention. The app does not log message bodies or persist conversations on the server.

## Visuals and content

The motion extension includes a draggable eight-cover project deck, a TV-inspired project player with eight original animated illustrations, numbered channels, a range dial, keyboard controls, and screen swipes. Each project also has a notes dialog and assistant handoff. Scroll reveals, project-art tilt, animated diagrams, and a four-stage process section complete the browsing experience. The player's Pause all motion control also controls the hero vortex and ambient CSS animations; reduced-motion settings disable them. Project-player and deck animations pause offscreen.

The vortex and project concept illustrations are drawn locally with Canvas, SVG, and CSS. They are original visual summaries, not screenshots of deployed products. The UI labels this distinction. Google Fonts enhance the typography; system fallbacks are provided if the fonts cannot load. The vortex has a pause control and respects reduced-motion settings.

References and REA evidence are documented in [docs/reference-inspection.md](docs/reference-inspection.md). Setup for the optional AI backend follows the [official OpenAI quickstart](https://developers.openai.com/api/docs/quickstart) and [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create).

## Check and build

```powershell
npm test
npm run build
```

Tests exercise the actual HTTP server: public asset serving, private-file denial, message validation, cross-origin rejection, malformed input, grounded responses, and unknown-fact handling. Browser checks cover desktop/mobile layout, filtering, chat, session restoration/reset, brief downloads, and animation controls. AI provider acceptance still requires real credentials.

## Editing

`public/index.html`: page structure and copy. `public/style.css`: visual system and responsive layouts. `public/data.js`: profile, featured projects, skills, and archive. `public/knowledge.js`: local assistant. `public/app.js`: interactions, vortex, chat, brief builder. `server.js`: static hosting and AI endpoint.

This workspace was empty and has no Git remote. Nothing has been pushed or published.
