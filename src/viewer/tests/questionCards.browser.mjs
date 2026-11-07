import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, shots] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
// the viewer key signs one browser in; both widths share its login
const login = await browser.newContext();

// the questions window at one width: each question one block edge to edge with a banner in --bg-2, a band of space between blocks, options as rows, the foot band wrapping and the Answered label on one line
async function check(width, height, name) {
    const page = await login.newPage();
    await page.setViewportSize({width, height});
    await page.goto(address);
    await page.locator('.pane-tab:has-text("Questions"), [data-phone-window="questions.questions"]').first().click();
    await page.locator("[data-question-card].flush").first().waitFor();
    await page.waitForTimeout(400);

    const blocks = await page.locator("[data-question-card].flush").evaluateAll((cards) => {
        const lines = (node) => {
            const range = document.createRange();
            range.selectNodeContents(node);
            return new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size;
        };
        const banner = (card) => card.querySelector(".question-head");
        return {
            banners: cards.every((card) => getComputedStyle(banner(card)).backgroundColor !== getComputedStyle(card).backgroundColor && banner(card).querySelectorAll("[data-question-dot]").length === 1),
            bannerOnTop: cards.every((card) => card.children[0] === banner(card) && banner(card).getBoundingClientRect().top - card.getBoundingClientRect().top < 2),
            gaps: cards.slice(1).map((card, index) => Math.round(card.getBoundingClientRect().top - cards[index].getBoundingClientRect().bottom)),
            labelLines: [...document.querySelectorAll(".question-answered")].map(lines),
            labelFlex: [...document.querySelectorAll(".question-answered")].map((label) => getComputedStyle(label).flexGrow + getComputedStyle(label).flexShrink + getComputedStyle(label).whiteSpace),
        };
    });
    assert.ok(blocks.labelLines.length >= 1, "an answered question shows in the window");
    assert.ok(blocks.banners && blocks.bannerOnTop, "each block starts with a darker banner holding one dot");
    assert.ok(blocks.gaps.every((gap) => gap >= 12), `a band of space separates the blocks: ${blocks.gaps}`);
    assert.ok(blocks.labelLines.every((count) => count === 1), `the Answered label stays on one line: ${blocks.labelLines}`);
    assert.ok(blocks.labelFlex.every((flex) => flex === "00nowrap"), `the Answered label does not grow, shrink or wrap: ${blocks.labelFlex}`);

    const facts = await page.locator('[data-question-card].flush[data-state="open"]').first().evaluate((card) => {
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
            buttonsInside: buttons.every((button) => button.right <= foot.right && button.left >= foot.left), textFits: text.scrollWidth <= text.clientWidth + 1, contextFits: card.querySelector("[data-question-context]").scrollWidth <= card.clientWidth, buttonLines: new Set(buttons.map((button) => Math.round(button.top))).size,
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
    assert.deepEqual(facts.border, ["1px", "1px", "0px"]);
    assert.equal(facts.radius, "0px");
    assert.equal(facts.maxWidth, "none");
    assert.ok(facts.rowsFull && facts.rowCount >= 2, "the options run edge to edge");
    assert.ok(facts.ring && facts.chip === "Recommended");
    assert.ok(facts.footFull && facts.buttonsInside, "the foot band holds its buttons");
    assert.ok(facts.textFits, "the whole question text shows");
    assert.ok(facts.contextFits, "the whole context shows");
    for (const scheme of ["dark", "light"]) {
        await page.emulateMedia({colorScheme: scheme});
        const lines = await page.locator('[data-question-card].flush[data-state="open"]').first().evaluate((card) => {
            const strength = (color, ground) => Math.abs(color.match(/\d+/g).slice(0, 3).reduce((sum, part) => sum + Number(part), 0) - ground.match(/\d+/g).slice(0, 3).reduce((sum, part) => sum + Number(part), 0));
            const ground = getComputedStyle(card).backgroundColor;
            const colorOf = (selector, side) => getComputedStyle(card.querySelector(selector))[`border${side}Color`];
            return {
                between: strength(getComputedStyle(card).borderTopColor, ground),
                inner: [strength(colorOf(".question-head", "Bottom"), ground), strength(colorOf(".question-options", "Top"), ground), strength(colorOf(".question-form", "Top"), ground)],
            };
        });
        assert.ok(lines.inner.every((inner) => inner < lines.between), `in the ${scheme} theme the lines inside the block are fainter than the line between blocks: ${JSON.stringify(lines)}`);
    }
    await page.emulateMedia({colorScheme: "dark"});
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
