# AI Movie Search

This project is a small full‑stack demo that lets you chat with an AI assistant in order to identify movies.  It contains two parts:

- **server** – an Express backend that proxies requests to the OpenAI API.  The main endpoint is `/api/chat`.
- **client** – a Vite/React frontend styled similar to ChatGPT where you can type or upload an image/video frame describing a movie.  The assistant will either provide a direct IMDb link or ask you follow up questions.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)
- An OpenAI API key and organization ID

## Environment Variables

The backend expects OpenAI credentials in a `.env` file located in the `server` directory. An example file is provided at `server/.env.example`.  Copy this file to `server/.env` and fill in your own values for the following keys:

```bash
OPENAI_API_KEY=<your OpenAI API key>
OPENAI_ORG_ID=<your OpenAI organization id>
OPENAI_MODEL=gpt-3.5-turbo
```

## Running the Backend

```bash
cd server
npm install
node index.js
```

This starts the Express server on `http://localhost:5000`.

## Running the Frontend

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:3000` and will proxy API requests to the backend.

For more details about the React setup, see [`client/README.md`](client/README.md).
