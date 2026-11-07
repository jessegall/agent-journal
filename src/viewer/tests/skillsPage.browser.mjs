import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    await page.goto(address);
    const link = page.locator('[data-sidebar-window="skills.skills"]');
    await link.waitFor();
    await link.click();
    const skills = page.locator('[data-window="skills.skills"]');
    await skills.getByRole("heading", {name: "Skills", exact: true}).waitFor();
    await skills.locator('[data-skills-catalogue]').getByRole("button", {name: "journal-etiquette", exact: true}).waitFor();
    await skills.locator(".window-cover").waitFor({state: "detached"});
    const offer = await page.evaluate(async () => (await (await fetch("/api/windows?environment=main")).json()).windows.find((entry) => entry.name === "skills.skills"));
    assert.equal(offer.place, "page");
    assert.equal(offer.group, "project");
    await page.screenshot({path: capture, animations: "disabled"});
    await skills.locator('[data-skills-catalogue]').getByRole("button", {name: "journal", exact: true}).click();
    await skills.locator("[data-skill-text]").waitFor();
} finally {
    await browser.close();
}
