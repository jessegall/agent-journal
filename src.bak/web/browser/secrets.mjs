import {readFileSync, readdirSync, statSync} from "node:fs";
import {join} from "node:path";
import {journal, runScenarios, shot} from "./harness.mjs";

const VALUE = "sk-test-7c1e94ab5f20";

const gone = (error) => {
    if (error.code !== "ENOENT") throw error;
};

function filesUnder(folder) {
    try {
        return readdirSync(folder).flatMap((name) => {
            const path = join(folder, name);
            try {
                return statSync(path).isDirectory() ? filesUnder(path) : [path];
            } catch (error) {
                return gone(error) ?? [];
            }
        });
    } catch (error) {
        return gone(error) ?? [];
    }
}

function holdsValue(file) {
    try {
        return readFileSync(file).includes(VALUE);
    } catch (error) {
        return gone(error) ?? false;
    }
}

await runScenarios(process.argv[2], {
    async "a secret is made, filled in and deleted, and its value is in no page, response or record"(page, url) {
        const bodies = [];
        page.on("response", (answer) => answer.text().then((text) => bodies.push(text), () => {}));
        await page.goto(`${url}#/main/secrets`);
        await page.getByRole("button", {name: "New secret"}).click();
        await page.getByRole("radio", {name: /Login/}).click();
        await page.locator("#secret-title").fill(`Staging ${Date.now()}`);
        await page.locator("#secret-abstract").fill("The staging site");
        await page.getByRole("button", {name: "Create secret"}).click();
        await page.getByText("Not set").first().waitFor();
        await shot(page, "secret-open");
        const field = page.getByLabel("Value of password");
        if ((await field.getAttribute("type")) !== "password") throw new Error("a hidden field shows its value while it is typed");
        await field.fill(VALUE);
        await page.getByRole("button", {name: "Set value"}).last().click();
        await page.locator(".chip", {hasText: /^Set$/}).first().waitFor();
        if ((await field.inputValue()) !== "") throw new Error("the input still holds the value after it was set");
        await page.reload();
        await page.getByText("Where the values are kept").waitFor();
        if ((await page.content()).includes(VALUE)) throw new Error("the value is in the page");
        const path = await page.locator(".secrets-path code").innerText();
        if (!readFileSync(path, "utf8").includes(VALUE)) throw new Error(`the value is not in the values file ${path}`);
        const leaked = filesUnder(process.env.JOURNAL_SCRATCH_ROOT).filter(holdsValue);
        if (leaked.length) throw new Error(`the value is in the record: ${leaked.join(", ")}`);
        if (bodies.some((body) => body.includes(VALUE))) throw new Error("the value came back in a response");
        await shot(page, "secret-list");
        await page.getByRole("button", {name: /^Staging/}).click();
        await page.getByRole("button", {name: "Delete secret"}).click();
        await page.getByText("Deleted secrets").waitFor();
        await page.getByRole("button", {name: "Restore"}).click();
        await page.getByRole("button", {name: /^Staging/}).waitFor();
    },
    async "the agent's request is a band at the top of the page with a button to fill it in"(page, url) {
        const title = `Asked ${Date.now()}`;
        journal("secret", "request", title, "to run the payment tests");
        await page.goto(`${url}#/main/secrets`);
        await page.getByText(`The agent is waiting for a secret: ${title}`).waitFor();
        await page.getByText("to run the payment tests").first().waitFor();
        await page.getByRole("button", {name: "Fill it in"}).first().click();
        await page.getByText("Not set").first().waitFor();
    },
});
