import assert from "node:assert/strict";
import {mkdir, writeFile} from "node:fs/promises";
import {chromium} from "playwright-core";

const [address, agent, capture] = process.argv.slice(2);
const recordings = [];
await mkdir(capture, {recursive: true});
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1000, height: 900}});
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const width of [1000, 390]) {
        await page.setViewportSize({width, height: 900});
        await page.goto(`${address}&windows=agents.agents`);
        const card = page.locator(`[data-agent-open="${agent}"]`);
        await card.waitFor();
        await card.scrollIntoViewIfNeeded();
        await page.waitForTimeout(100);
        const origin = await card.locator("[data-agent-title]").boundingBox();
        for (const direction of ["open", "close"]) {
            await card.evaluate((element) => {
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
            recordings.push({width, direction, frames});
        }
        const returned = await card.locator("[data-agent-title]").boundingBox();
        assert.ok(Math.abs(origin.y - returned.y) < 1, "Closing must return the card to its starting position");
    }
    for (const {width, direction, frames} of recordings) {
        const label = `${width}px ${direction}`;
        assert.ok(frames.every((frame) => frame.same), `${label}: the selected card was replaced`);
        const distance = frames.at(-1).y - frames[0].y;
        assert.ok(Math.abs(distance) > 100, `${label}: select a card below the first row`);
        const progress = frames.map((frame) => (frame.y - frames[0].y) / distance);
        assert.ok(progress.filter((value) => value > 0.01 && value < 0.99).length >= 5, `${label}: movement must span several frames`);
        for (let index = 1; index < frames.length; index++) {
            const step = progress[index] - progress[index - 1];
            const elapsed = frames[index].time - frames[index - 1].time;
            assert.ok(step > -0.01 && step < 0.04 + elapsed * 0.009, `${label}: jump at frame ${index}: ${step} over ${elapsed}ms`);
        }
    }
    await page.emulateMedia({reducedMotion: "reduce"});
    await page.locator(`[data-agent-open="${agent}"]`).click();
    const animations = await page.locator(".agents").evaluate((element) => element.getAnimations({subtree: true}).filter((animation) => animation.playState === "running").length);
    assert.equal(animations, 0, "Reduced motion must open without animation");
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
