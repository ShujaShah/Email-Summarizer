## Packages
framer-motion | Smooth animations for list items and transitions
date-fns | Formatting dates for email timestamps
clsx | Conditional class names utility
tailwind-merge | Merging tailwind classes safely

## Notes
- "Run Workflow" triggers the backend seed/simulation logic via POST /api/workflow/run
- Summarize action is asynchronous but handled via immediate mutation response in this MVP
- Category filtering happens on the client side for this iteration unless backend adds query params
