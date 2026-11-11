import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.APP_URL || "http://localhost:3000";
const OUT = path.join(__dirname, "screenshots");

const CREDENTIALS = [
  { email: "admin@mvgrafix.com", password: "2026mvgrafix@" },
  { email: "admin@mvgraficos.com", password: "2026mvgraficos@" },
  { email: "admin@mvgraficas.com", password: "2026mvgraficas@" },
  { email: "admin@hlsports.local", password: "2026hlsports@" },
];

const routes = [
  { name: "02-dashboard", path: "/" },
  { name: "03-pedidos", path: "/pedidos" },
  { name: "04-pipeline", path: "/pedidos/pipeline" },
  { name: "05-novo-pedido", path: "/pedidos/novo" },
  { name: "06-orcamentos", path: "/orcamentos" },
  { name: "07-vendas", path: "/vendas" },
  { name: "08-financeiro", path: "/financeiro" },
  { name: "09-notas-fiscais", path: "/notas-fiscais" },
  { name: "10-admin", path: "/admin" },
  { name: "11-ia", path: "/ia" },
  { name: "13-cadastros", path: "/cadastros" },
  { name: "14-retrabalho", path: "/pedidos/retrabalho" },
  { name: "15-admin-etapas", path: "/admin/etapas" },
  { name: "16-admin-tags", path: "/admin/tags" },
];

async function settle(page) {
  await page.waitForLoadState("networkidle", { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(900);
}

async function dismissModals(page) {
  const candidates = [
    'button:has-text("Entendi")',
    'button:has-text("não mostrar")',
    'button:has-text("Explorar vendas")',
    '[aria-label="Fechar"]',
    'button:has-text("Fechar")',
  ];
  for (const sel of candidates) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click().catch(() => {});
      await page.waitForTimeout(400);
    }
  }
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(300);
}

async function hideDevChrome(page) {
  await page.addStyleTag({
    content: `
      nextjs-portal, [data-nextjs-toast], #__next-build-watcher,
      [data-next-mark-loading], button[aria-label*="Next.js"] {
        display: none !important;
        visibility: hidden !important;
      }
    `,
  }).catch(() => {});
}

/** Remove client brand (DS Designer / DS IA) from chrome before commercial screenshots. */
async function brandForPresentation(page) {
  await page.evaluate(() => {
    const rewrite = (value) =>
      String(value || "")
        .replace(/DS Designer/gi, "mvGrafix")
        .replace(/DS Design/gi, "mvGrafix")
        .replace(/\bDS IA\b/gi, "MV Graphics IA")
        .replace(/\bA DS IA\b/gi, "A MV Graphics IA");

    document.querySelectorAll('a[aria-label*="DS Designer"], a[aria-label*="DS Design"]').forEach((link) => {
      link.setAttribute("aria-label", "mvGrafix — início");
      const title = link.querySelector("h1");
      if (title) title.textContent = "mvGrafix";
      const subtitle = link.querySelector("p");
      if (subtitle) subtitle.textContent = "Gestão de produção";
      link.querySelectorAll("img").forEach((img) => {
        img.alt = "mvGrafix";
        const wrap = img.closest("div");
        if (wrap) wrap.style.display = "none";
        else img.style.display = "none";
      });
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const next = rewrite(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
    }

    document.querySelectorAll("[aria-label], [title], [alt], [placeholder]").forEach((el) => {
      for (const attr of ["aria-label", "title", "alt", "placeholder"]) {
        if (!el.hasAttribute(attr)) continue;
        const value = el.getAttribute(attr);
        const next = rewrite(value);
        if (next !== value) el.setAttribute(attr, next);
      }
    });

    document.title = rewrite(document.title);
  }).catch(() => {});
}

async function tryLogin(page, email, password) {
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await settle(page);
  await page.locator('input[type="email"], input[name="email"]').first().fill(email);
  await page.locator('input[type="password"], input[name="password"]').first().fill(password);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 20000 }).catch(() => {}),
    page.locator('button[type="submit"]').first().click(),
  ]);
  await settle(page);
  return !page.url().includes("/login");
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
fs.mkdirSync(OUT, { recursive: true });

await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 60000 });
await settle(page);
await hideDevChrome(page);
await brandForPresentation(page);
await page.screenshot({ path: path.join(OUT, "01-login.png"), fullPage: false });
console.log("saved 01-login.png");

let ok = false;
for (const cred of CREDENTIALS) {
  console.log("trying login", cred.email);
  ok = await tryLogin(page, cred.email, cred.password);
  if (ok) break;
}
if (!ok) {
  console.error("LOGIN_FAILED");
  await browser.close();
  process.exit(1);
}

await dismissModals(page);

for (const item of routes) {
  await page.goto(`${BASE}${item.path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await settle(page);
  await dismissModals(page);
  await hideDevChrome(page);
  await brandForPresentation(page);
  await settle(page);
  await page.screenshot({ path: path.join(OUT, `${item.name}.png`), fullPage: false });
  console.log(`saved ${item.name}.png`);
}

await browser.close();
console.log("DONE");
