# devxsol — Interactive Portfolio & Studio

A modern, high-performance portfolio and developer experience platform featuring procedural 3D particle animations, interactive project showcases, automated workflow diagrams, and a conversational assistant. Built with zero runtime frontend framework overhead using standard Web APIs, Canvas 2D, SVG, and CSS.

---

## ✨ Features

- **Procedural 3D Golden Sculpture**: Interactive 3D particle sculpture that morphs continuously between geometry modes (*The knot*, *The orbit*, *Scatter ↗*) with a 24-karat gold lighting model, dynamic mouse luster waves, and tactile click shockwaves.
- **Interactive Project TV Player**: Channel-based project player inspired by retro broadcast consoles with dial knobs, animated SVG concept pipelines, and sticky storytelling scroll.
- **Agentic AI Workflow Visuals**: Interactive architecture breakdown showcasing RAG pipelines, reasoning core nodes, and autonomous tool execution.
- **Embedded Conversational Assistant**: Grounded local assistant with dual modes:
  - Local portfolio knowledge mode (zero third-party dependencies required).
  - Optional server-side AI integration using the OpenAI Responses API.
- **Guided Project Brief Builder**: Interactive 3-step project brief generator allowing visitors to draft specifications, select scope/timeline preferences, and export directly.
- **Responsive & Accessible**: Native light and dark themes, strict accessibility (`prefers-reduced-motion` detection, ARIA status announcements), and mobile-first responsive design.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `24.x` recommended (supports native ESM and built-in test runner).

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/sajjadgill720/Portfolio.git

# Enter the project directory
cd Portfolio

# Start the local development server (serves directly from public/)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Configuration

Create a `.env` file in the project root to configure optional capabilities:

```env
PORT=3000

# Optional: Enable OpenAI conversational assistant mode
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Optional: Override contact email displayed in the UI
CONTACT_EMAIL=your_email@example.com
```

> **Note**: If `OPENAI_API_KEY` is not provided, the assistant automatically runs in **local knowledge mode**, answering questions from `public/knowledge.js` without requiring API keys or network access.

---

## 📦 Building for Production

```bash
# Build static files to dist/
npm run build

# Run automated test suites
npm test
```

### Deployment

The repository is configured for immediate deployment to **Vercel** or any static host:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Serverless API**: Handled automatically via `api/chat.js` and `api/config.js`.

---

## 📁 Project Structure

```
├── api/                  # Serverless API routes (chat & config)
├── public/               # Application source assets
│   ├── assets/           # Media & avatar photography
│   ├── hero-vortex.js    # 3D procedural golden particle canvas & controls
│   ├── motion.js         # TV project player & sticky scroll storytelling
│   ├── studio.js         # AI automation workflows & interactive cards
│   ├── knowledge.js      # Local portfolio Q&A engine
│   ├── portfolio.js      # Main client application orchestration
│   ├── style.css         # Typography, layout, and theme tokens
│   ├── motion.css        # Interactive transitions & animations
│   ├── refinements.css   # Studio layouts & component styling
│   └── index.html        # Semantic HTML structure
├── scripts/
│   └── build.js          # Independent static build script
├── tests/                # Node.js native test suites
├── dev-server.js         # Zero-dependency local Node.js development server
└── vercel.json           # Production deployment configuration
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.
