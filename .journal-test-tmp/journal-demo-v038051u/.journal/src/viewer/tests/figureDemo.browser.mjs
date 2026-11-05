// Plays each act of the figure and a parcel build in a running viewer by the figure's window event, and notes what the page drew for each.
// node tests/figureDemo.browser.mjs <viewer link> <folder for the pictures>; CHROMIUM_PATH names the browser, ACTS the acts to play, by comma.
import {mkdirSync, writeFileSync} from "node:fs";
import {chromium} from "playwright-core";

const [LINK, OUT] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"]});
mkdirSync(OUT, {recursive: true});
const page = await (await browser.newContext({viewport: {width: 1280, height: 1000}})).newPage();
page.on("pageerror", (error) => console.log("page error:", error.message));
await page.goto(LINK);
const report = [];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const send = (detail) => page.evaluate((detail) => window.dispatchEvent(new CustomEvent("figure-demo", {detail})), detail);
const figure = () => page.evaluate(() => {
    const element = document.querySelector(".voice-figure");
    return {clip: element?.dataset.clip, trip: element?.dataset.trip, beats: element?.dataset.beats ?? "", acts: [...document.querySelectorAll(".figure-act")].map((each) => each.dataset.act), boxes: document.querySelectorAll(".code-parcel").length, piled: document.querySelectorAll("[data-figure-pile]").length};
});

// the chat pane's own Figure option, in its window settings menu; the tour's card out of the way
await page.waitForSelector("[data-figure-home]", {timeout: 45000});
const pane = page.locator("[data-figure-home]").locator("xpath=ancestor::*[.//*[contains(@class, 'pane-menu-button')]][1]");
await pane.locator(".pane-menu-button").first().click();
await page.locator('[data-option="figure"] [data-choice="butler"]').click();
await page.keyboard.press("Escape");
await page.mouse.click(640, 120);
await page.getByRole("button", {name: "Skip"}).click({timeout: 3000}).catch(() => {});
// at the foot of the chat, with no Newest button for the figure to step aside from
await page.locator("[data-scroll-foot]").click({timeout: 3000}).catch(() => {});
await page.waitForFunction(() => {
    const figure = document.querySelector(".voice-figure");
    return figure && getComputedStyle(figure).display !== "none" && figure.dataset.clip && figure.dataset.clip !== "enter";
}, null, {timeout: 120000});
await page.screenshot({path: `${OUT}/rest.png`});

// the docked cards out of the way, their buttons being what the figure keeps off, so it can take a seat at home
const undock = page.locator('[data-dock-action="undock"]');
for (let tries = 0; tries < 40 && (await undock.count()); tries++) {
    await undock.first().click({timeout: 2000}).catch(() => {});
    await sleep(500);
}

const ACTS = (process.env.ACTS ?? "type_ponder,ask_sign,ponder,think_cloud,file_card,hand_rub,fume,bug_shot,bug_smash,pogo,pack_box,press,vacuum,disco,chute").split(",");
// the acts played as the way an agent's state is held, rather than as a beat: at the laptop, on a seat
const HELD = {type_ponder: "writing"};
for (const clip of ACTS) {
    if (clip === "disco") {
        // the ball hangs from a bubble over the one the figure stands on
        await send({perch: true});
        for (let tries = 0; tries < 80; tries++) {
            await sleep(250);
            const state = await figure();
            if (tries > 8 && !state.trip) break;
        }
    }
    await send(HELD[clip] ? {held: {state: HELD[clip], clip}} : {clip});
    let seen = false;
    let drawn = false;
    for (let tries = 0; tries < 360; tries++) {
        await sleep(250);
        const state = await figure();
        if (state.clip !== clip) {
            if (seen && drawn) break;
            continue;
        }
        seen = true;
        if (!state.acts.includes(clip)) continue;
        drawn = true;
        await sleep(900);
        await page.screenshot({path: `${OUT}/${clip}.png`});
        break;
    }
    report.push({clip, seen, drawn});
    console.log(JSON.stringify(report.at(-1)));
    await send({held: null});
    for (let tries = 0; tries < 120; tries++) {
        if (!(await figure()).beats.includes(clip)) break;
        await sleep(250);
    }
}

// A box built for a run until one is on the pile. The figure meets the box it pushes only if every frame is drawn, as a screen does and a software
// renderer does not, so the clock is stepped here frame by frame while it pushes, and jumps while it walks and hammers.
await page.clock.install();
await page.goto(page.url().replace(/key=[^&]*&?/, ""));
await page.waitForSelector("[data-figure-canvas]", {state: "attached", timeout: 60000});
await page.clock.pauseAt(Date.now() + 1000);
for (let tries = 0; tries < 240 && !(await figure()).clip; tries++) {
    await sleep(250);
    await page.clock.runFor(34);
}
await send({parcel: true});
const moves = [];
let worked = false;
for (let tries = 0; tries < 600; tries++) {
    const pushing = await page.evaluate(() => document.querySelector(".voice-figure")?.dataset.clip === "run");
    if (pushing) await page.clock.runFor(200);
    else {
        await page.clock.fastForward(500);
        await page.clock.runFor(34);
    }
    const state = await figure();
    const last = moves.at(-1);
    if (!last || last.clip !== state.clip || last.piled !== state.piled || last.boxes !== state.boxes) {
        moves.push(state);
        console.log(JSON.stringify({clip: state.clip, boxes: state.boxes, piled: state.piled}));
    }
    if (state.boxes && !state.piled && state.clip === "work" && !worked) {
        worked = true;
        await page.screenshot({path: `${OUT}/parcel-work.png`});
    }
    if (state.piled >= 1) break;
}
await page.screenshot({path: `${OUT}/parcel-pile.png`});
await send({parcel: false});
writeFileSync(`${OUT}/report.json`, JSON.stringify({report, moves}, null, 1));
await browser.close();
process.exit(0);
