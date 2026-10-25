# Project brief UX refinement

The primary review is now a structured summary with individual Edit actions for project, budget/timing, and contact details. The full email text remains available as an optional customization tool. The revised layout reduces the large heading and removes the nested raw-message scroll area from the default review.

The dialog has one scrollable content region and a persistent action bar. Continue, Review brief, and Open email draft describe the next action explicitly. The review footer explains that the email app opens a draft for the visitor to review and send. Copy and text download remain available as alternatives.

Only idea, name, and email are required. Project type includes Not sure yet; budget and timing start with undecided options. Audience, features, organization, and notes are revealed progressively. Required fields have contextual inline errors connected with aria-describedby and aria-invalid. Completed steps can be revisited, while future steps remain unavailable until required details are valid.

Drafts resume at the last step within the browser session. Starting over provides Undo. Existing field values are migrated from the previous brief. Recognized unedited legacy messages use the new summary; nonstandard/custom legacy messages remain available in the message editor. Manually customized messages are called out before sharing and can be reset to the current summary.

Verified in isolated browser contexts at 1440 × 1000 and 390 × 844: required validation, invalid email, summary edit links, review navigation, generated mailto body and recipient, optional custom message, download filename, reset-to-summary, draft reload, clear/undo, dark mode, and no horizontal overflow. The mobile action bar stayed within the viewport. No mail was sent. Screenshots: brief-ux-desktop.png and brief-ux-mobile.png.
