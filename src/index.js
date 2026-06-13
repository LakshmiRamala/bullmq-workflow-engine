// BullMQ Workflow Engine — Entry Point
// Jun 2026 by Lakshmi

require('dotenv').config();

const { campaignQueue } = require('./queues/campaignQueue');
const campaignWorker = require('./workers/campaignWorker');
require('./schedulers/cronScheduler');

console.log('🚀 BullMQ Workflow Engine started');
console.log('📋 Active queues:', ['campaign-attribution']);
console.log('⏰ Cron schedulers: running');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down gracefully...');
  await campaignWorker.close();
  await campaignQueue.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  await campaignWorker.close();
  await campaignQueue.close();
  process.exit(0);
});
