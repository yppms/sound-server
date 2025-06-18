// Core and third-party imports
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { Buffer } from 'buffer';

// App-specific imports
import router from './routers.js';
import { handleStream } from './controllers/streamController.js';
import { seedData, soundsWatcher } from './services/seedService.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { wsAuthMiddleware } from './middleware/authMiddleware.js';
import { startSoundScheduler } from './services/scheduleService.js';

// Config
const APP_PORT = process.env.APP_PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Express app setup
const app = express();
app.use(express.json());
app.use(router);
app.use(errorMiddleware);

// HTTP and WebSocket server setup
const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

// WebSocket upgrade handler with endpoint and auth check
server.on('upgrade', (req, socket, head) => {
  if (req.url !== '/play') {
    socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
    socket.destroy();
    return;

  }
  if (!wsAuthMiddleware(req)) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, ws => {
    handleStream(ws);
  });

});

// Start server function
const startServer = () => {
  startSoundScheduler(); // Start the sound scheduler
  server.listen(APP_PORT, () => {
    console.info(`Server running on http://localhost:${APP_PORT}`);
  });
};

// Seed data and watch songs in development, just start in production
if (NODE_ENV === 'development') {
  seedData().then(() => {
    soundsWatcher();
    startServer();
  });
} else {
  startServer();
}