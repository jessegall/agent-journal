import {readFileSync} from "node:fs";
import {reply, runScenarios} from "./harness.mjs";

const PAGES = [...readFileSync(new URL("../src/route.js", import.meta.url), "utf8").match(/PAGES = \[([^\]]*)\]/)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const CONTROLS = 'button, [role="button"], [role="switch"], [role="menuitem"], [role="radio"], [role="tab"]';
const PRESSES_PER_PAGE = 45;
const SETTLE_MS = 250;
const BUSY_WAIT_MS = 3000;
const STABLE_MS = 120;
const STABLE_TRIES = 15;
const STATES = ["aria-selected", "aria-checked", "aria-pressed", "aria-current"];

const candidates = (page) =>
    page.evaluate(
        ([selector, states]) => {
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
                const label = c.getAttribute("role") ? "" : nameOf(c).replace(/[0-9]+/g, "");
                return `${c.tagName}|${c.getAttribute("role")}|${label}|${classes.join(".")}|${c.parentElement ? c.parentElement.className.toString().split(/\s+/).slice(0, 2).join(".") : ""}`;
            };
            return [...document.querySelectorAll(selector)].map((c, at) => ({
                at,
                name: nameOf(c),
                kind: kindOf(c),
                usable: c.checkVisibility({visibilityProperty: true}) && !c.disabled && c.getAttribute("aria-disabled") !== "true" && c.getAttribute("tabindex") !== "-1" && !covered(c),
                set: states.some((state) => c.getAttribute(state) === "true") || /\b(on|active|selected|current)\b/.test(c.className.toString()),
            }));
        },
        [CONTROLS, STATES]
    );

const look = (page) =>
    page.evaluate(() => {
        const typed = [...document.querySelectorAll("input, textarea")].map((field) => field.value).join("\u0001");
        const shape = [...document.body.querySelectorAll("*")].map((el) => `${el.tagName}.${el.className && el.className.toString().replace(/\bbusy\b/g, "")}${["aria-expanded", "aria-checked", "aria-selected", "aria-pressed", "hidden"].map((name) => el.getAttribute(name)).join("")}`).sort().join(" ");
        const scrolled = [...document.querySelectorAll("*")].reduce((sum, el) => sum + Math.round(el.scrollTop), 0);
        return `${location.hash}|${shape}|${typed}|${scrolled}`;
    });

async function stable(page) {
    let last = await look(page);
    for (let tries = 0; tries < STABLE_TRIES; tries++) {
        await page.waitForTimeout(STABLE_MS);
        const now = await look(page);
        if (now === last) return now;
        last = now;
    }
    return last;
}

async function press(page, at) {
    const control = (await page.$$(CONTROLS))[at];
    await control.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const before = await stable(page);
    await page.evaluate(() => (window.pressedBusy = 0));
    let chooser = false;
    page.once("filechooser", () => (chooser = true));
    await control.click({timeout: 3000, force: true});
    await page.mouse.move(0, 0);
    const afterLook = await stable(page);
    return {
        requested: (await page.evaluate(() => window.pressedBusy)) > 0,
        moved: chooser || before !== afterLook,
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
    await page.route(/\/api\/stop$/, (r) => reply(r, {}));
    await page.goto(`${url}#/main/${route}`);
    await page.waitForSelector(CONTROLS);
    await page.waitForTimeout(SETTLE_MS);
    const failures = [];
    for (let pressed = 0; pressed < PRESSES_PER_PAGE; pressed++) {
        const next = (await candidates(page)).find((c) => c.usable && !seen.has(c.kind));
        if (!next) break;
        seen.add(next.kind);
        const hash = await page.evaluate(() => location.hash);
        const result = await press(page, next.at).catch(() => null);
        if (!result) continue;
        if (!result.requested && !result.moved && !next.set) failures.push(`${name}: "${next.name}" sent no request and changed nothing`);
        else if (result.stuck) failures.push(`${name}: "${next.name}" stayed busy after the answer`);
        await page.keyboard.press("Escape");
        if (new URL(page.url()).hash !== hash) await page.goto(`${url}${hash}`);
    }
    await context.close();
    return failures;
}

await runScenarios(process.argv[2], {
    async "one control of each kind on every page does something"(page, url) {
        const browser = page.context().browser();
        const chrome = new Set();
        const failures = await pressPage(browser, url, "about", chrome);
        const pages = await Promise.all(["", ...PAGES.filter((route) => route !== "about")].map((route) => pressPage(browser, url, route, new Set(chrome))));
        const all = [...failures, ...pages.flat()];
        if (all.length) throw new Error(all.join("; "));
    },
});
