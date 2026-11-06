import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const SLOW_MS = 1500;
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1200, height: 760}});
    const saves = [];
    // the save answers late, so the button can be seen while its request is in flight
    await page.route("**/api/line", async (route) => {
        const line = JSON.parse(route.request().postData() ?? "{}").line ?? [];
        if (line[0] === "memory" && line[1] === "make") {
            saves.push(line);
            await new Promise((resolve) => setTimeout(resolve, SLOW_MS));
        }
        await route.continue();
    });
    await page.goto(address);
    await page.locator('[data-sidebar-window="memories.memories"]').click();
    await page.locator("[data-memory-new]").click();
    await page.locator("[data-memory-form] textarea").fill("Close each task with its outcome");
    const save = page.locator('[data-memory-form] button:has-text("Save memory")');
    await save.dblclick({force: true});
    const busy = page.locator('[data-memory-form] button[data-busy]:has-text("Save memory")');
    await busy.waitFor({timeout: 2000});
    assert.equal(await busy.isDisabled(), true, "the button is disabled while its request flies");
    await page.screenshot({path: `${capture}-busy.png`});
    await page.locator("[data-memory-form]").waitFor({state: "detached", timeout: SLOW_MS * 4});
    assert.equal(saves.length, 1, `a double click sent ${saves.length} requests`);
} finally {
    await browser.close();
}
