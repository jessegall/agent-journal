import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
// the build adds a scope suffix to each keyframes name
const SHIMMERS = ["sweep", "shimmer-sweep"];
// a shimmer starts at the next frame after it is drawn, and a switch can hold a frame for 100 ms or more; a restarted shimmer is off
// by anything from 0 to half its length, so ten of them all within the tolerance does not happen by chance
const TOLERANCE_MS = 200;

// every frame, how far each running shimmer is from where the page's clock puts it, and how many there are
function watchShimmers() {
    window.shimmerErrors = [];
    const look = () => {
        for (const animation of document.getAnimations()) {
            if (!SHIMMERS.some((name) => animation.animationName.startsWith(name))) continue;
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
    await page.goto(address);
    await page.locator("[data-sidebar-window]").first().waitFor();
    await page.evaluate(`(() => {const SHIMMERS = ${JSON.stringify(SHIMMERS)}; (${watchShimmers.toString()})();})()`);
    const names = await page.locator("[data-sidebar-window]").evaluateAll((items) => items.slice(0, 2).map((item) => item.dataset.sidebarWindow));
    // pages switch from the sidebar; each click lands at another moment of the sweep
    const pages = [names[0], names[1], names[0], names[1], names[0]];
    for (const [index, name] of pages.entries()) {
        await page.waitForTimeout(437 + index * 211);
        await page.locator(`[data-sidebar-window="${name}"]`).click();
        await page.locator("[aria-busy=true]").first().waitFor({timeout: 2000}).catch(() => {});
        if (index < 3) await page.screenshot({path: `${capture}-${index + 1}.png`});
        await page.waitForTimeout(300);
    }
    const errors = await page.evaluate(() => window.shimmerErrors);
    assert.ok(errors.length > 0, "no shimmer ran while the windows switched");
    assert.ok(Math.max(...errors) < TOLERANCE_MS, `a shimmer was ${Math.max(...errors)} ms from the page's clock over ${errors.length} frames`);
} finally {
    await browser.close();
}
