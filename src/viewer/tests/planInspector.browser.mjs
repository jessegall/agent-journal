import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, shots] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
const login = await browser.newContext();

async function open(page, table, id) {
    await page.evaluate((ref) => { location.hash = `#?open=${ref}`; }, `${table}:${id}`);
    const panel = page.locator(table === "plans" ? "[data-plan-inspector]" : "[data-task-inspector]");
    await panel.locator("[data-resource-title]").waitFor();
    await page.locator("[data-resource-panel]:not(.opening)").waitFor();
    await page.locator("[data-resource-panel]").evaluate((element) => Promise.all(element.getAnimations({subtree: true}).map((animation) => animation.finished.catch(() => null))));
    return panel;
}

async function layout(panel) {
    return panel.evaluate((element) => {
        const top = element.querySelector(".top");
        const summary = element.querySelector(".summary");
        const title = element.querySelector("[data-resource-title]");
        const tabs = element.querySelector(".tabs");
        return {
            topHeight: top.getBoundingClientRect().height,
            topPadding: getComputedStyle(top).padding,
            summaryPadding: getComputedStyle(summary).padding,
            titleSize: getComputedStyle(title).fontSize,
            titleWeight: getComputedStyle(title).fontWeight,
            titleLine: getComputedStyle(title).lineHeight,
            tabsPadding: getComputedStyle(tabs).padding,
            tabsBorder: getComputedStyle(tabs).borderBottomWidth,
            commentPadding: getComputedStyle(element.querySelector(".comment-bar")).padding,
        };
    });
}

async function icon(icon) {
    return icon.evaluate((element) => ({
        class: element.getAttribute("class"),
        shape: element.innerHTML.replaceAll(/ data-v-[a-z0-9]+=""/g, ""),
        tone: getComputedStyle(element).getPropertyValue("--tone").trim(),
    }));
}

async function check(width, height) {
    const page = await login.newPage();
    await page.setViewportSize({width, height});
    const link = new URL(address);
    link.searchParams.set("page", "tasks.tasks");
    await page.goto(link.href);
    await page.locator('.task[data-row="1"] .ring').first().waitFor();
    const statuses = [];
    for (let id = 1; id <= 6; id++) statuses.push(await icon(page.locator(`.task[data-row="${id}"] .ring`).first()));

    const task = await open(page, "tasks", 1);
    await checkActions(task);
    const taskLayout = await layout(task);
    await screenshots(page, "task", width);
    await task.locator("[data-resource-close]").click();
    const plan = await open(page, "plans", 1);
    await checkActions(plan);
    assert.deepEqual(await layout(plan), taskLayout);
    assert.equal(await plan.locator(".task[data-row]").count(), 6);
    for (let id = 1; id <= 6; id++) assert.deepEqual(await icon(plan.locator(".task[data-row] .ring").nth(id - 1)), statuses[id - 1]);
    assert.equal(await plan.locator("[data-resource-phase]").evaluate((element) => getComputedStyle(element).borderRadius), "0px");
    assert.ok(await plan.evaluate((element) => element.scrollWidth <= element.clientWidth));
    await screenshots(page, "plan", width);

    await plan.getByRole("radio", {name: "Comments", exact: true}).click();
    await plan.locator("[data-comment-side]").waitFor();
    await plan.locator(".comment-bar-open").click();
    const comment = `Checked at ${width}px`;
    await plan.locator("textarea").fill(comment);
    await plan.getByRole("button", {name: "Send", exact: true}).click();
    await plan.locator("[data-comment]").filter({hasText: comment}).waitFor();
    await page.screenshot({path: `${shots}-comments-${width}.png`});
    await plan.getByRole("button", {name: "Close the comments", exact: true}).click();
    await plan.locator("[data-resource-phase]").waitFor();
    await plan.locator(".comment-bar .count").click();
    await plan.locator("[data-comment-side]").waitFor();
    await plan.getByRole("radio", {name: "Timeline", exact: true}).click();
    await plan.locator("[data-plan-event]").first().waitFor();
    assert.equal(await plan.locator("[data-plan-event].completed .ring.done").count(), 1);
    assert.equal(await plan.locator("[data-plan-event].cancelled .ring.done").count(), 1);
    await plan.getByRole("radio", {name: "Details", exact: true}).click();
    await plan.locator(".task[data-row]").first().click();
    await page.locator("[data-task-inspector] [data-resource-title]").waitFor();
    await page.close();
}

async function checkActions(panel) {
    const actions = panel.locator("[data-inspector-actions]").first();
    await actions.locator("[data-move]").first().waitFor();
    const position = await actions.evaluate((element) => ({top: element.getBoundingClientRect().top, headerBottom: element.previousElementSibling.getBoundingClientRect().bottom, alignment: getComputedStyle(element).justifyContent}));
    assert.ok(Math.abs(position.top - position.headerBottom) <= 1);
    assert.equal(position.alignment, "flex-end");
}

async function screenshots(page, name, width) {
    for (const colorScheme of ["dark", "light"]) {
        await page.emulateMedia({colorScheme});
        await page.screenshot({path: `${shots}-${name}-${width}-${colorScheme}.png`});
    }
}

try {
    await check(1440, 900);
    await check(390, 844);
    console.log("Plan inspector layout, task states, comments and navigation passed at both widths");
} finally {
    await browser.close();
}
