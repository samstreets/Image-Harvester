const express = require('express');
const axios = require('axios');
const archiver = require('archiver');
const path = require('path');
const { URL } = require('url');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/download', async (req, res) => {
  const { urls } = req.body;

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'No URLs provided' });
  }

  const validUrls = urls.filter(url => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  });

  if (validUrls.length === 0) {
    return res.status(400).json({ error: 'No valid URLs provided' });
  }

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="images.zip"');

  const archive = archiver('zip', { zlib: { level: 6 } });
  archive.pipe(res);

  const results = { success: 0, failed: 0 };

  for (let i = 0; i < validUrls.length; i++) {
    const url = validUrls[i];
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ImageHarvester/1.0)',
        },
        maxRedirects: 5,
      });

      const contentType = response.headers['content-type'] || '';
      if (!contentType.startsWith('image/')) {
        results.failed++;
        continue;
      }

      const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg';
      const filename = `image_${String(i + 1).padStart(3, '0')}.${ext}`;
      archive.append(Buffer.from(response.data), { name: filename });
      results.success++;
    } catch {
      results.failed++;
    }
  }

  archive.finalize();
});

app.post('/api/preview', async (req, res) => {
  const { urls } = req.body;
  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'No URLs provided' });
  }

  const results = await Promise.allSettled(
    urls.slice(0, 20).map(async (url) => {
      try {
        new URL(url);
        const response = await axios.head(url, {
          timeout: 5000,
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ImageHarvester/1.0)' },
          maxRedirects: 5,
        });
        const contentType = response.headers['content-type'] || '';
        return {
          url,
          valid: contentType.startsWith('image/'),
          contentType,
        };
      } catch {
        return { url, valid: false, error: true };
      }
    })
  );

  res.json(results.map(r => r.value || r.reason));
});

app.listen(PORT, () => {
  console.log(`Image Harvester running on port ${PORT}`);
});
