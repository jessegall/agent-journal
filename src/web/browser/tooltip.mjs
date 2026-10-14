import {runScenarios} from "./harness.mjs";

const BUILDER_NOTE = "The agent builds it itself, and sends helpers when a job is better done beside it.";

const mode = (page, name) => page.locator("[role=radio]", {hasText: name});
const bubble = (page) => page.getByRole("tooltip");

await runScenarios(process.argv[2], {
    async "pointing at a mode button shows its note at once, right under it"(page, url) {
        await page.goto(`${url}#/main`);
        await mode(page, "Builder").hover();
        await bubble(page).waitFor({state: "visible", timeout: 400});
        const text = await bubble(page).textContent();
        if (!text.includes(BUILDER_NOTE)) throw new Error(`the bubble read: ${text}`);
        const target = await mode(page, "Builder").boundingBox();
        const box = await bubble(page).boundingBox();
        if (box.y < target.y + target.height) throw new Error(`the bubble starts at ${box.y}, above the button's end at ${target.y + target.height}`);
        if (box.y - (target.y + target.height) > 16) throw new Error("the bubble sits far from the button");
    },
    async "moving to the next mode swaps the words and Esc closes it"(page, url) {
        await page.goto(`${url}#/main`);
        await mode(page, "Builder").hover();
        await bubble(page).waitFor({state: "visible"});
        await mode(page, "Orchestrator").hover();
        await page.waitForFunction(() => document.querySelector("[role=tooltip]")?.textContent.includes("Orchestrator"), null, {timeout: 1000});
        await page.keyboard.press("Escape");
        await bubble(page).waitFor({state: "hidden", timeout: 500});
    },
    async "choosing a mode keeps its tooltip up through the screen update"(page, url) {
        await page.goto(`${url}#/main`);
        await mode(page, "Solo").hover();
        await mode(page, "Solo").click();
        await page.waitForFunction(() => document.querySelector("[role=radio][aria-checked=true]")?.textContent.includes("Solo"), null, {timeout: 8000});
        await page.waitForTimeout(600);
        if (!(await bubble(page).isVisible())) throw new Error("the bubble went away when the mode was chosen");
        if (!(await bubble(page).textContent()).includes("no helpers")) throw new Error("the bubble does not describe Solo");
    },
});
