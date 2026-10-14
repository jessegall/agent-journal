// @vitest-environment node
import {afterAll, beforeAll, expect, test} from "vitest";
import {existsSync, mkdirSync, writeFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {chromium} from "playwright-core";
import {createServer} from "vite";
import {JOINT_STEP_DEGREES} from "../src/figure/blend.js";

const VOICES = ["butler", "coach", "colleague", "homie", "squire"];
const BROWSERS = ["/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"];
const TIMEOUT = 1_800_000;
const PRECISION = 0.00001;
const REPORTS = fileURLToPath(new URL("../test-results/round-three", import.meta.url));
let server, browser, page;

beforeAll(async () => {
    mkdirSync(REPORTS, {recursive: true});
    server = await createServer({configFile: false, root: fileURLToPath(new URL("..", import.meta.url)), logLevel: "error", server: {host: "127.0.0.1", port: 0}});
    await server.listen();
    browser = await chromium.launch({executablePath: process.env.CHROMIUM_EXECUTABLE || BROWSERS.find(existsSync), headless: true, args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"]});
    page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/tests/figureCollision.fixture.html`);
    await page.waitForFunction(() => document.title === "ready");
}, TIMEOUT);

afterAll(async () => {
    await browser?.close();
    await server?.close();
});

for (const voice of VOICES) {
    test(`${voice}: new poses reach pages, keep their tools, and blend without a joint snap`, async () => {
        const report = await page.evaluate((voice) => window.measureRoundThree(voice), voice);
        writeFileSync(`${REPORTS}/${voice}.json`, JSON.stringify(report, null, 2));
        expect(report.errors).toEqual([]);
        expect(report.gazeRays).toBe(576);
        expect(report.gazeMisses).toEqual([]);
        expect(report.nibs).toBeGreaterThan(0);
        expect(report.maximumNibError).toBeLessThan(PRECISION);
        expect(report.nativePropConflicts).toEqual([]);
        expect(report.maximumJointDegrees).toBeLessThanOrEqual(JOINT_STEP_DEGREES + PRECISION);
        await page.evaluate((voice) => window.releaseCollisionFigure(voice), voice);
    }, TIMEOUT);
}
