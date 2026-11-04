import assert from "node:assert/strict";
import {mkdir, writeFile} from "node:fs/promises";
import {chromium} from "playwright-core";

const [address, agent, capture] = process.argv.slice(2);
const recordings = [];
await mkdir(capture, {recursive: true});
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1000, height: 900}});
    const session = await page.context().newCDPSession(page);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const width of [1000, 390]) {
        await page.setViewportSize({width, height: 900});
        await page.goto(`${address}&windows=agents.agents`);
        const card = page.locator(`[data-agent-open="${agent}"]`);
        await card.waitFor();
        await card.scrollIntoViewIfNeeded();
        await page.waitForTimeout(350);
        const origin = await card.locator("[data-agent-title]").boundingBox();
        for (const direction of ["open", "close"]) {
            await page.screenshot({path: `${capture}/${width}-${direction}-start.png`});
            await card.evaluate((element) => {
                window.cardFrames = [];
                const start = document.timeline.currentTime;
                window.cardRecordingStart = start;
                const record = () => {
                    const current = document.querySelector(`[data-agent-open="${element.dataset.agentOpen}"]`);
                    const title = current?.querySelector("[data-agent-title]");
                    const box = title?.getBoundingClientRect();
                    let opacity = title ? 1 : 0;
                    for (let parent = title; parent; parent = parent.parentElement) opacity *= Number(getComputedStyle(parent).opacity);
                    window.cardFrames.push({time: document.timeline.currentTime - start, same: current === element, x: box?.x, y: box?.y, opacity});
                    if (document.timeline.currentTime - start < 700) requestAnimationFrame(record);
                };
                record();
                if (element.classList.contains("open")) element.querySelector(".agent-back").click();
                else element.click();
            });
            const pictures = [];
            for (let frame = 0; frame < 20; frame++) {
                const time = await page.evaluate(() => document.timeline.currentTime - window.cardRecordingStart);
                const {data} = await session.send("Page.captureScreenshot", {format: "png"});
                const name = `${width}-${direction}-${String(frame).padStart(2, "0")}.png`;
                await writeFile(`${capture}/${name}`, Buffer.from(data, "base64"));
                pictures.push({time, name});
                await page.waitForTimeout(10);
            }
            await page.waitForTimeout(100);
            const frames = await page.evaluate(() => window.cardFrames);
            await writeFile(`${capture}/${width}-${direction}.json`, JSON.stringify(frames, null, 2));
            await writeFile(`${capture}/${width}-${direction}-pictures.json`, JSON.stringify(pictures, null, 2));
            recordings.push({width, direction, frames});
        }
        const returned = await card.locator("[data-agent-title]").boundingBox();
        assert.ok(Math.abs(origin.y - returned.y) < 1, "Closing must return the card to its starting position");
    }
    for (const {width, direction, frames} of recordings) {
        const label = `${width}px ${direction}`;
        assert.ok(frames.every((frame) => frame.same), `${label}: the selected card was replaced`);
        if (direction === "open") {
            assert.ok(frames.filter((frame) => frame.time < 100).every((frame) => Math.abs(frame.y - frames[0].y) < 1), `${label}: the selected row must stay still while the others fade`);
            assert.ok(frames.every((frame) => frame.opacity > 0.99), `${label}: the selected row must remain visible`);
        }
        const distance = frames.at(-1).y - frames[0].y;
        const moving = direction === "open" ? frames : frames.filter((frame) => frame.time > 120 && frame.y > frames.at(-1).y - 13);
        const travel = direction === "open" ? distance : 12;
        assert.ok(Math.abs(travel) >= 12, `${label}: the selected card must move`);
        const progress = moving.map((frame) => (frame.y - moving[0].y) / travel);
        assert.ok(progress.filter((value) => value > 0.01 && value < 0.99).length >= 5, `${label}: movement must span several frames`);
        for (let index = 1; index < moving.length; index++) {
            const step = progress[index] - progress[index - 1];
            const elapsed = moving[index].time - moving[index - 1].time;
            assert.ok(step > -0.01 && step < 0.06 + Math.max(16, elapsed) * 0.018, `${label}: jump at frame ${index}: ${step} over ${elapsed}ms`);
        }
    }
    await page.emulateMedia({reducedMotion: "reduce"});
    await page.locator(`[data-agent-open="${agent}"]`).click();
    const animations = await page.locator(".agents").evaluate((element) => element.getAnimations({subtree: true}).filter((animation) => animation.constructor.name === "Animation" && animation.playState === "running").length);
    assert.equal(animations, 0, "Reduced motion must open without animation");
    await page.keyboard.press("Escape");
    await page.waitForFunction((agent) => document.querySelector(`[data-agent-open="${agent}"]`)?.getAttribute("aria-expanded") === "false", agent);
    await page.emulateMedia({reducedMotion: "no-preference"});
    await page.setViewportSize({width: 1000, height: 550});
    await page.locator(".agents-view").evaluate((element) => { element.scrollTop = 200; });
    const scrolled = await page.locator(`[data-agent-open="${agent}"] [data-agent-title]`).boundingBox();
    await page.locator(`[data-agent-open="${agent}"]`).press("Enter");
    await page.locator("[data-agents-held]").waitFor();
    await page.locator(".agents").evaluate((element) => Promise.all(element.getAnimations({subtree: true}).map((animation) => animation.finished)));
    await page.locator("[data-agents-held]").click();
    await page.waitForFunction((agent) => document.querySelector(`[data-agent-open="${agent}"]`)?.getAttribute("aria-expanded") === "false", agent);
    await page.locator(".agents").evaluate((element) => Promise.all(element.getAnimations({subtree: true}).map((animation) => animation.finished)));
    const restored = await page.locator(`[data-agent-open="${agent}"] [data-agent-title]`).boundingBox();
    assert.ok(Math.abs(scrolled.y - restored.y) < 1, "Closing must restore the scrolled list position");
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
