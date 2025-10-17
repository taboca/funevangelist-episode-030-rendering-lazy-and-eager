// grid-server.mjs
import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

// Chunking config
const CHUNK_SIZE_BYTES = 1024 * 4; // 4 KB per chunk
const MIN_TOTAL_MS = 500;        // 1s
const MAX_TOTAL_MS = 5000;       // 15s

// Serve the static HTML files (lazy.html / eager.html) and input.png file
app.use(express.static("."));


app.get("/slow/:file", (req, res) => {
  const file = req.params.file;
  const filePath = path.resolve("images", file); // ✅ now looks inside ./images/

  if (!fs.existsSync(filePath)) {
    res.status(404).send(`${file} not found`);
    return;
  }

  // --- everything else stays the same ---
  const totalMs =
    Math.floor(Math.random() * (MAX_TOTAL_MS - MIN_TOTAL_MS + 1)) + MIN_TOTAL_MS;

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "no-store");

  const stats = fs.statSync(filePath);
  const approxChunks = Math.max(1, Math.ceil(stats.size / CHUNK_SIZE_BYTES));
  const baseInterval = Math.max(1, Math.floor(totalMs / approxChunks));

  const stream = fs.createReadStream(filePath, { highWaterMark: CHUNK_SIZE_BYTES });
  let timer = null;

  stream.on("data", (chunk) => {
    stream.pause();
    const jitter = 0.8 + Math.random() * 0.4;
    const gap = Math.max(1, Math.floor(baseInterval * jitter));
    res.write(chunk, () => {
      timer = setTimeout(() => stream.resume(), gap);
    });
  });

  stream.on("end", () => {
    if (timer) clearTimeout(timer);
    res.end();
  });

  stream.on("error", () => {
    if (timer) clearTimeout(timer);
    res.status(500).end("stream error");
  });

  req.on("close", () => {
    if (timer) clearTimeout(timer);
    stream.destroy();
  });
});

// Static endpoints for each case
app.get("/grid/lazy", (_, res) => res.sendFile(path.resolve("lazy.html")));
app.get("/grid/eager", (_, res) => res.sendFile(path.resolve("eager.html")));

app.listen(PORT, () => {
  console.log("\n📸 Lazy-loading demo with random per-image durations");
  console.log("→ http://localhost:3000/grid/lazy");
  console.log("→ http://localhost:3000/grid/eager\n");
});
