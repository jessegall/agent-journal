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
            await page
                .waitForFunction((left) => {
                    const at = document.querySelector('[placeholder="Message the agent"]').getBoundingClientRect();
                    return at.top >= 0 && at.bottom <= left;
                }, KEYBOARD_LEFT, {timeout: 3000})
                .catch(() => null);
            const at = await box.boundingBox();
            if (at.y < 0 || at.y + at.height > KEYBOARD_LEFT) throw new Error(`the message box is at ${at.y}, outside the ${KEYBOARD_LEFT}px left above the keyboard`);
            if (!(await atBottom(page))) throw new Error("the chat is not at the bottom after focusing the message box");
        },
        async "the chat opens at the newest message, however much is new since the last look"(page) {
            await home(page);
            await page.locator("[data-hold]").first().waitFor();
            await page.evaluate(() => {
                for (const name of Object.keys(localStorage)) if (name.startsWith("phone-looked:")) localStorage.setItem(name, "1");
            });
            await home(page);
            await page.locator("[data-hold]").first().waitFor();
            await page.waitForFunction(() => {
                let el = document.querySelector("[data-hold]");
                while (el && !/auto|scroll/.test(getComputedStyle(el).overflowY)) el = el.parentElement;
                return el && el.scrollHeight > el.clientHeight * 1.5 && el.scrollHeight - el.clientHeight - el.scrollTop < 4;
            }, null, {timeout: 3000}).catch(() => null);
            const tall = await page.evaluate(() => {
                let el = document.querySelector("[data-hold]");
                while (el && !/auto|scroll/.test(getComputedStyle(el).overflowY)) el = el.parentElement;
                return el ? el.scrollHeight > el.clientHeight * 1.5 : false;
            });
            if (!tall) throw new Error("the chat is too short to show where it opens");
            if (!(await atBottom(page))) throw new Error("the chat opened above the newest message");
        },
    },
    {voice: false, device: {...PHONE, storageState: state}}
);
