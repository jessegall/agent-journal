// @vitest-environment node
import {afterAll, beforeAll, expect, test} from "vitest";
import {existsSync, mkdirSync, writeFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {chromium} from "playwright-core";
import {createServer} from "vite";

const VOICES = ["butler", "coach", "colleague", "homie", "squire"];
const BROWSERS = ["/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"];
const TIMEOUT = 1_800_000;
const BATCH = 8;
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const REPORTS = process.env.FIGURE_REPORT_DIR || fileURLToPath(new URL("../test-results/collisions", import.meta.url));
let server, browser, page;

beforeAll(async () => {
    mkdirSync(REPORTS, {recursive: true});
    server = await createServer({configFile: false, root: ROOT, logLevel: "error", server: {host: "127.0.0.1", port: 0}});
    await server.listen();
    const executablePath = process.env.CHROMIUM_EXECUTABLE || BROWSERS.find(existsSync);
    browser = await chromium.launch({executablePath, headless: true, args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"]});
    page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/tests/figureCollision.fixture.html`);
    await page.waitForFunction(() => document.title === "ready");
}, TIMEOUT);

afterAll(async () => {
    await browser?.close();
    await server?.close();
});

for (const voice of VOICES) {
    test(`${voice}: every clip, posture and frame clears the head and body at both review angles`, async () => {
        const cases = await page.evaluate((voice) => window.collisionCases(voice), voice);
        const report = {voice, expected: cases.length, poses: 0, narrowPhaseChecks: 0, intersections: [], errors: [], complete: false};
        try {
            for (let start = 0; start < cases.length; start += BATCH) {
                const batch = await page.evaluate(({voice, cases}) => window.measureCollisionBatch(voice, cases), {voice, cases: cases.slice(start, start + BATCH)});
                report.poses += batch.poses;
                report.narrowPhaseChecks += batch.narrowPhaseChecks;
                report.intersections.push(...batch.intersections);
                report.errors.push(...batch.errors);
                writeFileSync(`${REPORTS}/${voice}.json`, JSON.stringify(report, null, 2));
            }
            report.complete = true;
        } finally {
            writeFileSync(`${REPORTS}/${voice}.json`, JSON.stringify(report, null, 2));
            await page.evaluate((voice) => window.releaseCollisionFigure(voice), voice);
        }
        expect(report.errors.length, `See ${REPORTS}/${voice}.json`).toBe(0);
        expect(report.poses).toBe(report.expected);
        expect(report.intersections.length, `See ${REPORTS}/${voice}.json`).toBe(0);
    }, TIMEOUT);
}

for (const voice of VOICES) {
    test(`backflip: ${voice} arms and carried props clear the head throughout the flip`, async () => {
        const cases = await page.evaluate((voice) => window.collisionCases(voice).filter((sample) => sample.clip === "backflip"), voice);
        try {
            const report = await page.evaluate(({voice, cases}) => window.measureCollisionBatch(voice, cases), {voice, cases});
            const headCrossings = report.intersections.filter((contact) => contact.secondAttachment === "head_root");
            writeFileSync(`${REPORTS}/${voice}-backflip-head.json`, JSON.stringify({...report, headCrossings}, null, 2));
            expect(cases.length).toBeGreaterThan(0);
            expect(report.errors).toEqual([]);
            expect(report.poses).toBe(cases.length);
            expect(headCrossings).toEqual([]);
        } finally {
            await page.evaluate((voice) => window.releaseCollisionFigure(voice), voice);
        }
    }, TIMEOUT);
}
