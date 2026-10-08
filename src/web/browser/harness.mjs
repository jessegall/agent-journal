import {execFileSync} from "node:child_process";
import {chromium} from "playwright-core";
import {tmpdir} from "node:os";
import {join} from "node:path";

const FIRST_CHOICE_WAIT = 8000;
const LOCAL = /^http:\/\/(127\.0\.0\.1|localhost)[:/]/;

const JOURNAL_WAIT = 60000;

const isOutside = (address) => !LOCAL.test(address.href);

export const reply = (route, body, status = 200) => route.fulfill({status, contentType: "application/json", body: JSON.stringify(body)});

async function chooseVoice(browser, url) {
    const page = await browser.newPage();
    await page.route(isOutside, (route) => route.abort());
    await page.goto(url);
    const keep = page.getByRole("button", {name: "Keep Butler"});
    if (await keep.waitFor({timeout: FIRST_CHOICE_WAIT}).then(() => true, () => false)) await keep.click();
    await page.getByRole("dialog", {name: "How should the agent talk to you?"}).waitFor({state: "detached", timeout: FIRST_CHOICE_WAIT});
    await page.close();
}

export async function runScenarios(url, scenarios, {voice = true, device = {}} = {}) {
    const browser = await chromium.launch();
    if (voice) await chooseVoice(browser, url);
    const failures = {};
    try {
        for (const [name, scenario] of Object.entries(scenarios)) {
            const context = await browser.newContext({viewport: {width: 1280, height: 900}, ...device});
            const page = await context.newPage();
            page.setDefaultTimeout(15000);
            await page.route(isOutside, (route) => route.abort());
            try {
                await scenario(page, url);
            } catch (error) {
                const picture = join(tmpdir(), `scenario-${Date.now()}.png`);
                await page.screenshot({path: picture}).catch(() => {});
                failures[name] = `${String(error.message).split("\n").slice(0, 4).join(" ")} (the page at that moment: ${picture})`;
            }
            await context.close();
        }
    } finally {
        await browser.close();
    }
    console.log(JSON.stringify(failures));
}

export function journal(...words) {
    const root = process.env.JOURNAL_SCRATCH_ROOT;
    const asked = new URL("api/run", process.env.JOURNAL_SCRATCH_URL);
    asked.searchParams.set("env", "main");
    asked.searchParams.set("cwd", `${root}/..`);
    const reply = execFileSync("curl", ["-s", "-m", String(JOURNAL_WAIT / 1000), "-w", "\n%{http_code}", "-H", "Content-Type: text/plain", "--data-binary", "@-", asked.href], {
        input: words.join("\0"),
        encoding: "utf8",
        timeout: JOURNAL_WAIT,
    });
    const status = reply.slice(reply.lastIndexOf("\n") + 1);
    const body = reply.slice(0, reply.lastIndexOf("\n"));
    if (status === "200") return body;
    if (status !== "409") throw new Error(`journal ${words.join(" ")} was refused with ${status}: ${body}`);
    return execFileSync(process.env.JOURNAL_PYTHON, [`${root}/journal.py`, "--root", root, "--env", "main", ...words], {
        cwd: `${root}/..`,
        encoding: "utf8",
        timeout: JOURNAL_WAIT,
        env: {...process.env, AGENT_JOURNAL_BOOTSTRAPPED: "1"},
    });
}

export const numberOf = (output) => JSON.parse(output.slice(output.indexOf("{"), output.indexOf("\n}") + 2)).n;

export const shot = (page, name) => (process.env.SHOT_DIR ? page.screenshot({path: `${process.env.SHOT_DIR}/${name}.png`}) : null);

export async function drag(page, source, target) {
    await source.scrollIntoViewIfNeeded();
    const from = await source.boundingBox();
    const to = await target.boundingBox();
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(from.x + from.width / 2 + 10, from.y + from.height / 2 + 10, {steps: 5});
    await page.mouse.move(to.x + to.width / 2, to.y + Math.min(to.height / 2, 200), {steps: 15});
    await page.mouse.up();
}
