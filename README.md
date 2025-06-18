# Sound Server Backend

This project is a backend service for a Music Player IoT Project.

## Tech Stack

- Node.js (JavaScript, ES6)
- Express.js (REST API)
- ws (WebSocket, mounted at /handshake)
- PostgreSQL (with Prisma ORM)
- UUIDs for IDs

## Features

- Song collection with file URL field
- Playlist feature with song order
- REST API for user interface
- WebSocket for microcontroller communication
- Functional programming style, decoupled routing/controllers
- Mock song data handling (local files)

## Setup

1. Configure your PostgreSQL database in `.env` (see below).
2. Run migrations: `npx prisma migrate dev --name init`
3. Start the server: `node src/index.js`

## Database Connection Example

`DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sounddb"`

## Endpoints

- `POST /play/:songID` — Play a song (sends WebSocket command)
- Playlist endpoints (TBD)

## WebSocket

- Mounted at `/handshake`
- Receives and sends JSON commands to the microcontroller

## Folder Structure

- `src/` — Main source code
- `prisma/` — Prisma schema
- `mock_songs/` — Place your song files here

---
Replace mock data and endpoints as needed for your use case.
