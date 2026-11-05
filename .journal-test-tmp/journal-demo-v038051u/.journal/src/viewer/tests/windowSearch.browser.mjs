import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture, agent] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 600}});
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const [name, placeholder, selector, words] of [
        ["tasks.tasks", "Search the tasks", "[data-row]", "Search task 29"],
        ["questions.questions", "Search the questions", "[data-question-card]", "Search question 29"],
        ["coding.file-feed", "Filter files", ".diff-card", "search_29"],
    ]) {
        await page.goto(name === "coding.file-feed" ? `${address}&agent=${agent}` : `${address}&windows=${name}`);
        const window = page.locator(`[data-window="${name}"]`);
        const input = window.locator("[data-search-input]");
        await input.waitFor();
        assert.equal(await input.getAttribute("placeholder"), placeholder);
        await window.getByText(name === "coding.file-feed" ? "search_29.py" : words + (name === "questions.questions" ? "?" : ""), {exact: true}).first().waitFor();
        const bar = window.locator("[data-search-bar]");
        const before = await bar.boundingBox();
        const pane = await window.locator('xpath=ancestor::*[contains(concat(" ", normalize-space(@class), " "), " pane-body ")]').boundingBox();
        if (name === "questions.questions") {
            assert.ok(Math.abs(before.x - pane.x) < 1 && Math.abs(before.width - pane.width) < 1, JSON.stringify({before, pane}));
            assert.ok(Math.abs(before.y - pane.y) < 1, JSON.stringify({before, pane}));
        }
        const style = await bar.evaluate((element) => ({position: getComputedStyle(element).position, border: getComputedStyle(element).borderBottomWidth}));
        assert.equal(style.position, "sticky");
        assert.equal(style.border, "1px");
        await window.evaluate((element) => {
            const pane = element.querySelector(".auto-scroll-pane") || element.closest(".pane-body");
            pane.scrollTop = pane.scrollHeight;
            pane.dispatchEvent(new Event("scroll"));
        });
        const after = await bar.boundingBox();
        const top = await window.evaluate((element) => element.closest(".pane-body").getBoundingClientRect().top);
        assert.ok(Math.abs(after.y - top) < 2 && after.y <= before.y + 1, JSON.stringify({name, before, after, top}));
        await input.fill(words);
        await page.waitForFunction(({name, words, selector}) => {
            const window = document.querySelector(`[data-window="${name}"]`);
            return window.querySelectorAll(selector).length === 1 && window.textContent.includes(words);
        }, {name, words, selector});
        await page.screenshot({path: `${capture}-${name}.png`, fullPage: true});
    }
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
