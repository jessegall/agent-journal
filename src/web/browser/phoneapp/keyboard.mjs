import {runScenarios} from "../harness.mjs";
import {home, PAIR, PHONE, pairedState} from "./paired.mjs";

const state = await pairedState();
const KEYBOARD_LEFT = 480;

const atBottom = (page, scrollTo) =>
    page.evaluate((top) => {
        let el = document.querySelector("[data-hold]");
        while (el && !/auto|scroll/.test(getComputedStyle(el).overflowY)) el = el.parentElement;
        if (top) el.scrollTop = 0;
        return el ? el.scrollHeight - el.clientHeight - el.scrollTop < 4 : false;
    }, scrollTo);

await runScenarios(
    PAIR,
    {
        async "focusing the message box lifts it above the keyboard and scrolls the chat to the bottom"(page) {
            await home(page);
            await page.locator("[data-hold]").first().waitFor();
            await atBottom(page, true);
            await page.waitForTimeout(300);
            const box = page.getByPlaceholder("Message the agent");
            await box.focus();
            await page.setViewportSize({width: PHONE.viewport.width, height: KEYBOARD_LEFT});
            await page.waitForFunction(() => window.visualViewport.height < 500);
            await page.waitForTimeout(300);
            const at = await box.boundingBox();
            if (at.y < 0 || at.y + at.height > KEYBOARD_LEFT) throw new Error(`the message box is at ${at.y}, outside the ${KEYBOARD_LEFT}px left above the keyboard`);
            if (!(await atBottom(page))) throw new Error("the chat is not at the bottom after focusing the message box");
        },
    },
    {voice: false, device: {...PHONE, storageState: state}}
);
