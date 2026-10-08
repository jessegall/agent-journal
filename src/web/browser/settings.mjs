import {runScenarios} from "./harness.mjs";

const AUTO = "Start the next to-do without asking";

await runScenarios(process.argv[2], {
    async "a switch changed on the settings page is still changed after a reload"(page, url) {
        const control = page.getByRole("switch", {name: AUTO, exact: true});
        await page.goto(`${url}#/main/settings?q=Questions`);
        const before = await control.getAttribute("aria-checked");
        const saved = page.waitForResponse((answer) => answer.request().method() === "POST" && /\/api\/main\/settings$/.test(answer.url()));
        await control.click();
        await saved;
        const changed = before === "true" ? "false" : "true";
        await page.reload();
        await page.waitForFunction(([title, value]) => document.querySelector(`[role="switch"][aria-label="${title}"]`)?.getAttribute("aria-checked") === value, [AUTO, changed], {timeout: 8000}).catch(() => {
            throw new Error(`the switch read ${before} before the change and was not ${changed} after a reload`);
        });
    },
    async "a remembered tab that no longer exists opens the first tab instead of an empty page"(page, url) {
        await page.goto(`${url}#/main/settings`);
        await page.evaluate(() => localStorage.setItem("journal.settings.tab", JSON.stringify("tunnel")));
        await page.reload();
        await page.getByRole("switch").first().waitFor({timeout: 30000}).catch(() => {
            throw new Error("the settings page showed nothing for a remembered tab that no longer exists");
        });
    },
    async "the unit list inside the how-often panel shows whole and keeps the panel open when picked"(page, url) {
        await page.goto(`${url}#/main/settings?q=Install updates automatically`);
        const chip = page.getByTitle("Change how often").first();
        await chip.waitFor({timeout: 30000});
        await page.waitForLoadState("networkidle");
        await chip.click();
        const panel = page.getByRole("dialog");
        const unit = panel.locator(".unit-field-unit button").first();
        await unit.waitFor({timeout: 30000});
        await unit.click();
        const option = page.locator(".menu-panel button", {hasText: "tool calls"}).first();
        await option.waitFor();
        const visible = await option.evaluate((el) => {
            const box = el.getBoundingClientRect();
            const top = document.elementFromPoint(box.right - 4, box.top + box.height / 2);
            return el.contains(top);
        });
        if (!visible) throw new Error("the unit list is cut off at the edge of the how-often panel");
        await option.click();
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(800);
        await panel.waitFor({timeout: 2000}).catch(() => {
            throw new Error("picking a unit closed the how-often panel");
        });
    },
});
