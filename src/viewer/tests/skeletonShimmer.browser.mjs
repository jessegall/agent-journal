import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const SHIMMERS = ["sweep", "skeleton-shimmer"];
// a shimmer may start a frame or two after the page's clock reads its length; a restart is off by half a length on average
const TOLERANCE_MS = 120;

// every frame, how far each running shimmer is from where the page's clock puts it, and how many there are
function watchShimmers() {
    window.shimmerErrors = [];
    const look = () => {
        for (const animation of document.getAnimations()) {
            if (!SHIMMERS.includes(animation.animationName)) continue;
            const {duration, progress} = animation.effect.getComputedTiming();
            const difference = Math.abs((progress * duration) - (document.timeline.currentTime % duration));
            window.shimmerErrors.push(Math.min(difference, duration - difference));
        }
        requestAnimationFrame(look);
    };
    look();
}

const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 720}});
    page.on("pageerror", (error) => console.log("PAGEERROR", error.message));
    page.on("console", (message) => console.log("CONSOLE", message.text()));
    page.on("requestfailed", (request) => console.log("FAILED", request.url()));
    page.on("response", (response) => response.status() >= 400 && console.log("STATUS", response.status(), response.url()));
    await page.goto(address);
    await page.waitForTimeout(3000);
    await page.screenshot({path: `${capture}-debug.png`});
    await page.locator("[data-sidebar-window]").first().waitFor({timeout: 3000});
    await page.evaluate(`(() => {const SHIMMERS = ${JSON.stringify(SHIMMERS)}; (${watchShimmers.toString()})();})()`);
    const windows = ["tasks.tasks", "documents.documents", "tasks.tasks", "documents.documents"];
    for (const [index, name] of windows.entries()) {
        await page.waitForTimeout(437 + index * 211);
        await page.locator(`[data-sidebar-window="${name}"]`).click();
        await page.locator("[aria-busy=true]").first().waitFor({timeout: 2000}).catch(() => {});
        if (index < 2) await page.screenshot({path: `${capture}-${index + 1}.png`});
        await page.waitForTimeout(300);
    }
    const errors = await page.evaluate(() => window.shimmerErrors);
    assert.ok(errors.length > 0, "no shimmer ran while the windows switched");
    assert.ok(Math.max(...errors) < TOLERANCE_MS, `a shimmer was ${Math.max(...errors)} ms from the page's clock over ${errors.length} frames`);
} finally {
    await browser.close();
}
