// Campaign Attribution Queue
// Jun 2026 by Lakshmi

const { Queue } = require('bullmq');
const redisConnection = require('../config/redis');

const campaignQueue = new Queue('campaign-attribution', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

// Add single job
const addCampaignJob = async (data) => {
  await campaignQueue.add('process-campaign', data, {
    priority: data.priority || 1,
  });
  console.log(`✅ Campaign job added: ${data.campaignId}`);
};

// Add bulk jobs — handles 50K+ contacts efficiently
const addBulkCampaignJobs = async (contactBatch) => {
  const jobs = contactBatch.map((contact) => ({
    name: 'process-campaign',
    data: contact,
    opts: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    },
  }));

  await campaignQueue.addBulk(jobs);
  console.log(`✅ Bulk added ${jobs.length} campaign jobs`);
};

module.exports = { campaignQueue, addCampaignJob, addBulkCampaignJobs };
