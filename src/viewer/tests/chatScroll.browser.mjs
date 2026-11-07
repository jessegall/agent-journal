import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const SAMPLE_MS = 2500;
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(address);
    const history = page.locator(".history");
    await history.getByText("Backlog message 30", {exact: true}).waitFor();
    await page.waitForFunction(() => {
        const pane = document.querySelector(".history");
        return pane.scrollHeight - pane.scrollTop - pane.clientHeight < 2;
    });
    await page.waitForTimeout(2000);
    const startSampling = () => page.evaluate((duration) => {
        const pane = document.querySelector(".history");
        window.__samples = [];
        const began = performance.now();
        const sample = () => {
            window.__samples.push([Math.round(performance.now() - began), Math.round(pane.scrollTop), pane.scrollHeight, pane.clientHeight]);
            if (performance.now() - began < duration) requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
    }, SAMPLE_MS);
    const samplesAfter = async (action, prepare = async () => {}) => {
        await prepare();
        await startSampling();
        await action();
        await page.waitForTimeout(SAMPLE_MS + 200);
        return page.evaluate(() => window.__samples);
    };
    const sent = await samplesAfter(() => page.locator(".composer-input").press("Enter"), async () => {
        await page.locator(".composer-input").fill("A message sent\nfrom the chat\nin four\nshort lines");
        await page.waitForTimeout(1000);
    });
    const arrived = await samplesAfter(async () => {
        writeFileSync(`${capture}.ready`, "ready");
        await page.waitForFunction(() => document.querySelector(".history").textContent.includes("A message from the agent"), null, {timeout: 20000});
    });
    for (const [name, samples] of [["sent", sent], ["arrived", arrived]]) {
        console.log(name, JSON.stringify(samples.filter((sample, index) => index === 0 || sample[1] !== samples[index - 1][1] || sample[2] !== samples[index - 1][2])));
        let highest = 0;
        for (const [, top] of samples) {
            assert.ok(top >= highest - 0.5, `the chat scrolled up after a message ${name}: ${highest} then ${top}`);
            highest = Math.max(highest, top);
        }
    }
    assert.deepEqual(errors, []);
    await page.screenshot({path: capture});
} finally {
    await browser.close();
}
