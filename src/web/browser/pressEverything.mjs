import {readFileSync} from "node:fs";
import {reply, runScenarios} from "./harness.mjs";

const FULL = Boolean(process.env.PRESS_EVERYTHING);
const PAGES = [...readFileSync(new URL("../src/route.js", import.meta.url), "utf8").match(/PAGES = \[([^\]]*)\]/)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const CONTROLS = 'button, [role="button"], [role="switch"], [role="menuitem"], [role="radio"], [role="tab"]';
const PRESSES_PER_PAGE = FULL ? 60 : 8;
const PAGES_AT_ONCE = FULL ? 6 : 3;
const IGNORED_STATUSES = [404, 409];
const CROWD = 5;
const SETTLE_MS = 200;
const BUSY_WAIT_MS = 3000;
const STABLE_MS = 80;
const STABLE_TRIES = 15;
const STATES = ["aria-selected", "aria-checked", "aria-pressed", "aria-current"];

const candidates = (page) =>
    page.evaluate(
        ([selector, states, CROWD]) => {
            const nameOf = (c) => (c.getAttribute("aria-label") || c.title || c.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
            const covered = (c) => {
                c.scrollIntoView({block: "nearest"});
                const box = c.getBoundingClientRect();
                if (!box.width || !box.height) return true;
                const top = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
                return !top || !(c === top || c.contains(top) || top.contains(c));
            };
            const kindOf = (c) => {
                const classes = c.className.toString().replace(/\b(on|active|selected|open|current|busy|gone)\b/g, "").trim().split(/\s+/).slice(0, 2);
                const crowded = c.parentElement && c.parentElement.querySelectorAll(selector).length > CROWD;
                const label = crowded ? "" : nameOf(c).replace(/[0-9]+/g, "");
                return `${c.tagName}|${c.getAttribute("role")}|${classes.join(".")}|${label}|${c.parentElement ? c.parentElement.className.toString().split(/\s+/).slice(0, 2).join(".") : ""}`;
            };
            return [...document.querySelectorAll(selector)].map((c, at) => ({
                at,
                name: nameOf(c),
                kind: kindOf(c),
                usable: c.checkVisibility({visibilityProperty: true}) && !/\s0$/.test(nameOf(c)) && !c.disabled && c.getAttribute("aria-disabled") !== "true" && c.getAttribute("tabindex") !== "-1" && !covered(c),
                set: states.some((state) => c.getAttribute(state) === "true") || /\b(on|active|selected|current)\b/.test(c.className.toString()),
            }));
        },
        [CONTROLS, STATES, CROWD]
    );

const OPENED = '[role="dialog"], [role="menu"], [role="listbox"], [aria-expanded="true"], [class*="panel"], [class*="dialog"], [class*="popover"], [class*="drawer"], [class*="toast"], [class*="notice"]';

const look = (page, control) =>
    page.evaluate(
        ([c, opened]) => {
            const typed = [...document.querySelectorAll("input, textarea, select")].map((field) => field.value).join("\u0001");
            const scrolled = [...document.querySelectorAll("*")].reduce((sum, el) => sum + Math.round(el.scrollTop), 0);
            const own = c.isConnected ? `${c.className}${[...c.attributes].filter((a) => a.name.startsWith("aria-")).map((a) => a.value)}` : "gone";
            const shown = [...document.querySelectorAll(opened)].filter((el) => el.checkVisibility()).length;
            return `${location.hash}|${own}|${shown}|${typed}|${scrolled}|${document.activeElement === c}`;
        },
        [control, OPENED]
    );

async function stable(page, control) {
    let last = await look(page, control);
    for (let tries = 0; tries < STABLE_TRIES; tries++) {
        await page.waitForTimeout(STABLE_MS);
        const now = await look(page, control);
        if (now === last) return now;
        last = now;
    }
    return last;
}

async function press(page, at) {
    const control = (await page.$$(CONTROLS))[at];
    await control.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const before = await stable(page, control);
    await page.evaluate(() => (window.pressedBusy = 0));
    let chooser = false;
    page.once("filechooser", () => (chooser = true));
    await control.click({timeout: 3000});
    await page.mouse.move(0, 0);
    const afterLook = await stable(page, control);
    return {
        requested: (await page.evaluate(() => window.pressedBusy)) > 0,
        moved: chooser || before.replace(/\|true$/, "|false") !== afterLook.replace(/\|true$/, "|false") || /\|gone\|/.test(afterLook),
        stuck: await page.waitForFunction(() => !document.querySelector("[data-busy]"), null, {timeout: BUSY_WAIT_MS}).then(() => false, () => true),
    };
}

async function pressPage(browser, url, route, seen) {
    const context = await browser.newContext({viewport: {width: 1280, height: 900}});
    const page = await context.newPage();
    const name = route || "home";
    page.setDefaultTimeout(15000);
    await page.addInitScript(() => {
        window.pressedBusy = 0;
        document.addEventListener("DOMContentLoaded", () => {
            new MutationObserver((changes) => changes.forEach((change) => change.target.hasAttribute("data-busy") && window.pressedBusy++)).observe(document, {attributes: true, subtree: true, attributeFilter: ["data-busy"]});
        });
    });
    const failures = [];
    page.on("pageerror", (error) => failures.push(`${name}: the page threw "${String(error.message).slice(0, 80)}"`));
    page.on("console", (message) => message.type() === "error" && !/Failed to load resource/.test(message.text()) && failures.push(`${name}: the console reported "${message.text().slice(0, 80)}"`));
    page.on("response", (answer) => {
        const asked = new URL(answer.url());
        if (asked.pathname.startsWith("/api/") && answer.status() >= 400 && !IGNORED_STATUSES.includes(answer.status())) failures.push(`${name}: ${answer.request().method()} ${asked.pathname} answered ${answer.status()}`);
    });
    await page.route(/\/api\/stop$/, (r) => reply(r, {}));
    await page.route((address) => address.origin !== new URL(url).origin, (route) => route.abort());
    await page.goto(`${url}#/main/${route}`);
    await page.waitForSelector(CONTROLS);
    await page.waitForTimeout(SETTLE_MS);
    for (let pressed = 0; pressed < PRESSES_PER_PAGE; pressed++) {
        const next = (await candidates(page)).find((c) => c.usable && !seen.has(c.kind));
        if (!next) break;
        seen.add(next.kind);
        const result = await press(page, next.at).catch(() => null);
        if (!result) continue;
        if (!result.requested && !result.moved && !next.set) failures.push(`${name}: "${next.name}" sent no request and changed nothing`);
        else if (result.stuck) failures.push(`${name}: "${next.name}" stayed busy after the answer`);
        if (result.moved || result.requested) {
            await page.reload();
            await page.waitForSelector(CONTROLS);
            await page.waitForTimeout(SETTLE_MS);
        }
    }
    await context.close();
    return failures;
}

await runScenarios(process.argv[2], {
    async "one control of each kind on every page does something"(page, url) {
        const browser = page.context().browser();
        const chrome = new Set();
        const failures = await pressPage(browser, url, "about", chrome);
        const routes = ["", ...PAGES.filter((route) => route !== "about")];
        const pages = [];
        for (let at = 0; at < routes.length; at += PAGES_AT_ONCE) {
            pages.push(...(await Promise.all(routes.slice(at, at + PAGES_AT_ONCE).map((route) => pressPage(browser, url, route, new Set(chrome))))));
        }
        const all = [...failures, ...pages.flat()];
        if (all.length) throw new Error(all.join("; "));
    },
});
