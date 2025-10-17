// renderer.mjs
import puppeteer from "puppeteer";

async function main() {
  const urlLazy  = "http://localhost:3000/grid/lazy";
  const urlEager = "http://localhost:3000/grid/eager";

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    console.log("\n🧩 Evangelism render demo\n");

    // --- Lazy case ---
    console.log("🌐 Opening (lazy):", urlLazy);
    const pageLazy = await browser.newPage();
    await pageLazy.setViewport({ width: 1200, height: 700 });
    console.time("lazy");
    await pageLazy.goto(urlLazy, { waitUntil: "load",   timeout: 120_000  });
    console.timeEnd("lazy");
    await pageLazy.screenshot({ path: "lazy.png", fullPage: true });
    console.log("📷 lazy.png saved\n");

    // --- Eager case ---
    console.log("🌐 Opening (eager):", urlEager);
    const pageEager = await browser.newPage();
    await pageEager.setViewport({ width: 1200, height: 700 });
    console.time("eager");
    await pageEager.goto(urlEager, { waitUntil: "load",   timeout: 120_000  });
    console.timeEnd("eager");
    await pageEager.screenshot({ path: "eager.png", fullPage: true });
    console.log("📷 eager.png saved\n");

    console.log("✅ Done! Compare lazy.png and eager.png.\n");
  } finally {
    await browser.close();
  }
}

await main();
