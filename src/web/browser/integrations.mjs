import {runScenarios, shot} from "./harness.mjs";

await runScenarios(process.argv[2], {
    async "Linear is off at first and its card says how the key and the state read"(page, url) {
        await page.goto(`${url}#/main/integrations`);
        const card = page.locator('[data-integration="linear"]');
        await card.waitFor();
        await card.getByText("Use Linear").waitFor();
        await card.getByText("Key", {exact: true}).waitFor();
        await card.getByText("No key is picked, so Linear is not reached.").waitFor();
        await card.getByText("Add one on the Secrets page.").waitFor();
        if ((await card.getByRole("switch").getAttribute("aria-checked")) !== "false") throw new Error("Linear starts switched on");
        await card.locator("[data-state]").getByText("Off", {exact: true}).waitFor();
        await shot(page, "integrations-off");
    },
    async "a key can be picked and the switch turns Linear on"(page, url) {
        const title = `Linear key ${Date.now()}`;
        await page.goto(`${url}#/main/secrets`);
        await page.getByRole("button", {name: "New secret"}).click();
        await page.getByRole("radio", {name: /Login/}).click();
        await page.locator("#secret-title").fill(title);
        await page.getByRole("button", {name: "Create secret"}).click();
        await page.getByText("Not set").first().waitFor();
        await page.goto(`${url}#/main/integrations`);
        const card = page.locator('[data-integration="linear"]');
        await card.getByText(title).click();
        await card.getByText(`Linear signs in with the secret ${title}.`).waitFor();
        await card.getByRole("switch").click();
        await card.locator("[data-state]").getByText(/Not checked yet|Last checked|Could not reach Linear/).waitFor();
        await page.reload();
        if ((await page.locator('[data-integration="linear"]').getByRole("switch").getAttribute("aria-checked")) !== "true") throw new Error("the switch did not stay on");
        await shot(page, "integrations-on");
    },
});
