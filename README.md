# health-checker

Monitors the health of URLs periodically by checking HTTP statuses and pushing notifications through Discord.

## Setup
Requirements: [cURL](https://curl.se/), [Node.js](https://nodejs.org/en/), and [Redis](https://redis.io/)

```bash
npm i

cp .env.example .env

touch jobs.json
```

Configure `.env` and `jobs.json`.

`jobs.example.json`
```json
[
  {
    "target_status": "200",
    "url": "http://example.com",
    "discord_webhook_url": "..." // Adding this overrides the webhook url in .env
  },
  ...
]
```

## Usage

```bash
node queue.js
```
