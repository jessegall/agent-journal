import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, shots] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
// the viewer key signs one browser in; both widths share its login
const login = await browser.newContext();

// the questions window at one width: cards edge to edge with no box, a line below each, options as rows, the foot band wrapping
async function check(width, height, name) {
    const page = await login.newPage();
    await page.setViewportSize({width, height});
    await page.goto(address);
    await page.locator('.pane-tab:has-text("Questions"), [data-phone-window="questions.questions"]').first().click();
    await page.locator("[data-question-card].flush").first().waitFor();
    await page.waitForTimeout(400);

    const facts = await page.locator("[data-question-card].flush").first().evaluate((card) => {
        const style = getComputedStyle(card);
        const window = card.closest("[data-window-room]").getBoundingClientRect();
        const box = card.getBoundingClientRect();
        const rows = [...card.querySelectorAll("[data-question-option]")].map((option) => option.getBoundingClientRect());
        const foot = card.querySelector(".question-form").getBoundingClientRect();
        const buttons = [...card.querySelectorAll(".question-buttons button")].map((button) => button.getBoundingClientRect());
        const text = card.querySelector("[data-question-open]");
        return {
            left: Math.round(box.left - window.left), right: Math.round(window.right - box.right), border: [style.borderTopWidth, style.borderBottomWidth, style.borderLeftWidth], radius: style.borderTopLeftRadius,
            maxWidth: style.maxWidth, background: style.backgroundColor, rowsFull: rows.every((row) => Math.round(row.width) === Math.round(box.width)), rowCount: rows.length,
            ring: Boolean(card.querySelector(".question-ring")), chip: card.querySelector(".question-chip")?.textContent ?? "", footFull: Math.round(foot.width) === Math.round(box.width),
            buttonsInside: buttons.every((button) => button.right <= foot.right && button.left >= foot.left), textFits: text.scrollWidth <= text.clientWidth + 1, buttonLines: new Set(buttons.map((button) => Math.round(button.top))).size,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            chain: (() => {
                const found = [];
                for (let node = card.parentElement; node && found.length < 8; node = node.parentElement) found.push(`${node.tagName}.${node.className} left ${Math.round(node.getBoundingClientRect().left)} pad ${getComputedStyle(node).paddingLeft} margin ${getComputedStyle(node).marginLeft}`);
                return found;
            })(),
        };
    });
    assert.equal(facts.left, 0, JSON.stringify(facts.chain));
    assert.ok(facts.right <= 1, `the card stops ${facts.right}px short of the window`);
    assert.deepEqual(facts.border, ["0px", "1px", "0px"]);
    assert.equal(facts.radius, "0px");
    assert.equal(facts.maxWidth, "none");
    assert.ok(facts.rowsFull && facts.rowCount >= 2, "the options run edge to edge");
    assert.ok(facts.ring && facts.chip === "Recommended");
    assert.ok(facts.footFull && facts.buttonsInside, "the foot band holds its buttons");
    assert.ok(facts.textFits, "the whole question text shows");
    await page.screenshot({path: `${shots}-${name}.png`});
    await page.close();
    return facts;
}

try {
    await check(1440, 900, "wide");
    const phone = await check(390, 844, "phone");
    assert.ok(phone.buttonLines >= 1);
} finally {
    await browser.close();
}
