import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, mainId, helperId, endedId, shots] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
// the viewer key signs one browser in; every width and agent shares its login
const login = await browser.newContext();

// one agent's inspector at one width, including the action band and scrolling area
async function check(id, width, height, name, expectedTitle, ended) {
    const page = await login.newPage();
    await page.setViewportSize({width, height});
    await page.goto(`${address}#open=agents:${id}`);
    const panel = page.locator("[data-resource-panel]");
    await panel.locator("[data-agent-inspector]").waitFor();
    await panel.locator("[data-agent-strip]").waitFor();
    await page.waitForTimeout(500);

    const facts = await panel.evaluate((element) => {
        const box = (selector) => element.querySelector(selector)?.getBoundingClientRect();
        const cells = [...element.querySelectorAll("[data-agent-cell]")].map((cell) => Math.round(cell.getBoundingClientRect().top));
        const scroll = element.querySelector(".scroll");
        return {
            width: Math.round(element.getBoundingClientRect().width), title: element.querySelector("[data-resource-title]").textContent, top: Math.round(box(".top").height),
            lines: new Set(cells).size, cellCount: cells.length, scrolls: getComputedStyle(scroll).overflowY,
            actionsTop: box("[data-agent-actions]")?.top, actionsBottom: box("[data-agent-actions]")?.bottom,
            topBottom: box(".top").bottom, scrollTop: scroll.getBoundingClientRect().top, overflow: scroll.scrollWidth - scroll.clientWidth,
            alignment: element.querySelector("[data-agent-actions]") ? getComputedStyle(element.querySelector("[data-agent-actions]")).justifyContent : "",
            bands: [...element.querySelectorAll("h2.band, [data-agent-fold]")].map((band) => band.textContent.replace(/\d+$/, "").trim()), moves: [...element.querySelectorAll("[data-agent-actions] [data-move]")].map((move) => move.dataset.move),
            ended: element.querySelector("[data-agent-ended]")?.textContent ?? "", name: element.querySelector(".name").textContent.trim(),
        };
    });
    assert.equal(facts.title, expectedTitle);
    assert.ok(facts.width === Math.min(600, width), `the panel is ${facts.width} wide`);
    assert.equal(facts.top, 34);
    assert.equal(facts.scrolls, "auto");
    if (!ended) {
        assert.ok(Math.abs(facts.actionsTop - facts.topBottom) <= 1 && Math.abs(facts.scrollTop - facts.actionsBottom) <= 1);
        assert.equal(facts.alignment, "flex-end");
    } else assert.equal(facts.actionsTop, undefined);
    assert.ok(facts.overflow <= 0, `the middle overflows sideways by ${facts.overflow}`);
    assert.deepEqual(facts.bands.slice(0, 2), ["Doing now", "Recent"]);
    assert.deepEqual(facts.bands.slice(-3), ["Helpers", "Skills loaded", "Details"]);
    if (ended) assert.ok(facts.ended.startsWith("Ended") && facts.moves.length === 0);
    else assert.ok(facts.moves.includes("pause") && facts.moves.includes("stop"));
    if (facts.cellCount * 100 > width) assert.ok(facts.lines > 1, "the strip wraps when its cells do not fit in one line");
    await page.locator("[data-agent-fold]", {hasText: "Details"}).click();
    const labels = await panel.locator("[data-agent-detail] .label").allTextContents();
    assert.ok(labels.every((label) => /^[A-Z][a-z ]+:$/.test(label)), JSON.stringify(labels));
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await page.screenshot({path: `${shots}-${name}-${width}-${colorScheme}.png`});
    }
    await page.close();
}

try {
    for (const [width, height] of [[1440, 900], [390, 844]]) {
        await check(mainId, width, height, "main", "Main agent", false);
        await check(helperId, width, height, "helper", `Worker ${helperId}`, false);
        await check(endedId, width, height, "ended", `Worker ${endedId}`, true);
    }
} finally {
    await browser.close();
}
