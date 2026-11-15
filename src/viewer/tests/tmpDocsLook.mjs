import {chromium} from "playwright-core";

const [address, folder] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true, args: ["--disable-crash-reporter"]});
const log = (text) => console.log(text);
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1100}, reducedMotion: "reduce"});
    page.on("pageerror", (error) => console.log("PAGEERROR", String(error)));
    page.on("console", (m) => m.type() === "error" && console.log("CONSOLE", m.text()));
    for (const [table, id, term] of [["docs", 1, "doc"], ["reports", 1, "report"]]) {
        await page.goto(`${address}#/?open=${table}:${id}`);
        await page.reload();
        await page.locator("[data-document-inspector]").waitFor({timeout: 30000});
        await page.waitForTimeout(800);
        const shot = (name) => page.screenshot({path: `${folder}/${term}-${name}.png`, animations: "disabled"});
        await shot("text");
        log(`${term} head: ${(await page.locator("[data-inspector-head]").innerText()).replace(/\n+/g, " | ")}`);
        log(`${term} tabs: ${(await page.locator("[data-document-tab], [data-document-notes-toggle]").allInnerTexts()).join(" / ")}`);
        for (const tab of ["revisions", "links", "details"]) {
            const button = page.locator(`[data-document-tab="${tab}"]`);
            if (!(await button.count())) { log(`${term} has no ${tab} tab`); continue; }
            await button.click();
            await page.waitForTimeout(600);
            await shot(tab);
            log(`${term} ${tab}: ${(await page.locator(".document-body").innerText()).replace(/\n+/g, " | ").slice(0, 300)}`);
        }
        await page.locator('[data-document-tab="text"]').click();
        await page.locator("[data-actions-menu]").first().click();
        await page.waitForTimeout(300);
        log(`${term} menu: ${(await page.locator("[data-menu-item]").allInnerTexts()).join(" / ")}`);
        await shot("menu");
        await page.locator("[data-menu-item]", {hasText: /^Edit$/}).click();
        await page.locator("[data-text-form]").waitFor({timeout: 5000});
        await shot("edit");
        await page.locator("[data-text-form] textarea").fill("# Changed\nNew text from the browser.\n");
        await page.locator("[data-text-save]").click();
        await page.waitForTimeout(1200);
        log(`${term} after edit, failure: "${await page.locator("[data-text-failure]").count() ? await page.locator("[data-text-failure]").innerText() : "dialog closed"}"; text: ${(await page.locator("[data-resource-text]").innerText()).slice(0, 60)}`);
        await page.locator("[data-comment-input]").fill("A comment from the browser");
        await page.locator("[data-comment-send]").click();
        await page.waitForTimeout(1000);
        await page.locator("[data-document-notes-toggle]").click();
        await page.waitForTimeout(500);
        await shot("comments");
        log(`${term} comments: ${(await page.locator("[data-document-sidebar]").innerText()).replace(/\n+/g, " | ").slice(0, 200)}`);
        await page.locator("[data-actions-menu]").first().click();
        await page.locator("[data-menu-item]", {hasText: /^Copy command$/}).click();
        await page.waitForTimeout(400);
        await page.locator("[data-actions-menu]").first().click();
        await page.locator("[data-menu-item]", {hasText: /^Settle$/}).click();
        await page.locator("[data-settle-form]").waitFor({timeout: 5000});
        await shot("settle");
        await page.locator("[data-settle-why]").fill("Done another way");
        await page.locator("[data-settle-save]").click();
        await page.waitForTimeout(1500);
        log(`${term} after settle, dialog open: ${await page.locator("[data-settle-form]").count()}, failure: ${await page.locator("[data-settle-failure]").count() ? await page.locator("[data-settle-failure]").innerText() : ""}`);
        await page.locator('[data-document-tab="details"]').click();
        await page.waitForTimeout(500);
        log(`${term} details after settle: ${(await page.locator("[data-resource-fields]").innerText()).replace(/\n+/g, " | ")}`);
        await shot("details-settled");
    }
} finally {
    await browser.close();
}
