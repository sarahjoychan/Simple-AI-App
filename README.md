# AI Integrated Web App

Full-stack prompt app with:
- `webb/`: React + TypeScript + Vite frontend
- `server/`: Express + TypeScript backend (calls OpenAI Responses API)

## Prerequisites

- Node.js `18+` (Node `20+` recommended)
- npm
- An OpenAI API key

## 1. Clone the repository

```bash
git clone <your-repo-url>
cd AI-intergrated-webb-app
```

## 2. Set up the backend (`server`)

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```env
OPENAI_API_KEY=your_real_openai_api_key
PORT=8787
CLIENT_ORIGIN=http://localhost:5173
```

Important:
- The repository does not include real API keys.
- Each developer must add their own `OPENAI_API_KEY` locally in `server/.env`.
- If you need access to a passkey/API key for this project, contact me directly so I can confirm whether access should be granted.
- `server/.env.example` is the template that should be committed, not `server/.env`.

Start backend:

```bash
npm run dev
```

Expected log:

```txt
Server: http://localhost:8787
```

## 3. Set up the frontend (`webb`)

Open a second terminal:

```bash
cd webb
npm install
npm run dev
```

Expected Vite local URL is typically:

```txt
http://localhost:5173
```

## 4. Use the app

1. Open `http://localhost:5173`
2. Enter a prompt
3. Submit and confirm a response is returned

## Production build (optional)

Backend:

```bash
cd server
npm run build
npm start
```

Frontend:

```bash
cd webb
npm run build
npm run preview
```

## Troubleshooting

- `Prompt is required.`: submit a non-empty prompt.
- `Server missing OPENAI_API_KEY.`: check `server/.env`.
- Browser/network errors calling `/api/generate`: make sure backend is running on `http://localhost:8787`.
- CORS issues: verify `CLIENT_ORIGIN` in `server/.env` matches your frontend URL.
