import {journal, runScenarios} from "./harness.mjs";
import {throughProxy} from "./proxy.mjs";

const BAND = /server is not answering/;
const OFFLINE_WAIT = 30000;
const BACK_WAIT = 25000;

await runScenarios(process.argv[2], {
    async "a server that goes away is said so, and the page catches up once it is back"(page, url) {
        const title = `While away ${Date.now()}`;
        const proxy = await throughProxy(url);
        try {
            const streamOpen = page.waitForResponse(/\/stream/);
            await page.goto(`${proxy.url}#/main/todo`);
            await page.getByText("Idle").first().waitFor();
            await streamOpen;
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
        await page.addInitScript(() => {
            const fetched = window.fetch;
            window.summaryAsks = 0;
            window.fetch = (resource, ...rest) => (String(resource.url ?? resource).includes("/api/summary") && window.summaryAsks++, fetched(resource, ...rest));
        });
        const asked = () => page.evaluate(() => window.summaryAsks);
        await page.clock.install();
        await page.goto(`${url}#/main`);
        await page.getByText("Idle").first().waitFor();
        await page.evaluate(() => {
            Object.defineProperty(document, "hidden", {configurable: true, value: true});
            document.dispatchEvent(new Event("visibilitychange"));
        });
        await page.clock.runFor(500);
        const before = await asked();
        await page.clock.runFor(9000);
        const after = await asked();
        if (after !== before) throw new Error(`a hidden page asked ${after - before} more times`);
        const askedAgain = page.waitForRequest(/\/api\/summary/, {timeout: 1500});
        await page.evaluate(() => {
            Object.defineProperty(document, "hidden", {configurable: true, value: false});
            document.dispatchEvent(new Event("visibilitychange"));
        });
        await askedAgain.catch(() => {
            throw new Error("a shown page did not ask again");
        });
    },
});
