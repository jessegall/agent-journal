import http from "node:http";
import {journal, reply, runScenarios} from "./harness.mjs";

const ADDRESS = "The server's address";

function serverAnswering(status, body) {
    const server = http.createServer((request, answer) => {
        answer.writeHead(status, {"Content-Type": "application/json"});
        answer.end(JSON.stringify(body));
    });
    return new Promise((done) => server.listen(0, "127.0.0.1", () => done({server, address: `http://127.0.0.1:${server.address().port}`})));
}

async function closedPort() {
    const {server, address} = await serverAnswering(200, {});
    await new Promise((done) => server.close(done));
    return address;
}

async function connectTo(page, url, address) {
    journal("feature", "switch", "connection");
    await page.goto(`${url}#/main/settings?q=${encodeURIComponent(ADDRESS)}`);
    const field = page.getByRole("textbox", {name: ADDRESS});
    await field.waitFor({timeout: 30000});
    const saved = page.waitForResponse((answer) => answer.request().method() === "POST" && /\/api\/main\/settings$/.test(answer.url()));
    await field.fill(address);
    await field.press("Enter");
    await saved;
}

async function noticeShown(page, url, title) {
    await page.goto(`${url}#/main/chat`);
    await page.getByText(title).first().waitFor({timeout: 20000}).catch(() => {
        throw new Error(`the page never showed the notice "${title}"`);
    });
}

async function openCard(page, url) {
    await page.goto(`${url}#/main/settings`);
    await page.getByRole("tab", {name: "Sharing"}).click();
    await page.getByText("Connection to a server").first().waitFor({timeout: 30000});
}

const hello = (more) => ({version: "2.265.0", protocol: 1, migrations: [], epoch: 0, machine: "server-1", ...more});

await runScenarios(process.argv[2], {
    async "an address nobody answers at is told as a notice that the connection could not be made"(page, url) {
        await connectTo(page, url, await closedPort());
        await noticeShown(page, url, "Could not connect to the server");
    },
    async "a server that asks for a newer copy than this one is told as a refusal that this copy is too old"(page, url) {
        const {server, address} = await serverAnswering(200, hello({oldest: 99}));
        try {
            await connectTo(page, url, address);
            await noticeShown(page, url, "Could not connect to the server");
            await page.getByText(/too old/).first().waitFor({timeout: 20000}).catch(() => {
                throw new Error("the notice did not say this copy is too old");
            });
        } finally {
            server.close();
        }
    },
    async "a server on a newer release is told as a notice that this copy is not in step with it"(page, url) {
        const {server, address} = await serverAnswering(200, hello({version: "99.0.0", migrations: ["m9999_something_new"]}));
        try {
            await connectTo(page, url, address);
            await noticeShown(page, url, "This copy is not in step with the server");
        } finally {
            server.close();
        }
    },
    async "a server that has been taken down is told as a notice that says it was taken down"(page, url) {
        const {server, address} = await serverAnswering(503, {});
        try {
            await connectTo(page, url, address);
            await noticeShown(page, url, "Could not connect to the server");
            await page.getByText(/taken down/).first().waitFor({timeout: 20000}).catch(() => {
                throw new Error("the notice did not say the server was taken down");
            });
        } finally {
            server.close();
        }
    },
    async "the connection card tells what connecting would send before anything is sent"(page, url) {
        journal("feature", "switch", "connection");
        const sent = [];
        await page.route(/\/api\/main\/environment\/connection$/, (route) =>
            reply(route, {address: "", connected: false, release: "", step: "", travels: {files: 214, bytes: 1363148, environments: ["a", "b", "c"]}})
        );
        await page.route(/\/api\/main\/environment\/connect$/, (route) => {
            sent.push(route.request().url());
            reply(route, "connected");
        });
        await openCard(page, url);
        await page.getByText("Connecting sends 214 files (1.3 MB) from 3 environments.").waitFor();
        if (sent.length) throw new Error("something was sent to the server before the person pressed Connect");
        if (!(await page.getByRole("button", {name: "Connect", exact: true}).isDisabled())) throw new Error("Connect was open with no address typed");
    },
    async "a server connected from the card is shown as connected and can be disconnected"(page, url) {
        journal("feature", "switch", "connection");
        let state = {address: "", connected: false, release: "", step: "", travels: {files: 3, bytes: 900, environments: ["main"]}};
        await page.route(/\/api\/main\/environment\/connection$/, (route) => reply(route, state));
        await page.route(/\/api\/main\/environment\/connect$/, (route) => {
            state = {...state, address: "https://journal.example.com", connected: true, release: "same", step: "in step"};
            reply(route, "connected");
        });
        await page.route(/\/api\/main\/environment\/disconnect$/, (route) => {
            state = {...state, address: "", connected: false, release: "", step: ""};
            reply(route, "disconnected");
        });
        await openCard(page, url);
        await page.getByRole("textbox", {name: "Server address"}).fill("https://journal.example.com");
        await page.getByRole("button", {name: "Connect", exact: true}).click();
        await page.getByText("In step with the server.").waitFor();
        await page.getByRole("button", {name: "Disconnect"}).click();
        await page.getByText(/Not connected/).waitFor();
    },
});
