import {reply, runScenarios} from "./harness.mjs";

const API = /\/api\//;
const shell = (page) => page.locator(".viewer").waitFor();
const error = async (page, wanted) => {
    await page.getByRole("button", {name: "Retry"}).waitFor();
    const text = await page.locator(".home-loading").innerText();
    if (!wanted.test(text)) throw new Error(`the error page says ${JSON.stringify(text)}`);
};

await runScenarios(process.argv[2], {
    async "the first open lands in the project's environment"(page, url) {
        await page.goto(url);
        await shell(page);
        await page.waitForFunction(() => location.hash === "#/main");
    },
    async "an unknown environment still opens the app"(page, url) {
        await page.goto(`${url}#/nosuchenv`);
        await shell(page);
    },
    async "a server that is down shows an error page, and Retry opens the app once it is back"(page, url) {
        await page.route(API, (route) => route.abort());
        await page.goto(url);
        await error(page, /\S/);
        await page.unroute(API);
        await page.getByRole("button", {name: "Retry"}).click();
        await shell(page);
    },
    async "a failing manifest shows an error page with Retry"(page, url) {
        await page.route(/\/api\/manifest/, (route) => reply(route, {error: "boom"}, 500));
        await page.goto(url);
        await error(page, /\S/);
    },
    async "a server killed after the manifest shows an error page"(page, url) {
        await page.route(/\/api\/(identity|pages)/, (route) => route.abort());
        await page.goto(url);
        await error(page, /\S/);
    },
    async "a server that never answers says it is taking too long"(page, url) {
        await page.clock.install();
        await page.route(API, () => {});
        await page.goto(url);
        await page.clock.runFor(60000);
        await error(page, /taking too long/);
    },
});
