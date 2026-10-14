// @vitest-environment node
import {afterAll, beforeAll, expect, test} from "vitest";
import {existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {chromium} from "playwright-core";
import {createServer} from "vite";

const VOICES = ["butler", "coach", "colleague", "homie", "squire"];
const BROWSERS = ["/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"];
const TIMEOUT = 900_000;
let server, browser, page;

beforeAll(async () => {
    server = await createServer({configFile: false, root: fileURLToPath(new URL("..", import.meta.url)), logLevel: "error", server: {host: "127.0.0.1", port: 0}});
    await server.listen();
    const executablePath = process.env.CHROMIUM_EXECUTABLE || BROWSERS.find(existsSync);
    browser = await chromium.launch({executablePath, headless: true, args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"]});
    page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/tests/figureRead.fixture.html`);
    await page.waitForFunction(() => document.title === "ready");
}, TIMEOUT);

afterAll(async () => {
    await browser?.close();
    await server?.close();
});

for (const voice of VOICES) {
    test(`${voice}: both hands hold the covers and the whole book clears the body in every reading frame`, async () => {
        const measured = await page.evaluate((voice) => window.measureReading(voice), voice);
        expect(measured.poses).toBe(216);
        expect(measured.held).toBe(198);
        expect(measured.maximumGripError).toBeLessThan(0.00001);
        expect(measured.maximumHandCoverGap).toBeLessThan(0.02);
        expect(measured.intersections).toBe(0);
    }, TIMEOUT);
}
