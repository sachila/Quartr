# Quartr

A full-stack app for browsing SEC EDGAR company filings: an Express + TypeScript API and a React + Typescript web client.

## Project Structure

- `api/` — Express + TypeScript backend that talks to SEC EDGAR (company tickers, submissions, filings)
- `web-client/` — React + TypeScript + Tailwind frontend that consumes the API

## Prerequisites

- Node.js (v20+) and npm

## 1. Run the API

```bash
cd api
npm install
npm run dev
```

The API starts on `http://localhost:3001` by default (override with a `PORT` env var).

Optional: set a descriptive SEC User-Agent (SEC requires one on all requests):

## 2. Run the web client

In a separate terminal:

```bash
cd web-client
npm install
npm run dev
```

The web client starts on `http://localhost:4200`. It proxies requests from `/api/*` to the API at `http://localhost:3001`, so make sure the API is running first.

## Building for production

```bash
# API
cd api && npm run build && npm start

# Web client
cd web-client && npm run build
```
