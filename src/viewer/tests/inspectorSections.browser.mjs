import assert from "node:assert/strict";
import http from "node:http";
import {chromium} from "playwright-core";

const [address, scene, socketPath, picture] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});

async function run(argv) {
    const answer = await new Promise((resolve, reject) => {
        const request = http.request({socketPath, path: "/cli", method: "POST"}, (response) => {
            let body = "";
            response.on("data", (chunk) => { body += chunk; });
            response.on("end", () => resolve({body, code: response.trailers["journal-exit-code"]}));
        });
        request.on("error", reject);
        request.end(JSON.stringify({argv, folder: "/", variables: {USER: "Ada"}}));
    });
    assert.equal(answer.code, "0", JSON.stringify(answer));
    return answer.body;
}

const section = (panel, name) => panel.locator(`[data-section="${name}"]`);

async function openRow(page, table, id) {
    await page.evaluate(([rowTable, rowId]) => { location.hash = `#?open=${rowTable}:${rowId}`; }, [table, id]);
}

// the inspector still draws its own parts and its first button, whatever a section did
async function inspectorWorks(panel) {
    await panel.locator("[data-plan-details]").waitFor();
    await panel.getByRole("button", {name: "Approve", exact: true}).waitFor();
    await panel.getByRole("heading", {name: "Phases", exact: true}).waitFor();
}

const scenes = {
    // a sample module's section and button, on a plan whose module knows nothing of them
    async notes(page, panel) {
        await page.getByRole("button", {name: "Allow", exact: true}).click();
        await section(panel, "plan_notes.notes").locator("[data-plan-notes]").getByText("Notes on Cart security").waitFor();
        await inspectorWorks(panel);
        const press = page.waitForResponse((response) => response.url().endsWith("/api/line") && response.request().postDataJSON().line?.join(" ") === "plan-notes add 1");
        await panel.getByRole("button", {name: "Note it", exact: true}).click();
        await page.getByRole("button", {name: "Allow", exact: true}).click();
        assert.match(await (await press).text(), /Noted plan 1: Cart security/);

        console.log("Following an edit of the plan, and a change to another plan in the same panel");
        await run(["plan", "edit", "1", "--title", "Cart safety"]);
        await section(panel, "plan_notes.notes").getByText("Notes on Cart safety").waitFor();
        await openRow(page, "plans", 2);
        await section(page.locator("[data-inspector]"), "plan_notes.notes").getByText("Notes on Tax rules").waitFor();
    },

    // a section on every inspector the sample names, and none on a plan
    async elsewhere(page, panel) {
        await inspectorWorks(panel);
        assert.equal(await section(panel, "sections.elsewhere").count(), 0);
        await openRow(page, "tasks", 1);
        await page.locator('[data-section="sections.elsewhere"]').getByText("Row 1").waitFor();
        await openRow(page, "memories", 1);
        await page.locator('[data-section="sections.elsewhere"]').getByText("Row 1").waitFor();
    },

    // what fails stays in its own section: the refusal, the throw and the failing read, each beside a section that works
    async failing(page, panel) {
        while (await page.getByRole("button", {name: "Allow", exact: true}).waitFor({timeout: 1500}).then(() => true, () => false)) {
            await page.getByRole("button", {name: "Allow", exact: true}).first().click();
        }
        await section(panel, "sections.failing").locator("[data-section-failure]").getByText("no plan").waitFor();
        await section(panel, "sections.undeclared").locator("[data-section-refusal]").getByText("does not declare task list").waitFor();
        await section(panel, "sections.throwing").getByText("this section broke").waitFor();
        await section(panel, "sections.throwing").getByRole("button", {name: "Retry", exact: true}).waitFor();
        await section(panel, "plan_notes.notes").getByText("Notes on Cart security").waitFor();
        await inspectorWorks(panel);
    },

    // with no trust a section says how to trust it and loads nothing
    async untrusted(page, panel) {
        await section(panel, "plan_notes.notes").getByText("journal window trust acme.plan_notes").waitFor();
        assert.equal(await section(panel, "plan_notes.notes").locator("[data-plan-notes]").count(), 0);
        await inspectorWorks(panel);
    },

    // removing the module takes its section and button from the open inspector, with no reload
    async removal(page, panel) {
        await page.getByRole("button", {name: "Allow", exact: true}).click();
        await section(panel, "plan_notes.notes").locator("[data-plan-notes]").waitFor();
        await run(["module", "remove", "acme.plan_notes"]);
        await section(panel, "plan_notes.notes").waitFor({state: "detached"});
        await panel.getByRole("button", {name: "Note it", exact: true}).waitFor({state: "detached"});
        await inspectorWorks(panel);
    },

    // two rounds, newest first, with their reports linked; a third runs, and ends by the button with no reload
    async rounds(page, panel) {
        const rounds = section(panel, "plan_reviews.rounds");
        await rounds.getByRole("heading", {name: "Review rounds: 2", exact: true}).waitFor();
        const rows = rounds.locator("[data-plan-round]");
        assert.equal(await rows.count(), 2);
        assert.match(await rows.nth(0).innerText(), /Round 2/);
        assert.match(await rows.nth(1).innerText(), /Round 1/);
        await rounds.scrollIntoViewIfNeeded();
        await page.getByRole("button", {name: "Skip", exact: true}).click({timeout: 2000}).catch(() => {});
        await page.screenshot({path: picture});

        console.log("Opening the report of the newest round");
        await rows.nth(0).getByRole("button", {name: /^Report \d+/}).click();
        await page.locator('[data-document-tab="text"]').waitFor();
        await page.locator("[data-resource-panel] [data-resource-title]").getByText("Second critique").waitFor();
        await page.keyboard.press("Escape");

        console.log("A third round shows as running, and the button ends it");
        await rounds.getByRole("heading", {name: "Review rounds: 2", exact: true}).waitFor();
        await run(["plan", "review", "1"]);
        await rounds.getByRole("heading", {name: "Review rounds: 3", exact: true}).waitFor();
        await rows.nth(0).getByText("Running").waitFor();
        await panel.getByRole("button", {name: "End review", exact: true}).click();
        await rows.nth(0).getByText("Running").waitFor({state: "detached"});
    },
};

const page = await browser.newPage({viewport: {width: 1280, height: 1000}});
const problems = [];
page.on("pageerror", (error) => problems.push(error.message));

try {
    await page.goto(address);
    await openRow(page, "plans", 1);
    const panel = page.locator("[data-inspector]");
    await panel.waitFor({timeout: 15000});
    await scenes[scene](page, panel);
    assert.deepEqual(problems.filter((problem) => !problem.includes("this section broke")), []);
} catch (error) {
    const shown = await page.locator("[data-resource-panel]").innerText({timeout: 1000}).catch(() => "no panel");
    throw new Error(`${error.message}\nscene ${scene}\npanel:\n${shown}\nproblems:\n${problems.join("\n")}`);
} finally {
    await browser.close();
}
