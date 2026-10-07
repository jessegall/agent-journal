import {journal, numberOf, reply, runScenarios} from "./harness.mjs";

const SHOWN = 6000;
const STATUS = /\/api\/main\/share\/tunnel$/;
const LOGIN = /\/api\/main\/share\/login$/;
const INSTALL = /\/api\/main\/share\/install/;
const working = {installed: true, logged_in: true, host: "tunler.test", address: "scratch.tunler.test", problems: []};
const loggedOut = {installed: true, logged_in: false, host: "tunler.test", address: "", problems: ["tunler is not connected"]};
const absent = {installed: false, logged_in: false, host: "", address: "", problems: ["tunler is not installed"]};

async function pill(page, url, standing) {
    const state = {status: standing, logins: [], installs: 0, checks: 0};
    await page.route(STATUS, (route) => (state.checks++, reply(route, state.status)));
    await page.goto(`${url}#/main`);
    await page.getByRole("button", {name: /^Sharing:/}).click();
    return {state, drop: page.locator(".tunnel-drop")};
}

const fill = async (drop, values) => {
    for (const [label, value] of Object.entries(values)) await drop.getByLabel(label, {exact: true}).fill(value);
};

await runScenarios(process.argv[2], {
    async "a pill that is not connected says so and shows the login"(page, url) {
        const {drop} = await pill(page, url, loggedOut);
        await drop.getByText("Not connected").waitFor({timeout: SHOWN});
        await drop.getByRole("button", {name: "Connect"}).waitFor();
    },
    async "logging in checks the tunnel again, and the pill then says nothing is shared"(page, url) {
        const {state, drop} = await pill(page, url, loggedOut);
        await page.route(LOGIN, (route) => {
            state.logins.push(route.request().postDataJSON());
            state.status = working;
            return reply(route, {connected: true, needs_master: false, error: "", ...working});
        });
        await fill(drop, {"Username": "ann", "Password": "secret-pass"});
        const before = state.checks;
        await drop.getByRole("button", {name: "Connect"}).click();
        await drop.getByText("Nothing shared").waitFor({timeout: SHOWN});
        if (state.checks === before) throw new Error("the pill did not ask for the tunnel's state again after the login");
        if (await drop.getByRole("button", {name: "Connect"}).count()) throw new Error("the login form stayed after connecting");
    },
    async "an unknown account asks for the master password and sends it"(page, url) {
        const {state, drop} = await pill(page, url, loggedOut);
        await page.route(LOGIN, (route) => {
            const sent = route.request().postDataJSON();
            state.logins.push(sent);
            return sent.master_password ? (state.status = working, reply(route, {connected: true, needs_master: false, error: "", ...working})) : reply(route, {connected: false, needs_master: true, error: "", ...loggedOut});
        });
        await fill(drop, {"Username": "ann", "Password": "secret-pass"});
        await drop.getByRole("button", {name: "Connect"}).click();
        await drop.getByText(/No account "ann"/).waitFor({timeout: SHOWN});
        await fill(drop, {"Master password": "master-pass"});
        await drop.getByRole("button", {name: "Create the account"}).click();
        await drop.getByText("Nothing shared").waitFor({timeout: SHOWN});
        if (state.logins.at(-1).master_password !== "master-pass") throw new Error(`the master password was not sent: ${JSON.stringify(state.logins)}`);
    },
    async "a refused login shows the server's words and a failed request shows its message"(page, url) {
        const {drop} = await pill(page, url, loggedOut);
        let answers = [() => ({status: 200, body: {connected: false, needs_master: false, error: "login failed: wrong username or password", ...loggedOut}}), () => ({status: 500, body: {error: "the journal could not run tunler"}})];
        await page.route(LOGIN, (route) => {
            const next = answers.shift()();
            return reply(route, next.body, next.status);
        });
        await fill(drop, {"Username": "ann", "Password": "secret-pass"});
        await drop.getByRole("button", {name: "Connect"}).click();
        await drop.getByText("login failed: wrong username or password").waitFor({timeout: SHOWN});
        await drop.getByRole("button", {name: "Connect"}).click();
        await drop.getByText("the journal could not run tunler").waitFor({timeout: SHOWN});
    },
    async "tunler that is not installed offers to install it, and the pill checks again after"(page, url) {
        const {state, drop} = await pill(page, url, absent);
        await page.route(INSTALL, (route) => ((state.status = loggedOut), (state.installs += 1), reply(route, {installed: true})));
        await drop.getByRole("button", {name: "Install tunler"}).click();
        await drop.getByRole("button", {name: "Connect"}).waitFor({timeout: SHOWN});
        if (!state.installs) throw new Error("the install was never asked for");
    },
    async "an Accept or a Deny the server refuses shows why and leaves the share waiting"(page, url) {
        const doc = numberOf(journal("doc", "create", `Shared ${Date.now()}`, "--brief", "to share"));
        journal("share", "create", `doc:${doc}`);
        const {drop} = await pill(page, url, working);
        await drop.getByText("Needs you").first().waitFor({timeout: SHOWN});
        await page.route(/\/api\/main\/share\/\d+\//, (route) => (route.request().method() === "POST" ? reply(route, {error: "the share could not be changed"}, 500) : route.fallback()));
        await drop.getByRole("button", {name: "Accept"}).first().click();
        await drop.getByText("the share could not be changed").waitFor({timeout: SHOWN});
        await drop.getByRole("button", {name: "Deny"}).first().click();
        await drop.getByText("the share could not be changed").waitFor({timeout: SHOWN});
        await drop.getByRole("button", {name: "Accept"}).first().waitFor();
    },
});
