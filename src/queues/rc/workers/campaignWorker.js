// Campaign Attribution Worker
// Jun 2026 by Lakshmi

const { Worker } = require('bullmq');
const redisConnection = require('../config/redis');

const campaignWorker = new Worker(
  'campaign-attribution',
  async (job) => {
    const { campaignId, contactId, utmSource, utmMedium } = job.data;

    console.log(`🔄 Processing campaign job: ${job.id}`);

    try {
      // Step 1: Fetch contact from DB (keyset pagination based)
      const contact = await getContactById(contactId);
      if (!contact) {
        throw new Error(`Contact not found: ${contactId}`);
      }

      // Step 2: Attribute campaign to contact
      await attributeCampaign({
        contactId,
        campaignId,
        utmSource,
        utmMedium,
        attributedAt: new Date(),
      });

      // Step 3: Update CRM status
      await updateCRMStatus(contactId, 'attributed');

      console.log(`✅ Campaign attributed: ${campaignId} → ${contactId}`);
      return { success: true, contactId, campaignId };

    } catch (error) {
      console.error(`❌ Job failed: ${job.id}`, error.message);
      throw error; // BullMQ will retry automatically
    }
  },
  {
    connection: redisConnection,
    concurrency: 10, // Process 10 jobs in parallel
  }
);

// Worker event listeners
campaignWorker.on('completed', (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

campaignWorker.on('failed', (job, err) => {
  console.error(`❌ Job failed: ${job.id} — ${err.message}`);
});

campaignWorker.on('stalled', (jobId) => {
  console.warn(`⚠️ Job stalled: ${jobId}`);
});

// Placeholder DB functions
async function getContactById(contactId) {
  // MySQL query with keyset pagination
  return { id: contactId, name: 'Sample Contact' };
}

async function attributeCampaign(data) {
  // Insert into campaign_attribution table
  console.log('Attributing campaign:', data);
}

async function updateCRMStatus(contactId, status) {
  // Update CRM record
  console.log(`CRM updated: ${contactId} → ${status}`);
}

module.exports = campaignWorker;
