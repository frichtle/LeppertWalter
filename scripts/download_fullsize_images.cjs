const fs = require('fs');
const path = require('path');
const https = require('https');

const outputDir = path.join(__dirname, '..', 'public', 'impressionen');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read raw data from galleryData.ts
const galleryDataPath = path.join(__dirname, '..', 'src', 'data', 'galleryData.ts');
const fileContent = fs.readFileSync(galleryDataPath, 'utf8');
const match = fileContent.match(/RAW_IMPRESSIONEN:[^=]*=\s*(\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not find RAW_IMPRESSIONEN");
  process.exit(1);
}
const RAW_IMPRESSIONEN = JSON.parse(match[1]);

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      return resolve(true);
    }
    const req = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return resolve(false);
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close(() => resolve(true));
      });
    });
    req.on('error', () => resolve(false));
    req.setTimeout(25000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  console.log(`Starting download of all ${RAW_IMPRESSIONEN.length} original photos in 100% full resolution...`);
  
  const CONCURRENCY = 10;
  let currentIndex = 0;
  let completed = 0;
  let errors = 0;

  async function worker() {
    while (currentIndex < RAW_IMPRESSIONEN.length) {
      const idx = currentIndex++;
      const [imgId, version, ext] = RAW_IMPRESSIONEN[idx];
      const filename = `imp-${idx + 1}.${ext === 'gif' ? 'gif' : 'jpg'}`;
      const dest = path.join(outputDir, filename);
      
      const fullsizeUrl = `https://image.jimcdn.com/app/cms/image/transf/none/path/s320364cb9e655ce0/image/${imgId}/version/${version}/image.${ext}`;
      
      let ok = await downloadFile(fullsizeUrl, dest);
      if (!ok) {
        // Retry once
        ok = await downloadFile(fullsizeUrl, dest);
      }
      
      if (ok) completed++;
      else errors++;

      if (completed % 50 === 0 || completed === RAW_IMPRESSIONEN.length) {
        console.log(`Progress: ${completed}/${RAW_IMPRESSIONEN.length} files saved (${errors} errors)`);
      }
    }
  }

  const workers = Array(CONCURRENCY).fill(null).map(() => worker());
  await Promise.all(workers);

  console.log(`Finished: ${completed}/${RAW_IMPRESSIONEN.length} original photos ready in public/impressionen/`);
}

main().catch(console.error);
