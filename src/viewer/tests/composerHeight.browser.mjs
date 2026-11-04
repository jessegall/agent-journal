import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
const lines = (count) => Array.from({length: count}, (_, line) => `line ${line + 1}`).join("\n");
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    const box = page.locator(".composer-input");
    await page.goto(address);
    await box.waitFor();
    const rest = (await box.boundingBox()).height;
    const heightFor = async (count) => {
        await box.fill(lines(count));
        await page.waitForTimeout(260);
        return (await box.boundingBox()).height;
    };
    const lineHeight = await box.evaluate((element) => parseFloat(getComputedStyle(element).lineHeight));
    const one = await heightFor(1);
    assert.ok(Math.abs(one - rest) < 1, `one line keeps the box at rest: ${rest} to ${one}, line ${lineHeight}`);
    assert.ok(Math.abs((await heightFor(2)) - rest) < 1, "two lines keep the box at rest");
    const three = await heightFor(3);
    assert.ok(Math.abs(three - rest - lineHeight) < 2, `the third line adds one line: ${rest} to ${three}`);
    const four = await heightFor(4);
    assert.ok(Math.abs(four - three - lineHeight) < 2, `the fourth line adds one more: ${three} to ${four}`);
    const top = (await box.boundingBox()).y;
    await box.fill(lines(5));
    const frames = await page.evaluate(async () => {
        const element = document.querySelector(".composer-input");
        const seen = [];
        for (let frame = 0; frame < 30; frame += 1) {
            seen.push(element.getBoundingClientRect().height);
            await new Promise(requestAnimationFrame);
        }
        return seen;
    });
    assert.ok(new Set(frames.map(Math.round)).size > 2, `the height moves through frames: ${frames.join(", ")}`);
    assert.ok((await box.boundingBox()).y < top, "the box grows upward");
    assert.ok(Math.abs((await heightFor(1)) - rest) < 1, "taking the lines out brings it back to rest");
} finally {
    await browser.close();
}
