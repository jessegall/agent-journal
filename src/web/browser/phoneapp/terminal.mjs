import {reply, runScenarios} from "../harness.mjs";
import {home, PAIR, PHONE, pairedState, SHOWN} from "./paired.mjs";

const AGENTS = /\/api\/[^/]+\/agent\?/;
const LINES = /\/api\/[^/]+\/agent\/7\/terminal/;
const SHELL = /\/api\/[^/]+\/agent\/claude-main\/shell$/;
const AGENT = {n: 7, type: "agent", title: "claude-main", updated: 1, completed: 0, deleted: 0, refs: [], data: {status: "running", at: 1}};
const state = await pairedState();

async function terminal(page) {
    await home(page);
    await page.getByRole("button", {name: /^Main agent/}).dispatchEvent("click");
    await page.getByRole("button", {name: "Its terminal"}).click();
}

await runScenarios(
    PAIR,
    {
        async "the agent's terminal opens from its sheet and runs a command"(page) {
            const sent = [];
            await page.route(AGENTS, (route) => reply(route, {rows: [AGENT]}));
            await page.route(LINES, (route) => reply(route, {lines: [{at: 1, tool: "Bash", command: "npm test", output: "all passed"}]}));
            await page.route(SHELL, (route) => (sent.push(route.request().postDataJSON()), reply(route, {})));
            await terminal(page);
            await page.getByText("npm test").waitFor({timeout: SHOWN});
            await page.getByLabel("A command to run in the agent's terminal").fill("ls");
            await page.getByLabel("A command to run in the agent's terminal").press("Enter");
            for (let i = 0; i < 20 && !sent.length; i++) await page.waitForTimeout(100);
            if (sent[0]?.command !== "ls") throw new Error(`the command did not reach the agent: ${JSON.stringify(sent)}`);
        },
        async "with no agent yet the terminal says so"(page) {
            await page.route(AGENTS, (route) => reply(route, {rows: []}));
            await terminal(page);
            await page.getByText("No agent yet").waitFor({timeout: SHOWN});
        },
    },
    {voice: false, device: {...PHONE, storageState: state}}
);
