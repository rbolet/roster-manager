import { createApp } from './app.js';
import { env } from './config/env.js';

/**
 * Start the Fastify server
 */
async function start(): Promise<void> {
  try {
    const app = await createApp();

    await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    console.log(`🚀 Server listening at http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\\n👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\\n👋 Shutting down gracefully...');
  process.exit(0);
});

start();
