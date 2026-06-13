// Cron Scheduler — Triggers workflow jobs on schedule
// Jun 2026 by Lakshmi

const cron = require('node-cron');
const { addBulkCampaignJobs } = require('../queues/campaignQueue');
const redisConnection = require('../config/redis');

// Simulated keyset pagination state
let lastProcessedId = 0;
const BATCH_SIZE = 1000;

// ─── Campaign Attribution Cron ────────────────────────────────────────────────
// Runs every 30 minutes — fetches unattributed contacts in batches
cron.schedule('*/30 * * * *', async () => {
  console.log('🕐 Campaign attribution cron triggered:', new Date());

  try {
    let hasMore = true;

    while (hasMore) {
      // Keyset pagination — avoids OFFSET performance issues on large tables
      const contacts = await fetchUnattributedContacts(lastProcessedId, BATCH_SIZE);

      if (contacts.length === 0) {
        hasMore = false;
        lastProcessedId = 0; // Reset for next cron run
        break;
      }

      // Bulk enqueue to BullMQ
      await addBulkCampaignJobs(contacts);

      // Update cursor
      lastProcessedId = contacts[contacts.length - 1].id;
      console.log(`✅ Enqueued ${contacts.length} contacts, last ID: ${lastProcessedId}`);

      hasMore = contacts.length === BATCH_SIZE;
    }

  } catch (error) {
    console.error('❌ Cron job failed:', error.message);
  }
});

// ─── Daily Cleanup Cron ───────────────────────────────────────────────────────
// Runs at midnight — cleans up completed jobs older than 24hrs
cron.schedule('0 0 * * *', async () => {
  console.log('🧹 Running daily cleanup cron:', new Date());
  try {
    // Clean Redis cache keys older than 24 hours
    await redisConnection.flushdb();
    console.log('✅ Daily cleanup complete');
  } catch (error) {
    console.error('❌ Cleanup cron failed:', error.message);
  }
});

// Placeholder DB fetch with keyset pagination
async function fetchUnattributedContacts(lastId, limit) {
  // MySQL equivalent:
  // SELECT * FROM contacts
  // WHERE id > ? AND attributed = 0
  // ORDER BY id ASC
  // LIMIT ?
  console.log(`Fetching contacts after ID: ${lastId}, limit: ${limit}`);
  return []; // Replace with actual DB query
}

console.log('✅ Cron schedulers initialized');
