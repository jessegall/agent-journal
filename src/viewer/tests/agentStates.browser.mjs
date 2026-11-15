import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, agent, name] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
try {
    const page = await browser.newPage({viewport: {width: 1000, height: 960}, reducedMotion: "reduce"});
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${address}#open=agents:${agent}`);
    const panel = page.locator("[data-resource-panel]");
    await panel.locator("[data-agent-inspector]").waitFor();
    const states = panel.locator("[data-agent-open-state]");
    await states.first().waitFor();
    const names = await states.locator(".name").allTextContents();
    assert.ok(names.includes(name), JSON.stringify(names));
    const stateTypes = await states.locator(".state-type").allTextContents();
    assert.equal(stateTypes.length, names.length, JSON.stringify(stateTypes));
    assert.ok(stateTypes.every((stateType) => stateType.length > 0), JSON.stringify(stateTypes));
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
