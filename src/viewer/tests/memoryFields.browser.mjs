import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);

// the viewer's own field: a 7 px corner and a 1 px border that is not the browser's default grey
async function expectViewerLook(field) {
    const look = await field.evaluate((element) => {
        const style = getComputedStyle(element);
        return {radius: style.borderTopLeftRadius, width: style.borderTopWidth, color: style.borderTopColor};
    });
    assert.equal(look.radius, "7px");
    assert.equal(look.width, "1px");
    assert.notEqual(look.color, "rgb(118, 118, 118)", "the browser's default border colour");
}

const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1200, height: 760}});
    await page.goto(address);
    await page.locator('[data-sidebar-window="memories.memories"]').click();
    await page.locator("[data-memory]").first().click();
    const word = page.locator("[data-memory-word-form] input");
    await word.waitFor();
    await expectViewerLook(word);
    await page.locator("[aria-busy=true]").first().waitFor({state: "detached"});
    await page.screenshot({path: `${capture}-inspector.png`});
    await page.locator("[data-resource-close]").click();
    await page.locator("[data-memory-new]").click();
    const text = page.locator("[data-memory-form] textarea");
    await text.waitFor();
    await expectViewerLook(text);
    await page.screenshot({path: `${capture}-new.png`});
} finally {
    await browser.close();
}
