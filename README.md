# Sound Server

Backend service for the IOT Sound Player (YPPMS).

## Tech Stack

- Node.js
- Express.js
- WebSocket
- PostgreSQL (Prisma ORM)
- Docker & Docker Compose

## Local Development

1. Copy `.env-example` to `.env` and adjust as needed
2. Add sound files to `/mock_sounds` for demo / testing
3. Install dependencies:

   ```bash
   npm install
   ```

4. Run database migrations:

   ```bash
   npm run migrate:dev
   ```

5. Start the development server:

   ```bash
   npm run start:dev
   ```

6. The app will be available at `http://localhost:<APP_PORT>`

## Features

- Automatic sound file discovery: add files to `/mock_sounds` and they're added to the database
- WebSocket streaming available on `/play`
- Simple secret-based authentication
- Out-of-the-box Docker Compose support on release package

## API Collection

- Postman workspace: [https://www.postman.com/yppms/sound-server](https://www.postman.com/yppms/sound-server)
