import dotenv from 'dotenv';
import { buildApp } from './app';

dotenv.config();

const app = buildApp();
const port = parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    const address = await app.listen({ port, host });
    console.log(`\n🍲 KusinaDex Fastify Server running at: ${address}`);
    console.log(`📡 Health check available at: ${address}/health`);
    console.log(`📖 Recipe endpoints available at: ${address}/api/recipes`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
