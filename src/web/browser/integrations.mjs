import {createServer} from "node:http";
import {journal, numberOf, runScenarios, shot} from "./harness.mjs";

await runScenarios(process.argv[2], {
    async "Linear is off at first and its card says how the key and the state read"(page, url) {
        await page.goto(`${url}#/main/integrations`);
        const card = page.locator('[data-integration="linear"]');
        await card.waitFor();
        await page.getByText("Outside services the journal can reach for you").first().waitFor();
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
        await card.getByText("Webhook signing secret").waitFor();
        await card.getByText(/Paste this address into Linear's webhook settings|Turn on sharing to get an address/).waitFor();
        await page.reload();
        if ((await page.locator('[data-integration="linear"]').getByRole("switch").getAttribute("aria-checked")) !== "true") throw new Error("the switch did not stay on");
        await shot(page, "integrations-on");
    },
    async "Gmail is off at first and its card asks for the address and the mail to read once it is on"(page, url) {
        await page.goto(`${url}#/main/integrations`);
        const card = page.locator('[data-integration="gmail"]');
        await card.waitFor();
        await card.getByText("Use Gmail").waitFor();
        if ((await card.getByRole("switch").getAttribute("aria-checked")) !== "false") throw new Error("Gmail starts switched on");
        if (await card.getByText("through its MCP server").count()) throw new Error("Gmail offers an MCP server switch it does not have");
        await card.getByRole("switch").click();
        await card.locator("[data-gmail-account]").waitFor();
        await card.locator("[data-gmail-search]").waitFor();
        await card.locator("[data-gmail-account]").fill("me@gmail.com");
        await card.locator("[data-gmail-account]").blur();
        await page.reload();
        await page.locator('[data-integration="gmail"] [data-gmail-account]').waitFor();
        if ((await page.locator('[data-integration="gmail"] [data-gmail-account]').inputValue()) !== "me@gmail.com") throw new Error("the address was not kept");
        await shot(page, "integrations-gmail");
    },
    async "an image in text from Linear shows as a link and loads nothing from its host"(page, url) {
        const asked = [];
        const host = createServer((request, answer) => (asked.push(request.url), answer.end("x"))).listen(0);
        await new Promise((done) => host.once("listening", done));
        const image = `http://127.0.0.1:${host.address().port}/pixel.png`;
        const brief = `<untrusted source="linear" author="Ana">See ![pixel](${image}) and <img src="${image}"></untrusted>`;
        const n = numberOf(journal("todo", "create", `From Linear ${Date.now()}`, "--brief", brief));
        try {
            await page.goto(`${url}#/main/todo/${n}`);
            await page.locator("article").getByText("pixel (image)").waitFor();
            await page.waitForTimeout(500);
            if (asked.length) throw new Error(`the viewer asked the image's host: ${asked.join(", ")}`);
        } finally {
            host.close();
        }
    },
});
