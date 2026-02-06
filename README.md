# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Chatbot + Agent Integration

The portfolio now includes a floating chatbot in the UI that connects to the Python RAG agent in `src/main.py`.

Run the API backend:

```bash
python src/main.py --mode api --host 127.0.0.1 --port 8000
```

Run the frontend:

```bash
npm run dev
```

Optional frontend API URL override (default is `http://127.0.0.1:8000`):

```bash
VITE_CHAT_API_URL=http://127.0.0.1:8000 npm run dev
```

Useful backend endpoints:

- `GET /health`
- `POST /connect` (use existing index)
- `POST /reindex` (rebuild from PDFs in `DOCS_DIR`)
- `POST /chat` with JSON `{ "message": "..." }`

## Quick Start (Local)

Install frontend dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Run backend (API mode, using local venv):

```bash
venv/bin/python src/main.py --mode api --host 127.0.0.1 --port 8000
```

Health check:

```bash
curl http://127.0.0.1:8000/health
```

## Local Backend With Docker (Recommended)

This is a production-like way to run the RAG API locally.

1) Build the image:

```bash
docker build -t portfolio-rag .
```

2) Create a Docker env file (do not commit secrets):

Create `./.env.docker` (no quotes) with:

```env
AZURE_COSMOS_DB_ENDPOINT=https://...
AZURE_COSMOS_DB_KEY=...
COSMOS_DB_NAME=...
COSMOS_CONTAINER_NAME=...
GEMINI_API_KEY=...
GEMINI_MODEL=...
CORS_ORIGINS=http://localhost:5173
```

3) Run the container:

```bash
docker run --rm -p 8080:8080 --env-file ./.env.docker portfolio-rag
```

4) Health check:

```bash
curl http://127.0.0.1:8080/health
```

5) Point the frontend to the Docker backend:

```bash
npm run dev
```

This repo includes a local dev override at `/.env.local`:

```env
VITE_CHAT_API_URL=http://127.0.0.1:8080
```

## Environment Variables

Frontend (production):

- `VITE_CHAT_API_URL` = backend URL (e.g. Render URL)

Backend (Render or local):

- `AZURE_COSMOS_DB_ENDPOINT`
- `AZURE_COSMOS_DB_KEY`
- `COSMOS_DB_NAME`
- `COSMOS_CONTAINER_NAME`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `DOCS_DIR` (defaults to `./src/documentos_subidos`)
- `CORS_ORIGINS` (e.g. `https://frankchip2023.github.io/portfolio`)

## Deploy: GitHub Pages (Frontend)

This repo is configured for GitHub Pages with Vite basepath `/portfolio/`.

Deploy steps:

```bash
npm run build
npm run deploy
```

Make sure GitHub Pages uses the `gh-pages` branch (root folder).

## Deploy: Render (Backend)

`render.yaml` is included to deploy the RAG API.

Key settings:

- Build command: `pip install -r requirements.txt`
- Start command:
  ```
  /bin/sh -c "python -u src/main.py --mode api --host 0.0.0.0 --port ${PORT:-10000}"
  ```

After deploy, set frontend env:

```
VITE_CHAT_API_URL=https://your-render-service.onrender.com
```

Then redeploy the frontend to GitHub Pages.

## Troubleshooting

- **Blank page on GitHub Pages**: do a hard refresh (`Cmd + Shift + R`). GitHub Pages can cache old assets after a deploy.
- **Chat “Failed to fetch”**: verify `VITE_CHAT_API_URL` and CORS on the backend.
- **Python module not found**: run with `venv/bin/python` instead of system `python3`.
