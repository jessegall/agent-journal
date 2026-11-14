import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const SERVICE = '[data-plugin-service="served answers"]';
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage();
    for (const width of [1280, 390]) {
        await page.setViewportSize({width, height: 900});
        await page.goto(`${address}&windows=plugins.plugins`);
        const window = page.locator('[data-window="plugins.plugins"]');
        const service = window.locator(`${SERVICE}:not([disabled])`);
        await service.waitFor();
        const boxes = await service.evaluate((button) => {
            const name = button.querySelector(".service-name").getBoundingClientRect();
            const state = button.querySelector(".service-state");
            const stateBox = state.getBoundingClientRect();
            return {
                nameBottom: name.bottom, nameLeft: name.left, stateTop: stateBox.top, stateLeft: stateBox.left,
                stateHeight: stateBox.height, lineHeight: parseFloat(getComputedStyle(state).lineHeight) || stateBox.height,
                stateWrap: getComputedStyle(state).whiteSpace, buttonOverflows: button.scrollWidth > button.clientWidth,
                pageOverflows: document.documentElement.scrollWidth > innerWidth,
            };
        });
        assert.ok(boxes.nameBottom <= boxes.stateTop + 1, `the label sits above the text at ${width}px: ${JSON.stringify(boxes)}`);
        assert.ok(Math.abs(boxes.nameLeft - boxes.stateLeft) < 2, `the label and the text start together at ${width}px: ${JSON.stringify(boxes)}`);
        assert.equal(boxes.stateWrap, "nowrap");
        assert.ok(boxes.stateHeight < boxes.lineHeight * 1.5, `the text stays on one line at ${width}px: ${JSON.stringify(boxes)}`);
        assert.equal(boxes.buttonOverflows, false, `the service does not overflow at ${width}px`);
        assert.equal(boxes.pageOverflows, false, `the page does not overflow at ${width}px`);
        assert.equal(await window.locator("[data-plugin-service-terminal]").count(), 0);
        await service.click();
        const terminal = page.locator("[role=dialog] [data-plugin-service-terminal]");
        await terminal.waitFor();
        await terminal.getByText("answers service ready").waitFor();
        assert.equal(await terminal.evaluate((element) => element.scrollWidth > element.clientWidth), false, `the terminal does not overflow at ${width}px`);
        const heights = await terminal.evaluate((element) => ({
            terminal: element.getBoundingClientRect().height, body: element.closest(".dialog-body").getBoundingClientRect().height,
            bar: element.querySelector("[data-plugin-service-bar]").getBoundingClientRect().height, log: element.querySelector("pre.output-lines").getBoundingClientRect().height,
        }));
        assert.ok(Math.abs(heights.terminal - heights.body) < 2, `the terminal fills its dialog at ${width}px: ${JSON.stringify(heights)}`);
        assert.ok(Math.abs(heights.bar + heights.log - heights.terminal) < 2, `the log fills what the bar leaves at ${width}px: ${JSON.stringify(heights)}`);
        if (width === 1280) {
            const bar = terminal.locator("[data-plugin-service-bar]");
            await terminal.locator('[data-plugin-service-action="stop"]').click();
            await bar.getByText("Stopped").waitFor();
            await terminal.locator('[data-plugin-service-action="start"]').click();
            await bar.getByText("Running").waitFor();
        }
        await page.mouse.click(4, 4);
        await terminal.waitFor({state: "detached"});
    }
} finally {
    await browser.close();
}
