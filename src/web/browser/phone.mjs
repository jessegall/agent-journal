import {reply, runScenarios} from "./harness.mjs";

const SHOWN = 6000;
const ADDRESS = "scratch.tunler.test";
const standing = (problems, more = {}) => ({installed: true, logged_in: true, host: "tunler.test", address: ADDRESS, problems, ...more});
const CODE = {link: `https://${ADDRESS}/s/abc`, short: "ABC-123", address: ADDRESS};

async function opened(page, url, {tunnel, answering = {reachable: false}, connect = CODE}) {
    const sent = [];
    await page.route(/\/api\/main\/share\/tunnel$/, (route) => (tunnel ? reply(route, tunnel) : reply(route, {error: "boom"}, 500)));
    await page.route(/\/api\/main\/share\/answering$/, (route) => reply(route, answering));
    await page.route(/\/api\/main\/phone\/connect$/, (route) => {
        sent.push(route.request().postDataJSON());
        return connect ? reply(route, connect) : reply(route, {error: "no code today"}, 500);
    });
    await page.goto(`${url}#/main`);
    await page.getByTitle("Connect your phone").click();
    return {sent, dialog: page.getByRole("dialog", {name: "Connect your phone"})};
}

async function says(dialog, words, button, within = SHOWN) {
    await dialog.getByText(words).first().waitFor({timeout: within});
    await dialog.getByRole("button", {name: button}).first().waitFor({timeout: within});
}

await runScenarios(process.argv[2], {
    async "tunler absent says so and offers to install it"(page, url) {
        const {dialog} = await opened(page, url, {tunnel: standing(["tunler is not installed"], {installed: false, logged_in: false})});
        await says(dialog, /isn't installed/, /Install/);
    },
    async "tunler present but not running says why and offers the sharing settings"(page, url) {
        const {dialog} = await opened(page, url, {tunnel: standing(["The tunnel to this journal stopped and could not start again."])});
        await says(dialog, /stopped and could not start/, "Open the sharing settings");
    },
    async "a status that fails says so and offers to check again"(page, url) {
        const {dialog} = await opened(page, url, {tunnel: null});
        await says(dialog, /could not|couldn't/i, "Check again");
    },
    async "a tunnel that never answers says so after a few seconds and offers a new code"(page, url) {
        const {dialog} = await opened(page, url, {tunnel: standing([])});
        await dialog.getByText("Opening a secure connection").waitFor({timeout: SHOWN});
        await says(dialog, /did not open/, "New code", 15000);
    },
    async "a tunnel that answers shows the code"(page, url) {
        const {dialog} = await opened(page, url, {tunnel: standing([]), answering: {reachable: true}});
        await dialog.getByText(CODE.short).waitFor({timeout: SHOWN});
    },
    async "a code that cannot be made says why and offers a new code"(page, url) {
        const {dialog} = await opened(page, url, {tunnel: standing([]), connect: null});
        await says(dialog, /no code today/, "New code");
    },
    async "choosing 30 days asks for a code that lasts 30 days"(page, url) {
        const {dialog, sent} = await opened(page, url, {tunnel: standing([]), answering: {reachable: true}});
        await dialog.getByText(CODE.short).waitFor({timeout: SHOWN});
        await dialog.getByRole("radio", {name: "30 days"}).click();
        await new Promise((done) => setTimeout(done, 500));
        if (sent.at(-1).days !== 30) throw new Error(`asked for ${JSON.stringify(sent)}`);
    },
});
