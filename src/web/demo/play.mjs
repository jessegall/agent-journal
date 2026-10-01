import {chromium} from "playwright-core";

const [address, pick = "0"] = process.argv.slice(2);
const phone = address.includes("phone.html");
const browser = await chromium.launch({channel: "chrome"});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await page.goto(address);
await page.waitForFunction(() => globalThis.demo && document.querySelector(".compose-send"));
const label = await page.evaluate((at) => Object.keys(demo.demo.branches)[Number(at)] || "", pick);

const turn = () => page.waitForFunction(() => demo.player.finished || (demo.player.waiting && !demo.player.playing), null, {timeout: 60000});
const done = [];

async function answered(move) {
    const answer = move.fork ? label : await page.evaluate((n) => demo.state.rows.question.find((row) => row.n === n).data.options[0].title, move.n);
    if (phone) return page.evaluate(([n, given]) => fetch("./answer", {method: "POST", body: JSON.stringify({n, answer: given})}), [move.n, answer]);
    return page.getByText(answer, {exact: true}).first().click();
}

for (let moves = 0; moves < 100; moves++) {
    await turn();
    const move = await page.evaluate(() => (demo.player.finished ? null : demo.player.waiting));
    if (!move) break;
    const at = await page.evaluate(() => demo.state.at);
    if (move.kind === "send") await page.locator(".compose-send").click();
    if (move.kind === "approve" && !phone) await page.locator(".plan-card-start").click();
    if (move.kind === "approve" && phone) await page.evaluate((n) => fetch("./approve", {method: "POST", body: JSON.stringify({n})}), move.n);
    if (move.kind === "answer") await answered(move);
    await page.waitForFunction((was) => demo.state.at > was, at, {timeout: 30000});
    done.push(move.kind);
}
const feed = await page.$('.pane-tab[title="File feed"]');
if (feed) await feed.click();
await page.waitForTimeout(1500);
const got = await page.evaluate(() => ({
    finished: demo.player.finished,
    branch: demo.state.branch,
    todos: demo.state.rows.todo.map((row) => !!row.completed),
    text: document.body.innerText,
    cards: document.querySelectorAll(".diff-card").length,
    panes: [...document.querySelectorAll(".pane-tab")].map((tab) => tab.title),
}));
console.log(JSON.stringify({...got, moves: done, errors}));
await browser.close();
if (errors.length || !got.finished) process.exitCode = 1;
