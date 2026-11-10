import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, captures] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
let page;
try {
    page = await browser.newPage({viewport: {width: 1440, height: 1000}});
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.emulateMedia({colorScheme: "light"});
    await page.goto(address);
    await page.locator('[data-fact="skills"]').click();
    await page.locator("[data-agent-skills-browse]").click();
    await page.locator('[data-page="skills.skills"]').waitFor();
    assert.equal(await page.locator(".pane-stage").count(), 0);
    const skills = page.locator('[data-window="skills.skills"]');
    await skills.getByRole("heading", {name: "Skills", exact: true}).waitFor();
    await skills.getByRole("button", {name: "project-notes", exact: true}).click();
    await skills.locator("[data-skill-text]").waitFor();
    assert.equal(new URL(page.url()).searchParams.get("skill"), "project-notes");
    await page.reload();
    await skills.locator("[data-skill-text]").waitFor();
    const [file] = await Promise.all([page.waitForEvent("popup"), skills.getByRole("link", {name: "Open SKILL.md", exact: true}).click()]);
    await file.waitForLoadState();
    assert.match(await file.locator("body").innerText(), /Read before taking notes/);
    await file.close();
    await skills.getByRole("switch", {name: "Require project-notes at the start", exact: true}).first().click();
    await skills.getByLabel("Which agents must read it").selectOption("main");
    await skills.getByText("The main agent reads it at the start and again after every compaction.", {exact: true}).waitFor();
    await skills.getByRole("button", {name: "Make the agent read it now", exact: true}).click();
    await skills.getByText("The main agent still has to read this skill.", {exact: false}).waitFor();
    await skills.getByRole("button", {name: "Add a trigger", exact: true}).click();
    await skills.getByLabel("Add a word", {exact: true}).fill("notes");
    await skills.getByLabel("Add a word", {exact: true}).press("Enter");
    await skills.getByLabel("Try a sentence", {exact: true}).fill("take notes now");
    await skills.getByText("This would fire.", {exact: false}).waitFor();
    await page.screenshot({path: `${captures}-light-editor.png`, animations: "disabled"});
    await skills.getByRole("button", {name: "Create trigger", exact: true}).click();
    await skills.getByText("Not fired yet", {exact: true}).waitFor();
    await skills.getByRole("button", {name: "Triggers", exact: true}).click();
    await skills.getByRole("button", {name: "Edit", exact: true}).click();
    await skills.getByLabel("Name", {exact: true}).fill("Notes trigger");
    await skills.getByRole("button", {name: "Save", exact: true}).click();
    await skills.getByRole("button", {name: "Pause this trigger", exact: true}).click();
    await skills.getByText("Paused", {exact: true}).waitFor();
    await skills.getByRole("button", {name: "Resume this trigger", exact: true}).click();
    await skills.getByText("Paused", {exact: true}).waitFor({state: "detached"});
    await page.screenshot({path: `${captures}-light-triggers.png`, animations: "disabled"});
    await skills.getByRole("button", {name: "Skills", exact: true}).click();
    await page.screenshot({path: `${captures}-light.png`, animations: "disabled"});
    await page.emulateMedia({colorScheme: "dark"});
    await page.screenshot({path: `${captures}-dark.png`, animations: "disabled"});
    await page.setViewportSize({width: 390, height: 844});
    await page.screenshot({path: `${captures}-phone-skill.png`, animations: "disabled"});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.emulateMedia({colorScheme: "light"});
    await page.screenshot({path: `${captures}-phone-light.png`, animations: "disabled"});
    await skills.getByRole("button", {name: "Back", exact: true}).click();
    await skills.getByLabel("Find a skill", {exact: true}).fill("nothing-matches-this");
    await skills.getByText("No skill matches", {exact: true}).waitFor();
    await page.screenshot({path: `${captures}-phone-empty.png`, animations: "disabled"});
    await skills.getByRole("button", {name: "Clear the search", exact: true}).first().click();
    await skills.getByRole("button", {name: "project-notes", exact: true}).click();
    await skills.getByRole("button", {name: "Edit", exact: true}).click();
    await skills.getByRole("button", {name: "End this trigger", exact: true}).click();
    await skills.getByRole("button", {name: "Yes, end it", exact: true}).click();
    await skills.getByText("No triggers yet.", {exact: false}).waitFor();
    assert.deepEqual(errors, []);
} catch (error) {
    if (page) {
        process.stderr.write(`${await page.locator("body").innerText()}\n`);
        await page.screenshot({path: `${captures}-failure.png`, animations: "disabled"});
    }
    throw error;
} finally {
    await browser.close();
}
