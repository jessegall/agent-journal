import {journal, runScenarios} from "./harness.mjs";
import {throughProxy} from "./proxy.mjs";

const BAND = /server is not answering/;
const STREAM_OPEN = 3000;
const OFFLINE_WAIT = 30000;
const BACK_WAIT = 25000;

await runScenarios(process.argv[2], {
    async "a server that goes away is said so, and the page catches up once it is back"(page, url) {
        const title = `While away ${Date.now()}`;
        const proxy = await throughProxy(url);
        try {
            await page.goto(`${proxy.url}#/main/todo`);
            await page.getByText("Idle").first().waitFor();
            await page.waitForTimeout(STREAM_OPEN);
            await proxy.away();
            journal("todo", "create", title, "--brief", "made while the viewer could not reach the server");
            await page.getByText(BAND).waitFor({timeout: OFFLINE_WAIT});
            if (await page.getByText(title).count()) throw new Error("the page showed a row it could not have been told about");
            await proxy.back();
            await page.getByText(BAND).waitFor({state: "detached", timeout: BACK_WAIT});
            await page.getByText(title).first().waitFor({timeout: BACK_WAIT});
        } finally {
            await proxy.stop();
        }
    },
    async "a hidden page stops asking and a shown page asks again at once"(page, url) {
        const asked = [];
        await page.route(/\/api\/summary/, (route) => (asked.push(Date.now()), route.fallback()));
        await page.goto(`${url}#/main`);
        await page.getByText("Idle").first().waitFor();
        await page.evaluate(() => {
            Object.defineProperty(document, "hidden", {configurable: true, value: true});
            document.dispatchEvent(new Event("visibilitychange"));
        });
        await page.waitForTimeout(500);
        const before = asked.length;
        await page.waitForTimeout(9000);
        if (asked.length !== before) throw new Error(`a hidden page asked ${asked.length - before} more times`);
        await page.evaluate(() => {
            Object.defineProperty(document, "hidden", {configurable: true, value: false});
            document.dispatchEvent(new Event("visibilitychange"));
        });
        await page.waitForTimeout(1500);
        if (asked.length === before) throw new Error("a shown page did not ask again");
    },
});
