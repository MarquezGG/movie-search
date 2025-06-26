# AI Movie Search

This project demonstrates a small full‑stack application that suggests movies using the OpenAI Assistants API. It contains two separate parts:

- **server** – an Express backend that queries OpenAI and exposes a `/api/search` endpoint.
- **client** – a Vite/React frontend that lets you describe a movie and displays the suggestions.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)
- An OpenAI API key and organization ID

## Environment Variables

The backend expects OpenAI credentials in a `.env` file located in the `server` directory. Create `server/.env` with the following keys:

```bash
OPENAI_API_KEY=<your OpenAI API key>
OPENAI_ORG_ID=<your OpenAI organization id>
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
