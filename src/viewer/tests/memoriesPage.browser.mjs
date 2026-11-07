import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});

async function shoot(page, name) {
    await page.waitForTimeout(400);
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await page.screenshot({path: `${capture}-${name}-${colorScheme}.png`, animations: "disabled"});
    }
}

const names = (page) => page.locator("[data-agent-column] [data-who-name]").allInnerTexts();

try {
    const context = await browser.newContext({viewport: {width: 1280, height: 820}});
    const page = await context.newPage();
    await page.goto(address);
    const link = await page.locator('[data-sidebar-window="memories.memories"]').first().getAttribute("href");
    await page.goto(new URL(link, address).href);
    await page.locator("[data-memory-browser]").waitFor();
    await page.locator("[data-memory]").first().waitFor();

    assert.deepEqual((await names(page)).slice(0, 3), ["Main agent", "Other agents", "Every agent"]);
    assert.match(await page.locator("[data-pane-title]").innerText(), /Main agent/);
    assert.equal(await page.locator("[data-memories-more]").count(), 1, "a list of more than twenty offers the next page");
    await shoot(page, "main-agent");

    await page.locator("[data-others]").click();
    await page.locator("[data-group-link]").first().waitFor();
    await page.waitForFunction(() => [...document.querySelectorAll("[data-group-link]")].every((link) => /^(Worker|Helper|Reviewer) \d+$/.test(link.textContent)));
    assert.ok((await page.locator("[data-group-link]").allInnerTexts()).every((name) => /^(Worker|Helper|Reviewer) \d+$/.test(name)), "agents with no given name are named by role and number");
    await shoot(page, "workers-and-helpers");

    await page.locator("[data-ended-fold]").click();
    await page.locator("[data-agent-column] [data-who]").nth(4).waitFor();
    const ended = page.locator("[data-agent-column] [data-who]").filter({hasText: "ended"}).first();
    await ended.click();
    await page.locator("[data-ended-note]").waitFor();
    assert.match(await page.locator("[data-ended-note]").innerText(), /reach no agent while it is ended/);
    await shoot(page, "ended-agent");

    await page.locator("[data-memory]").first().click();
    await page.locator("[data-resource-fields]").waitFor();
    await page.getByText("Belongs to", {exact: true}).waitFor();
    const fields = await page.locator("[data-resource-fields]").innerText();
    assert.match(fields, /Belongs to/);
    assert.match(fields, /(Worker|Helper|Reviewer) \d+/);
    await shoot(page, "side-panel");
    await page.keyboard.press("Escape");

    await page.locator("[data-agent-find] input").fill("nobody here");
    await page.locator("[data-no-agent-match]").waitFor();
    await shoot(page, "no-agent-match");

    assert.equal(await page.locator("[data-memory-tabs]").count(), 0, "a window reads only its own environment, so it offers no tab for another");

    const phone = await page.context().newPage();
    await phone.setViewportSize({width: 390, height: 780});
    await phone.goto(new URL(link, address).href);
    await phone.locator("[data-whose]").waitFor();
    await phone.locator("[data-memory]").first().waitFor();
    assert.equal(await phone.locator("[data-agent-column]").isVisible(), false, "the main agent's memories come first");
    await shoot(phone, "phone-main-agent");
    await phone.locator("[data-whose]").click();
    await phone.locator("[data-agent-column]").waitFor({state: "visible"});
    assert.equal(await phone.locator("[data-memory-pane]").isVisible(), false);
    await shoot(phone, "phone-choosing");
} finally {
    await browser.close();
}
