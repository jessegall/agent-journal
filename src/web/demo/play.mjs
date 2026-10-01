import {chromium} from "playwright-core";
const browser = await chromium.launch({channel: "chrome"});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await page.goto(process.argv[2]);
await page.waitForFunction(() => globalThis.demo && document.querySelector(".compose-send"));
await page.waitForFunction(() => demo.player.finished, null, {timeout: 120000});
const feed = await page.$('.pane-tab[title="File feed"]');
if (feed) await feed.click();
await page.waitForTimeout(1500);
const got = await page.evaluate(() => ({
    prompts: demo.player.prompts.length,
    todos: demo.state.rows.todo.map((row) => !!row.completed),
    text: document.body.innerText,
    cards: document.querySelectorAll(".diff-card").length,
    panes: [...document.querySelectorAll(".pane-tab")].map((tab) => tab.title),
}));
console.log(JSON.stringify({...got, errors}));
await browser.close();
if (errors.length) process.exitCode = 1;
