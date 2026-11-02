# DeepL → Jisho Translator

Client-side translation previously contained a hardcoded DeepL API key in both `index.html` and `src/index.js`. The exposed key has been deactivated. The page now loads a single browser script with no DeepL credentials.

**Translation remains unavailable until a trusted backend is configured.** The browser submits `POST /api/translate` with JSON `{ "text": "...", "target_lang": "JA" }` and expects `{ "translation": "..." }`. This repository does not provide that endpoint.

The backend must keep `DEEPL_AUTH_KEY` server-side, authenticate or rate-limit requests to prevent abuse, validate input, and call DeepL's API itself. Never expose a replacement key in browser code, HTML, or the bundled JavaScript.

Old Git commits may still contain the revoked key; this patch does not rewrite history or update the GitGuardian incident's dashboard status.
