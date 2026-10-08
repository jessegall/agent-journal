import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const phone = address.includes("phone.html");
const shots = process.env.SHOT_DIR;
const lesson = new URL(address).searchParams.get("scenario");
let shot = 0;
const look = (name) =>
    shots && page.screenshot({path: `${shots}/${lesson}-${phone ? "phone" : "computer"}-${String(++shot).padStart(2, "0")}-${name}.png`});
const browser = await chromium.launch({channel: "chrome"});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
const MISSING_FILE = /^(Failed to load resource|A bad HTTP response code)/;
page.on("console", (line) => line.type() === "error" && !MISSING_FILE.test(line.text()) && errors.push(line.text()));
await page.addInitScript(() => {
    const seen = (globalThis.dumpWindow = {opened: false, items: 0, closed: false});
    setInterval(() => {
        const open = !!document.querySelector(".dump-work");
        seen.opened ||= open;
        seen.closed ||= seen.opened && !open;
        seen.items = Math.max(seen.items, document.querySelectorAll(".dump-pile *").length);
    }, 20);
});
await page.goto(address);
await page.waitForFunction(() => globalThis.demo && document.querySelector(".compose-send"));

const turn = () =>
    page.waitForFunction(() => demo.player.finished || (demo.player.waiting && !demo.player.playing), null, {timeout: 60000});
const done = [];
const refused = [];

async function strayed(move, answer) {
    const other = await page.evaluate(
        ([n, type, given]) => {
            const row = demo.state.rows[type].find((one) => one.n === n);
            const labels = type === "dump" ? row.data.question?.guesses || [] : (row.data.options || []).map((option) => option.title);
            return labels.find((label) => label !== given) || "";
        },
        [move.n, move.type, answer]
    );
    if (!other) return;
    const at = await page.evaluate(() => demo.state.at);
    await page.getByText(other, {exact: true}).first().click();
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => ({at: demo.state.at, notice: !!document.querySelector(".replay-hint")}));
    refused.push(after.at === at && after.notice);
}

async function answered(move) {
    const answer = await page.evaluate((given) => demo.player.recorded(given), move);
    if (phone)
        return page.evaluate(
            ([n, given]) => fetch("./answer", {method: "POST", body: JSON.stringify({n, answer: given})}),
            [move.n, answer]
        );
    await strayed(move, answer);
    return page.getByText(answer, {exact: true}).first().click();
}

for (let moves = 0; moves < 100; moves++) {
    await turn();
    const move = await page.evaluate(() => (demo.player.finished ? null : demo.player.waiting));
    if (!move) break;
    const at = await page.evaluate(() => demo.state.at);
    await look(move.kind);
    if (move.kind === "send") await page.locator(".compose-send").click();
    if (move.kind === "approve" && !phone) await page.locator(".plan-card-start").click();
    if (move.kind === "approve" && phone)
        await page.evaluate((n) => fetch("./approve", {method: "POST", body: JSON.stringify({n})}), move.n);
    if (move.kind === "answer") await answered(move);
    await page.waitForFunction((was) => demo.state.at > was, at, {timeout: 30000});
    done.push(move.kind);
}
const feed = await page.$('.pane-tab[title="File edits"]');
if (feed) await feed.click();
await page.waitForTimeout(1500);
const ending = await page.waitForSelector(".lesson-end", {timeout: 8000}).then(
    (card) => card.innerText(),
    () => ""
);
await look("end");
if (!ending.includes("Lesson done")) errors.push("the ending card did not appear");
const got = await page.evaluate(() => ({
    finished: demo.player.finished,
    dumpWindow: globalThis.dumpWindow,
    todos: demo.state.rows.todo.map((row) => !!row.completed),
    text: document.body.innerText,
    lastAgentMessage: (demo.state.rows.comment.filter((row) => row.seen[0] === "agent").at(-1) || {}).brief || "",
    cards: document.querySelectorAll(".diff-card").length,
    panes: [...document.querySelectorAll(".pane-tab")].map((tab) => tab.title),
}));
const words = (got.lastAgentMessage.split("\n\n").pop() || "").split(/\[\[[^\]]*\]\]/);
const showing = words
    .reduce((best, part) => (part.length > best.length ? part : best), "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 30);
const onScreen = !!showing && got.text.replace(/\s+/g, " ").includes(showing);
if (!onScreen) errors.push(`the last agent message is not on screen: ${showing}`);
console.log(JSON.stringify({...got, moves: done, refused, errors}));
await browser.close();
if (errors.length || !got.finished) process.exitCode = 1;
