# BullMQ Workflow Engine

An event-driven workflow automation engine built with **BullMQ**, **Redis**, and **Node.js** — designed for reliable, scalable background job processing.

## 🚀 Features

- **Queue-based job processing** using BullMQ
- **Cron-triggered workflows** for scheduled tasks
- **Redis-backed** job persistence and caching
- **Retry mechanism** with exponential backoff
- **Concurrency control** for parallel job execution
- **Dead letter queue** for failed job handling

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Queue | BullMQ |
| Cache/Store | Redis |
| Scheduler | node-cron |
| Language | JavaScript (ES6+) |

## 📁 Project Structure

## ⚙️ How It Works

Cron Trigger / API Call

↓

BullMQ Queue

↓

Worker picks job

↓

Process (DB update / API call / notification)

↓

Success → Mark complete

Failure → Retry with backoff → Dead letter queue

## 📦 Installation

```bash
git clone https://github.com/LakshmiRamala/bullmq-workflow-engine.git
cd bullmq-workflow-engine
npm install
```

## 🔧 Environment Setup

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
```

## 🏃 Running the Engine

```bash
# Start Redis (Docker)
docker run -d -p 6379:6379 redis

# Start the workflow engine
node src/index.js
```

## 💡 Key Concepts Used

**Keyset Pagination** — Used for processing large contact batches (50K+) without offset performance degradation.

**addBulk()** — BullMQ's bulk job insertion for efficient batch processing.

**Concurrency Control** — Worker concurrency set based on system capacity to avoid overload.

**Redis Caching** — Frequently accessed data cached in Redis, reducing DB load by ~35%.

## 📊 Performance

- Processes **50,000+ contact records** per batch
- Redis caching reduces database queries by **~35%**
- Failed jobs automatically retry with exponential backoff
- Zero job loss with Redis persistence

## 👩‍💻 Author

**Naga Lakshmi Ramala** — [LinkedIn](https://linkedin.com/in/lakshmi-ramala) | [GitHub](https://github.com/LakshmiRamala)
