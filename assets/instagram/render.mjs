import { chromium } from "playwright";
import path from "path";
import { pathToFileURL } from "url";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const html = path.join(__dirname, "carousel.html");

const slides = [
  ["s01", "01-capa.png"],
  ["s02", "02-cenario.png"],
  ["s03", "03-modulos.png"],
  ["s04", "04-fluxo.png"],
  ["s05", "05-pipeline.png"],
  ["s06", "06-orcamentos.png"],
  ["s07", "07-diferenciais.png"],
  ["s08", "08-alertas-email.png"],
  ["s09", "09-ia.png"],
  ["s10", "10-cta.png"],
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1200, height: 1600 },
  deviceScaleFactor: 2,
});

await page.goto(pathToFileURL(html).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);

for (const [id, file] of slides) {
  const out = path.join(__dirname, file);
  await page.locator(`#${id}`).screenshot({ path: out, type: "png" });
  console.log("OK", file);
}

await browser.close();
console.log("Carousel pronto em assets/instagram/");
