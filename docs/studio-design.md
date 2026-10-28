# Lower-page studio redesign

The redesign begins at Selected work and continues through the contact section. It keeps the established cream, lime, and ink theme, with paired geometric sans and editorial serif typography.

## Design and motion

- An asymmetric project collection with eight original SVG motion posters, illustrated project marks, drawing paths, moving orbit points, floating technology chips, and subtle pointer tilt. These are conceptual illustrations; they do not claim to be screenshots or live product data.
- An animated AI automation engineering centerpiece in the about section, featuring the builder's avatar with circular dual lime glow rings, cybernetic scan beam, background procedural neural network canvas, orbital paths, workflow steps (`01 INGEST`, `02 AI REASONING`, `03 AUTOMATE`, `04 DEPLOY`), and floating code sparks. The companion problem-solving loop explains the engineering flow in readable mobile copy.
- Expandable services with animated connected-system diagrams. One service panel stays open at a time.
- Illustrated process stages and a traveling progress line.
- Toolkit grouped into interfaces, systems, intelligence, and foundations, using only technologies from the verified profile.
- A contact section with an original procedural Canvas particle network, orbit rings, and a conversation stamp. Existing brief and contact actions remain functional.

All ambient animations follow the global motion control and reduced-motion preference. Gallery posters, the about illustration, services, and the contact Canvas suspend animation when offscreen. Canvas rendering also stops when the page is hidden.

## Assets

The about section incorporates the builder's avatar (`public/assets/avatar.jpg`) framed by an interactive neural network canvas (`<canvas class="avatar-neural-canvas">`) and pure CSS motion graphics. It is loaded lazily and optimized for crisp high-DPI displays.

## Verification

Browser checks in a separate context: all eight gallery posters render; the generated image loads; filtering returns two AI projects and four data/ML projects; project notes open; service panels open one at a time; the brief dialog still opens. No page errors or horizontal overflow observed at 390px, and no horizontal overflow at 320px. Reduced-motion mode removes the sculpture animation. Desktop and mobile screenshots are saved in `docs/studio-*.png`.
