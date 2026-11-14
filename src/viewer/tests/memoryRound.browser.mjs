import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, raw, capture] = process.argv.slice(2);
const expected = JSON.parse(raw);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await (await browser.newContext()).newPage();
    page.on("pageerror", (failure) => process.stderr.write(`${failure.message}\n`));
    await page.goto(address);
    await page.waitForSelector(".thread-turn");
    for (const group of await page.getByTitle(/^Show each of them/).all()) await group.click();
    const mark = page.locator(`[data-ref="chat_mark:${expected.mark}"]`);
    try {
        await mark.waitFor({state: "visible"});
    } catch (failure) {
        await page.screenshot({path: capture, fullPage: true});
        process.stderr.write(JSON.stringify(await page.locator(".thread-turn").evaluateAll((rows) => rows.map((row) => ({ref: row.dataset.ref, text: row.textContent.slice(0, 180)})))));
        throw failure;
    }
    assert.match(await mark.textContent(), new RegExp(`${expected.shown.length} of ${expected.shown.length + expected.faded.length} still shown`));
    await mark.locator(".fold").first().click();
    const round = mark.locator(".memory-round");
    await round.waitFor({state: "visible"});
    for (const [label, ids] of [["Still shown", expected.shown], ["Removed", expected.faded]]) {
        const group = round.locator(".fold-group").filter({has: page.getByText(label, {exact: true})});
        assert.equal(await group.locator(".fold-count").textContent(), String(ids.length));
        await group.locator(".fold-head").click();
        const actual = await group.locator("[data-memory-ref]").evaluateAll((rows) => rows.map((row) => Number(row.dataset.memoryRef)));
        assert.deepEqual(actual, ids);
    }
    for (const id of expected.excluded) assert.equal(await round.locator(`[data-memory-ref="${id}"]`).count(), 0);
    await mark.screenshot({path: capture});
} finally {
    await browser.close();
}
