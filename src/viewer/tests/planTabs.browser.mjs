import assert from "node:assert/strict";
import http from "node:http";
import {chromium} from "playwright-core";

const [address, socketPath, shots] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
// the viewer key signs one browser in; both widths share its login
const login = await browser.newContext();

async function run(line) {
    const answer = await new Promise((resolve, reject) => {
        const request = http.request({socketPath, path: "/cli", method: "POST"}, (response) => {
            let body = "";
            response.on("data", (chunk) => (body += chunk));
            response.on("end", () => resolve({body, code: response.trailers["journal-exit-code"]}));
        });
        request.on("error", reject);
        request.end(JSON.stringify({argv: line, folder: "/"}));
    });
    assert.equal(answer.code, "0", JSON.stringify(answer));
}

// the plan window at one width: the tab band, its sliding line and the flush cards
async function check(width, height, name) {
    const page = await login.newPage();
    await page.setViewportSize({width, height});
    await page.goto(address);
    await page.locator('.pane-tab:has-text("Plans"), [data-phone-window="plans.plans"]').first().click();
    const band = page.locator("[data-inner-tabs]").first();
    await band.waitFor({timeout: 8000}).catch(async (error) => {
        await page.screenshot({path: `${shots}-failed-${name}.png`});
        throw new Error(`${error.message} PAGE: ${(await page.locator("body").innerText()).slice(-400)}`);
    });
    await page.locator(".plan").first().waitFor();

    const tabs = await band.evaluate((element) => {
        const style = getComputedStyle(element);
        const first = element.querySelector(".inner-tab");
        const chip = element.querySelector("[data-tab-count]");
        return {
            height: element.getBoundingClientRect().height, scrolls: style.overflowX, wraps: style.flexWrap, transform: getComputedStyle(first).textTransform,
            chipRadius: parseFloat(getComputedStyle(chip).borderRadius), label: first.firstChild.textContent.trim(), shown: element.querySelector(".inner-tab.on").getAttribute("data-tab"),
            background: style.backgroundColor, paneBackground: getComputedStyle(document.body).getPropertyValue("--bg-2"),
        };
    });
    assert.equal(tabs.height, 32);
    assert.equal(tabs.scrolls, "auto");
    assert.equal(tabs.wraps, "nowrap");
    assert.equal(tabs.transform, "none");
    assert.equal(tabs.label, "Open");
    assert.ok(tabs.chipRadius >= 8);
    assert.equal(tabs.shown, "open");

    const under = (key) =>
        band.evaluate((element, wanted) => {
            const tab = element.querySelector(`[data-tab="${wanted}"]`).getBoundingClientRect();
            const mark = element.querySelector("[data-tabs-line]").getBoundingClientRect();
            return {left: Math.abs(mark.left - tab.left), width: Math.abs(mark.width - tab.width), height: mark.height, duration: getComputedStyle(element.querySelector("[data-tabs-line]")).transitionDuration};
        }, key);
    const open = await under("open");
    assert.ok(open.left < 1 && open.width < 1 && open.height === 2, JSON.stringify(open));
    await band.locator('[data-tab="closed"]').click();
    const sliding = await under("closed");
    assert.equal(sliding.duration, "0.22s, 0.22s");
    await page.waitForTimeout(400);
    const closed = await under("closed");
    assert.ok(closed.left < 1 && closed.width < 1, JSON.stringify(closed));
    await band.locator('[data-tab="open"]').click();
    await page.locator(".plan").first().waitFor();

    const cards = await page.locator(".plans-grid").evaluate((grid) => {
        const style = getComputedStyle(grid);
        const rows = [...grid.querySelectorAll(".plan")];
        const rects = rows.map((row) => row.getBoundingClientRect());
        return {
            gap: `${style.rowGap} ${style.columnGap}`, padding: style.padding, radius: rows.map((row) => getComputedStyle(row).borderTopLeftRadius),
            heights: [...new Set(rects.map((rect) => Math.round(rect.height)))], right: rows.map((row) => getComputedStyle(row).borderRightWidth),
            bottom: rows.map((row) => getComputedStyle(row).borderBottomWidth), top: rows.map((row) => getComputedStyle(row).borderTopWidth),
            titles: rows.map((row) => getComputedStyle(row.querySelector(".plan-title")).whiteSpace),
            agentsWidth: rows.map((row, at) => Math.round(row.querySelector("[data-plan-agents]").getBoundingClientRect().width - rects[at].width)),
            agentsText: rows.map((row) => row.querySelector("[data-plan-agents]").textContent.trim()),
            gridLeft: grid.getBoundingClientRect().left, roomLeft: grid.closest("[data-window-room]").getBoundingClientRect().left,
            beyond: Math.round(grid.getBoundingClientRect().right - innerWidth),
        };
    });
    assert.deepEqual(cards.radius.filter((value) => value !== "0px"), []);
    assert.ok(cards.gap === "0px 0px" || cards.gap === "normal normal", cards.gap);
    assert.equal(cards.padding, "0px");
    assert.equal(cards.heights.length, 1, JSON.stringify(cards.heights));
    assert.deepEqual([...new Set(cards.right)], ["1px"]);
    assert.deepEqual([...new Set(cards.bottom)], ["1px"]);
    assert.deepEqual([...new Set(cards.top)], ["0px"]);
    assert.deepEqual([...new Set(cards.titles)], ["nowrap"]);
    assert.deepEqual([...new Set(cards.agentsText)], ["No agent assigned"]);
    // the agents row runs across the cell, short of it only by the one line on the cell's right
    assert.deepEqual([...new Set(cards.agentsWidth)], [-1]);
    assert.equal(cards.gridLeft, cards.roomLeft);
    // the plan cards fit the width; the other windows of the page are not this test's
    assert.ok(cards.beyond <= 1, `the cards reach ${cards.beyond}px past the page`);
    await page.screenshot({path: `${shots}-${name}.png`});
    await page.close();
}

try {
    await run(["plan", "make", "Rebuild the process queue inspector so it matches the home screen", "--brief", "Rebuild it", "--environment", "main"]);
    await run(["plan", "make", "Secrets and triggers", "--brief", "Pages", "--environment", "main"]);
    await run(["plan", "make", "Document inspector", "--brief", "Inspector", "--environment", "main"]);
    await check(1440, 900, "wide");
    await check(390, 844, "phone");
} finally {
    await browser.close();
}
