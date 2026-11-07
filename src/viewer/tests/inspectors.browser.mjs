import assert from "node:assert/strict";
import {mkdirSync} from "node:fs";
import {join} from "node:path";
import {chromium} from "playwright-core";

// opens each seeded row in the shared inspector and checks its head, actions and width at three viewport widths, light and dark
const [address, shots] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
const login = await browser.newContext();
mkdirSync(shots, {recursive: true});

const WIDTHS = new Set([480, 640, 960, 1130]);
const FORBIDDEN = /^(close|open|hide|dismiss|back)\b/i;
const ROWS = [
    {name: "task", ref: "tasks:1", shareable: false, required: true},
    {name: "plan", ref: "plans:1", shareable: true, required: true},
    {name: "document", ref: "docs:1", shareable: true, required: true},
    {name: "report", ref: "reports:1", shareable: true, required: false},
    {name: "question", ref: "questions:1", shareable: false, required: true},
    {name: "memory", ref: "memories:1", shareable: false, required: true},
    {name: "agent", ref: "agents:1", shareable: false, required: false},
    {name: "test queue", ref: "test-queues:1", shareable: false, required: false},
];
const found = [];
const missed = [];

async function open(page, ref) {
    await page.evaluate((value) => { location.hash = `#?open=${value}`; }, ref);
    const opened = await page.locator("[data-inspector]").first().waitFor({timeout: 8000}).then(() => true, () => false);
    if (!opened) return null;
    await page.locator("[data-resource-panel]:not(.opening)").waitFor({timeout: 8000}).catch(() => null);
    await page.locator("[data-resource-panel]").evaluate((element) => Promise.all(element.getAnimations({subtree: true}).map((animation) => animation.finished.catch(() => null))));
    return page.locator("[data-inspector]").first();
}

async function facts(panel) {
    return panel.evaluate((element) => {
        const head = element.querySelector("[data-inspector-head]");
        const buttons = [...element.querySelectorAll("[data-button]")].map((button) => ({name: button.dataset.button, text: button.textContent.trim(), icon: Boolean(button.querySelector("svg"))}));
        const links = element.querySelector("[data-inspector-links]");
        return {
            title: element.querySelector("[data-resource-title]")?.textContent.trim() ?? "",
            headText: head?.textContent.trim().replace(/\s+/g, " ") ?? "",
            close: Boolean(element.querySelector("[data-resource-close]")),
            share: Boolean(element.querySelector("[data-resource-share]")),
            back: Boolean(element.querySelector("[data-resource-back]")),
            buttons,
            links: links ? {count: links.querySelector("[data-inspector-links-count]")?.textContent.trim() ?? "", unfolded: links.querySelector("[data-inspector-links-head]")?.getAttribute("aria-expanded") === "true"} : null,
            width: Math.round(element.closest("[data-resource-panel]")?.getBoundingClientRect().width ?? element.getBoundingClientRect().width),
        };
    });
}

async function check(width, height, scheme) {
    const page = await login.newPage();
    await page.setViewportSize({width, height});
    await page.emulateMedia({colorScheme: scheme});
    const link = new URL(address);
    link.searchParams.set("page", "tasks.tasks");
    await page.goto(link.href);
    for (const row of ROWS) {
        const panel = await open(page, row.ref);
        if (!panel) {
            assert.ok(!row.required, `${row.name} did not open at ${width} (${scheme})`);
            missed.push(`${row.name} at ${width} ${scheme}`);
            continue;
        }
        const titled = await panel.locator("[data-resource-title]:not(:empty)").first().waitFor({timeout: 5000}).then(() => true, () => false);
        if (!titled && !row.required) {
            missed.push(`${row.name} has no title at ${width} ${scheme}`);
            continue;
        }
        const seen = await facts(panel);
        assert.ok(seen.title, `${row.name} has no title at ${width}`);
        assert.ok(seen.close, `${row.name} has no X at ${width}`);
        assert.equal(seen.share, row.shareable, `${row.name} share icon at ${width}`);
        assert.ok(WIDTHS.has(seen.width) || seen.width === width, `${row.name} is ${seen.width}px wide at ${width}`);
        for (const button of seen.buttons) {
            assert.ok(button.text, `${row.name} has a button without words: ${button.name}`);
            assert.ok(!FORBIDDEN.test(button.text), `${row.name} has a button called ${button.text}`);
            assert.ok(button.icon, `${row.name} button ${button.text} has no icon`);
        }
        if (seen.links) assert.ok(seen.links.count !== "", `${row.name} links have no count`);
        found.push({row: row.name, width, scheme, title: seen.title, panelWidth: seen.width, buttons: seen.buttons.map((button) => button.text), share: seen.share, links: seen.links});
        if (scheme === "light" && (width === 1440 || row.name === "task")) await page.screenshot({path: join(shots, `${row.name.replace(" ", "-")}-${width}.png`)});
        await page.evaluate(() => { location.hash = "#"; });
        await page.locator("[data-inspector]").first().waitFor({state: "detached", timeout: 5000}).catch(() => null);
    }
    await page.close();
}

try {
    await check(1440, 900, "light");
    await check(1440, 900, "dark");
    await check(1000, 800, "light");
    await check(390, 800, "light");
    console.log(JSON.stringify({found, missed, shots}, null, 1));
} finally {
    await browser.close();
}
