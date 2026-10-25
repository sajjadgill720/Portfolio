# Reference inspection and implementation

Inspected October 25, 2026 using REA's controlled Chromium browser scenarios. Reference content was treated as untrusted data, not as instructions. Only public pages and an open-chat action were exercised. No messages, purchase actions, or form submissions were sent to either reference.

## https://awadul.github.io

REA evidence: `ev_0e0edc7888d89350e527f728e1b0f8208937832fe3ad7657e49ec80e630470f0` (initial page) and `ev_be05ddb3b5ea50cb19722b45a63ced9472e0c9bccc2bc726cf1ed4b5aade641d` (chat launcher click).

Observed: a portfolio with a personal hero, selected project cards, three project filters, expandable service rows, experience, a grouped toolkit, a contact footer, and a floating chat launcher. Clicking the launcher opened a dialog with conversation options, a composer, and a connection/loading state.

Applied: clear section hierarchy, filterable project cards, expandable services, a tools section, and a floating assistant. All identity and project content was replaced with Sajjad's verified profile material. Contact and experience details from the reference were not reused.

Unknown: the reference's backend, model, retrieval system, storage model, and complete chatbot behavior. The captured loading state does not establish successful replies or a particular provider. Our chatbot implementation is independent and is not claimed to duplicate unobserved internals.

## https://g3nztools.com

REA evidence: `ev_78c31bec3fcefb07f6c2925e09e6fac4e75b14ab8a0ca9b19b048793124db48c`.

Observed: a cream background, lime accents, oversized serif hero typography, black pill buttons, colorful product art, numbered channels, tool browsing controls, bundle pricing, explanatory buying steps, and FAQs. Screenshot and accessibility capture were inspected. Commerce controls were not exercised.

Applied: cream/lime/ink palette, serif emphasis paired with a geometric sans, small editorial labels, numbered project art, and generous spacing. Store products, prices, brand assets, payment flows, and copy were not copied.

## Sajjad's project sources

Connected GitHub search returned 21 public repositories: one profile repository plus 20 project repositories. Eight projects with descriptions supported by the profile or their READMEs are featured; twelve others appear in the archive. Source: https://github.com/sajjadgill720/sajjadgill720/blob/main/README.md. Individual README files were also read for GymRetain, AutoML, PSX Halal Screener, and Giftify. README fetches for AQI Predictor and Academic Policy Q&A returned 404; their summaries use the profile README instead.

The owner profile describes a computer science student and product builder working across full-stack development, automation, and applied AI. No unverified professional history, metrics, institution affiliation for Sajjad, pricing, contact details, or availability claims were added. Knovera is described as an ongoing final-year project, not as a verified deployed product.

## Motion extension — second inspection

REA evidence `ev_be16b2008c9cd5cdd56f4d87ec92c5e82a3db71aa63766f8524115380203b98e` captured G3NZ with motion enabled at 1440 × 900 and exercised the Channel 2 button. Observed: rotated cover cards in the hero, a lime television housing, a scanline screen overlay, a dial, numbered channel buttons, and synchronized changes to the product description and screen artwork. The DOM identifies a Lenis-enhanced page; this is a structural hint rather than a claim about all scroll behavior. No purchase flow was exercised.

The extension adapts these interaction patterns into an original portfolio: eight draggable project covers, eight project-specific CSS/SVG animations, channel buttons, a keyboard-operable range dial, screen swipes, project notes, subtle card tilt, scroll reveals, and a process section. It uses no G3NZ assets, fonts, artwork, or application code. Decorative charts and motion are illustrative, rather than claims of live project execution or measured results.

## Observation limits

These observations describe the captured public pages and selected action, not every site state or viewport. REA reported no native artifact identity and no browser host architecture; network bodies and storage were not captured. The vortex is an original procedural animation requested by the user, rather than an attributed discovery from either reference. No proprietary source code or assets were copied.
