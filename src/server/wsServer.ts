import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';
import { appRouter } from './appRouter';
import { createContextInner } from '../server/context';

console.log('HIT HERE');

const wss = new ws.Server({
  port: 3001,
});

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: createContextInner,
});

wss.on('connection', (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once('close', () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});
console.log('✅ WebSocket Server listening on ws://localhost:3001');
process.on('SIGTERM', () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
});
