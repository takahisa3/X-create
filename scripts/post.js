const fs = require('fs');
const path = require('path');
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

const PENDING = 'drafts/pending';
const POSTED = 'posted';

function parseDraft(content) {
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  const selectedMatch = fm && fm[1].match(/selected:\s*(\d+)/);
  const selected = selectedMatch ? parseInt(selectedMatch[1], 10) : 1;
  const sections = content.split(/^##\s*案\s*\d+\s*$/m).slice(1);
  const body = sections[selected - 1]?.trim();
  return { selected, body };
}

async function main() {
  if (!fs.existsSync(PENDING)) {
    console.log('No drafts/pending directory, nothing to post.');
    return;
  }
  const files = fs.readdirSync(PENDING).filter((f) => f.endsWith('.md')).sort();
  if (files.length === 0) {
    console.log('No pending drafts.');
    return;
  }
  fs.mkdirSync(POSTED, { recursive: true });

  for (const file of files) {
    const full = path.join(PENDING, file);
    const content = fs.readFileSync(full, 'utf8');
    const { selected, body } = parseDraft(content);
    if (!body) {
      console.error(`[skip] Could not parse body in ${file}`);
      continue;
    }
    if (body.length > 280) {
      console.error(`[skip] Body too long (${body.length} chars) in ${file}`);
      continue;
    }
    try {
      const res = await client.v2.tweet(body);
      const record = {
        source_file: file,
        selected,
        tweet_id: res.data.id,
        text: body,
        posted_at: new Date().toISOString(),
      };
      const outName = file.replace(/\.md$/, '.json');
      fs.writeFileSync(path.join(POSTED, outName), JSON.stringify(record, null, 2) + '\n');
      fs.unlinkSync(full);
      console.log(`[ok] Posted ${file} -> tweet ${res.data.id}`);
    } catch (e) {
      console.error(`[error] ${file}: ${e.message}`);
      console.error(`  code: ${e.code}`);
      console.error(`  data: ${JSON.stringify(e.data)}`);
      console.error(`  errors: ${JSON.stringify(e.errors)}`);
      console.error(`  rateLimit: ${JSON.stringify(e.rateLimit)}`);
      process.exitCode = 1;
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
