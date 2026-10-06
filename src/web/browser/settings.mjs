import {runScenarios} from "./harness.mjs";

const AUTO = "Start the next to-do without asking";

await runScenarios(process.argv[2], {
    async "a switch changed on the settings page is still changed after a reload"(page, url) {
        const control = page.getByTitle(AUTO, {exact: true});
        await page.goto(`${url}#/main/settings?q=Questions`);
        const before = await control.getAttribute("aria-checked");
        const saved = page.waitForResponse((answer) => answer.request().method() === "POST" && /\/api\/main\/settings$/.test(answer.url()));
        await control.click();
        await saved;
        const changed = before === "true" ? "false" : "true";
        await page.reload();
        await page.waitForFunction(([title, value]) => document.querySelector(`[title="${title}"]`)?.getAttribute("aria-checked") === value, [AUTO, changed], {timeout: 8000}).catch(() => {
            throw new Error(`the switch read ${before} before the change and was not ${changed} after a reload`);
        });
    },
});
