const fs = require('fs');
const path = require('path');
const https = require('https');

const outputDir = path.join(__dirname, '..', 'public', 'impressionen');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function fetchPage() {
  return new Promise((resolve, reject) => {
    https.get('https://www.levents.eu/impressionen/', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = [...data.matchAll(/data-href="([^"]+)"/g)].map(m => m[1]);
        resolve(matches);
      });
    }).on('error', reject);
  });
}

function downloadOne(url, index, total) {
  return new Promise((resolve) => {
    // determine ext from url
    let ext = 'jpg';
    if (url.endsWith('.gif')) ext = 'gif';
    else if (url.endsWith('.png')) ext = 'png';
    else if (url.endsWith('.jpg') || url.endsWith('.jpeg')) ext = 'jpg';

    const filename = `imp-${index + 1}.${ext === 'gif' ? 'gif' : 'jpg'}`;
    const dest = path.join(outputDir, filename);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      return resolve({ index, success: true, cached: true });
    }

    const req = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.error(`[${index + 1}/${total}] HTTP ${res.statusCode} for ${url}`);
        return resolve({ index, success: false });
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close(() => resolve({ index, success: true }));
      });
    });

    req.on('error', (err) => {
      console.error(`[${index + 1}/${total}] Err: ${err.message}`);
      resolve({ index, success: false });
    });

    req.setTimeout(25000, () => {
      req.destroy();
      resolve({ index, success: false });
    });
  });
}

async function main() {
  console.log('Fetching live Jimdo impressionen page to extract exact 527 fullsize links...');
  const urls = await fetchPage();
  console.log(`Found ${urls.length} fullsize images.`);

  const CONCURRENCY = 12;
  let currentIndex = 0;
  let completed = 0;
  let errors = 0;

  async function worker() {
    while (currentIndex < urls.length) {
      const idx = currentIndex++;
      const url = urls[idx];
      const res = await downloadOne(url, idx, urls.length);
      if (res.success) completed++;
      else errors++;
      if (completed % 25 === 0 || completed === urls.length) {
        console.log(`Progress: ${completed}/${urls.length} fullsize images downloaded (${errors} errors)`);
      }
    }
  }

  const workers = Array(CONCURRENCY).fill(null).map(() => worker());
  await Promise.all(workers);

  console.log(`\nAll done! Downloaded ${completed}/${urls.length} fullsize images to public/impressionen/`);
}

main().catch(console.error);
