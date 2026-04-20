const fs = require('fs');
const path = require('path');
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

const POSTED = 'posted';
const ANALYTICS = 'analytics';
const WINDOW_DAYS = 7;

async function main() {
  if (!fs.existsSync(POSTED)) {
    console.log('No posted directory, nothing to fetch.');
    return;
  }
  fs.mkdirSync(ANALYTICS, { recursive: true });

  const files = fs.readdirSync(POSTED).filter((f) => f.endsWith('.json'));
  const cutoff = Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000;

  for (const file of files) {
    const record = JSON.parse(fs.readFileSync(path.join(POSTED, file), 'utf8'));
    if (new Date(record.posted_at).getTime() < cutoff) continue;

    try {
      const res = await client.v2.singleTweet(record.tweet_id, {
        'tweet.fields': 'public_metrics,created_at',
      });
      const out = {
        tweet_id: record.tweet_id,
        text: record.text,
        posted_at: record.posted_at,
        fetched_at: new Date().toISOString(),
        metrics: res.data?.public_metrics || null,
      };
      fs.writeFileSync(path.join(ANALYTICS, file), JSON.stringify(out, null, 2) + '\n');
      console.log(`[ok] Fetched ${record.tweet_id}`);
    } catch (e) {
      console.error(`[error] ${record.tweet_id}: ${e.message}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
