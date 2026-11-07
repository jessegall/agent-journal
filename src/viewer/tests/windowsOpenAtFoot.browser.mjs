import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, worker, agent] = process.argv.slice(2);
const SHOWN_MS = 1500;
const GIVE_UP_MS = 15000;
const FOOT_PIXELS = 2;
const OPENERS = {
    "the terminal": async (page) => {
        await page.goto(`${address}&windows=agents.agents`);
        const card = page.locator(`[data-agent-open="${worker}"]`);
        await card.click();
        await card.locator('[data-tab="terminal"]').click();
        return card.locator(".auto-scroll-pane");
    },
    "the file feed": async (page) => {
        await page.goto(`${address}&windows=coding.file-feed&agent=${agent}`);
        return page.locator('[data-window="coding.file-feed"] .auto-scroll-pane');
    },
};
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const session = await browser.newContext({viewport: {width: 1280, height: 900}});
    for (const [name, open] of Object.entries(OPENERS)) {
        const page = await session.newPage();
        const pane = await open(page);
        await pane.waitFor({timeout: 20000});
        const samples = await pane.evaluate((box, {shownFor, giveUp}) => new Promise((resolve) => {
            const found = [];
            const began = performance.now();
            let shownSince = 0;
            const sample = () => {
                const now = performance.now();
                found.push([Math.round(now - began), box.scrollHeight - Math.round(box.scrollTop) - box.clientHeight, box.scrollHeight, box.clientHeight]);
                if (box.scrollHeight > box.clientHeight && !shownSince) shownSince = now;
                if ((shownSince && now - shownSince > shownFor) || now - began > giveUp) resolve(found);
                else requestAnimationFrame(sample);
            };
            requestAnimationFrame(sample);
        }), {shownFor: SHOWN_MS, giveUp: GIVE_UP_MS});
        console.log(name, JSON.stringify(samples.filter((sample, index) => index === 0 || sample[1] !== samples[index - 1][1])));
        assert.ok(samples.some(([, , height, shown]) => height > shown), `${name} has no more rows than it shows, so it cannot be scrolled`);
        for (const [time, distance, height, shown] of samples.filter(([, , height, shown]) => height > shown)) assert.ok(distance <= FOOT_PIXELS, `${name} was ${distance}px above its foot at ${time}ms`);
        await page.close();
    }
} finally {
    await browser.close();
}
