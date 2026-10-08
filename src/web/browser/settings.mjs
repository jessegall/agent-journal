import {reply, runScenarios, shot} from "./harness.mjs";

const AUTO = "Start the next to-do without asking";

await runScenarios(process.argv[2], {
    async "the updates page offers Update anyway for changed files and sends it with yes"(page, url) {
        const about = {version: "2.258.0", changelog: "# 2.258.0\n", latest: "2.263.0", newer: true, checking: false, updating: false, repository: false, changed: ["AGENTS.md", "CLAUDE.md"]};
        await page.route(/\/api\/(main\/)?changelog/, (route) => reply(route, about));
        await page.route(/\/api\/(main\/)?update\/check/, (route) => reply(route, {}));
        let sent = null;
        await page.route(/\/api\/(main\/)?update$/, (route) => {
            sent = route.request().postDataJSON();
            return reply(route, {updating: true});
        });
        await page.goto(`${url}#/main/about`);
        const button = page.getByRole("button", {name: "Update anyway"});
        await button.waitFor({timeout: 30000});
        await page.getByText("AGENTS.md, CLAUDE.md").waitFor();
        await shot(page, "update-anyway");
        await button.click();
        await page.waitForFunction(() => document.body.innerText.includes("Updating to 2.263.0"));
        if (!sent || sent.yes !== true) throw new Error(`the button sent ${JSON.stringify(sent)} instead of yes: true`);
    },
    async "the updates page lists earlier versions and installs the one picked"(page, url) {
        const about = {version: "2.263.0", changelog: "# 2.263.0\n", latest: "2.263.0", newer: false, checking: false, updating: false, repository: false, changed: []};
        await page.route(/\/api\/(main\/)?changelog/, (route) => reply(route, about));
        await page.route(/\/api\/(main\/)?update\/check/, (route) => reply(route, {}));
        await page.route(/\/api\/(main\/)?releases/, (route) => reply(route, {versions: ["2.262.0", "2.250.0"]}));
        let sent = null;
        await page.route(/\/api\/(main\/)?update$/, (route) => {
            sent = route.request().postDataJSON();
            return reply(route, {updating: true});
        });
        await page.goto(`${url}#/main/about`);
        await page.getByText("Install an earlier version").click();
        const button = page.getByRole("button", {name: "Install 2.250.0"});
        await button.waitFor({timeout: 30000});
        await shot(page, "earlier-versions");
        await button.click();
        await page.waitForFunction(() => document.body.innerText.includes("Updating to 2.250.0"));
        if (!sent || sent.version !== "2.250.0") throw new Error(`the button sent ${JSON.stringify(sent)} instead of version 2.250.0`);
    },
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
    async "stopping the journal shows a spinner on Stop, then closes the tab or says the journal is stopped"(page, url) {
        let answer;
        await page.route(/\/api\/stop$/, (route) => new Promise((resolve) => (answer = () => (reply(route, {}), resolve()))));
        await page.goto(`${url}#/main/settings?sub=system`);
        const stop = page.getByRole("button", {name: "Stop", exact: true});
        await stop.click({timeout: 5000}).catch(async () => {
            throw new Error(`no Stop button; page reads: ${(await page.locator("body").innerText()).replace(/\s+/g, " ").slice(0, 600)}`);
        });
        await page.waitForFunction(() => document.querySelector("button[data-busy]"), null, {timeout: 5000}).catch(() => {
            throw new Error("Stop showed no spinner while the server had not answered");
        });
        const closed = page.waitForEvent("close", {timeout: 5000}).then(() => true, () => false);
        answer();
        if (await closed) return;
        await page.getByText("The journal is stopped", {exact: false}).waitFor({timeout: 5000});
    },
});
