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
```jsonc
[
  {
    "target_status": "200",
    "url": "http://example.com",

    // Follow redirects, defaulted to false.
    "follow_redirects": true,

    // Basic authentication credentials if required, defaulted to none.
    "basic_auth": {
      "username": "user",
      "password": "password"
    },

    // How often a health check is performed in seconds,
    // adding this overrides frequency in .env.
    "frequency": 120,

    // Adding this overrides the webhook url in .env.
    "discord_webhook_url": "..."
  },
  ...
]
```

## Usage

```bash
node index.js
```
