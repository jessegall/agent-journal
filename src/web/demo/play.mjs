import {chromium} from "playwright-core";
const browser = await chromium.launch({channel: "chrome"});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await page.goto(process.argv[2]);
await page.waitForFunction(() => globalThis.demo && document.querySelector(".compose-send"));
const sent = [];
const ready = () => demo.player.finished || (!demo.player.playing && document.querySelector(".box-area").value);
for (;;) {
    await page.waitForFunction(ready, null, {timeout: 30000});
    if (await page.evaluate(() => demo.player.finished)) break;
    sent.push(await page.evaluate(() => demo.state.at));
    await page.click(".compose-send");
    await page.waitForFunction((at) => demo.state.at > at, sent.at(-1), {timeout: 30000});
}
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
console.log(JSON.stringify({...got, sent, errors}));
await browser.close();
const played = got.todos.length > 0 && got.todos.every(Boolean) && errors.length === 0 && sent.length === got.prompts - 1;
if (!played) process.exitCode = 1;
