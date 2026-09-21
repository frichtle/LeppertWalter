const fs = require('fs');
const path = require('path');
const https = require('https');

// Read galleryData.ts to extract RAW_IMPRESSIONEN
const galleryDataPath = path.join(__dirname, '..', 'src', 'data', 'galleryData.ts');
const fileContent = fs.readFileSync(galleryDataPath, 'utf8');

const match = fileContent.match(/const RAW_IMPRESSIONEN:[^=]*=\s*(\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not find RAW_IMPRESSIONEN in galleryData.ts");
  process.exit(1);
}

const RAW_IMPRESSIONEN = JSON.parse(match[1]);
console.log(`Found ${RAW_IMPRESSIONEN.length} images to download.`);

const outputDir = path.join(__dirname, '..', 'public', 'impressionen');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(imgId, version, ext, index) {
  return new Promise((resolve) => {
    const filename = `imp-${index + 1}.${ext === 'gif' ? 'gif' : 'jpg'}`;
    const dest = path.join(outputDir, filename);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      return resolve({ index, success: true, cached: true });
    }

    const url = ext === 'gif'
      ? `https://image.jimcdn.com/app/cms/image/transf/none/path/s320364cb9e655ce0/image/${imgId}/version/${version}/image.gif`
      : `https://image.jimcdn.com/app/cms/image/transf/dimension=1200x1200:format=jpg/path/s320364cb9e655ce0/image/${imgId}/version/${version}/image.${ext}`;

    const request = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Failed ${filename}: status ${res.statusCode}`);
        return resolve({ index, success: false });
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve({ index, success: true }));
      });
    });

    request.on('error', (err) => {
      console.error(`Error downloading ${filename}:`, err.message);
      resolve({ index, success: false });
    });

    request.setTimeout(15000, () => {
      request.destroy();
      resolve({ index, success: false });
    });
  });
}

async function run() {
  const CONCURRENCY = 8;
  let currentIndex = 0;
  let completed = 0;
  let errors = 0;

  async function worker() {
    while (currentIndex < RAW_IMPRESSIONEN.length) {
      const idx = currentIndex++;
      const [imgId, version, ext] = RAW_IMPRESSIONEN[idx];
      const result = await downloadImage(imgId, version, ext, idx);
      if (result.success) {
        completed++;
      } else {
        errors++;
      }
      if (completed % 50 === 0 || completed === RAW_IMPRESSIONEN.length) {
        console.log(`Progress: ${completed}/${RAW_IMPRESSIONEN.length} downloaded (${errors} errors)`);
      }
    }
  }

  const workers = Array(CONCURRENCY).fill(null).map(() => worker());
  await Promise.all(workers);

  console.log(`\nDownload completed: ${completed}/${RAW_IMPRESSIONEN.length} images saved in /public/impressionen/`);
}

run();
