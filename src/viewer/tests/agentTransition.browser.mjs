import assert from "node:assert/strict";
import {mkdir, writeFile} from "node:fs/promises";
import {chromium} from "playwright-core";

const [address, agent, capture] = process.argv.slice(2);
await mkdir(capture, {recursive: true});
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1000, height: 900}});
    for (const width of [1000, 390]) {
        await page.setViewportSize({width, height: 900});
        await page.goto(`${address}&windows=agents.agents`);
        const card = page.locator(`[data-agent-open="${agent}"]`);
        await card.waitFor();
        await card.scrollIntoViewIfNeeded();
        await page.waitForTimeout(100);
        for (const direction of ["open", "close"]) {
            await card.evaluate((element) => {
                window.recordedCard = element;
                window.cardFrames = [];
                const start = performance.now();
                const record = () => {
                    const current = document.querySelector(`[data-agent-open="${element.dataset.agentOpen}"]`);
                    const title = current?.querySelector("[data-agent-title]");
                    const box = title?.getBoundingClientRect();
                    window.cardFrames.push({time: performance.now() - start, same: current === element, x: box?.x, y: box?.y, opacity: current ? getComputedStyle(current).opacity : "0"});
                    if (performance.now() - start < 700) requestAnimationFrame(record);
                };
                record();
                if (element.classList.contains("open")) element.querySelector(".agent-back").click();
                else element.click();
            });
            for (let frame = 0; frame < 14; frame++) {
                await page.screenshot({path: `${capture}/${width}-${direction}-${String(frame).padStart(2, "0")}.png`});
                await page.waitForTimeout(20);
            }
            await page.waitForTimeout(100);
            const frames = await page.evaluate(() => window.cardFrames);
            await writeFile(`${capture}/${width}-${direction}.json`, JSON.stringify(frames, null, 2));
        }
    }
    const frames = await page.evaluate(() => window.cardFrames);
    assert.ok(frames.every((frame) => frame.same), "The selected card was replaced during the transition");
} finally {
    await browser.close();
}
