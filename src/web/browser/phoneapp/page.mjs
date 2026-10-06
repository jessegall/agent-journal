import {chromium} from "playwright-core";
import {reply, runScenarios} from "../harness.mjs";

const PAIR = process.argv[2];
const PHONE = {viewport: {width: 390, height: 844}, hasTouch: true, isMobile: true};
const MESSAGES = /\/p\/message$/;
const ANSWERS = /\/p\/answer$/;
const SHOWN = 8000;

async function pairedState() {
    const browser = await chromium.launch();
    const context = await browser.newContext(PHONE);
    const page = await context.newPage();
    await page.goto(PAIR);
    await page.getByPlaceholder("Message the agent").waitFor();
    const state = await context.storageState();
    await browser.close();
    return state;
}

const state = await pairedState();
const card = (page, title) => page.locator("article.question", {hasText: title});

const home = async (page) => {
    await page.goto(new URL("./", PAIR).href);
    await page.getByPlaceholder("Message the agent").waitFor();
};

await runScenarios(PAIR, {
    async "a paired phone shows what waits for the user"(page) {
        await home(page);
        await page.getByText("Which road?").first().waitFor({timeout: SHOWN});
        await page.getByText(/\d+ needs? you/).first().waitFor({timeout: SHOWN});
    },
    async "a tap on an option answers the question for good"(page) {
        await home(page);
        await card(page, "Which road?").getByText("Hill road", {exact: true}).click();
        await page.getByText("Answered: Hill road").waitFor({timeout: SHOWN});
        await page.waitForTimeout(1500);
        await page.reload();
        await page.getByText("Answered: Hill road").waitFor({timeout: SHOWN});
        if (await page.getByText(/waits? to send/).count()) throw new Error("the answer was still waiting to send after a reload");
    },
    async "own words answer the other question"(page) {
        await home(page);
        await card(page, "Which hat?").getByPlaceholder("Or answer in your own words").fill("A green hat, see [[chip question:1|Question 1]]");
        await card(page, "Which hat?").getByRole("button", {name: "Answer"}).click();
        await page.getByText("Answered: A green hat").waitFor({timeout: SHOWN});
        await page.locator(".question-answer .row-pill", {hasText: "Question 1"}).waitFor({timeout: SHOWN});
        if (await page.getByText("[[chip").count()) throw new Error("the answer showed its chip as raw text");
        await page.waitForTimeout(1500);
        await page.reload();
        await page.getByText("Answered: A green hat").waitFor({timeout: SHOWN});
    },
    async "typing the first words brings the chat to the newest message"(page) {
        await home(page);
        const gap = () => page.evaluate(() => { const s = document.querySelector(".home-feed"); return s.scrollHeight - s.clientHeight - s.scrollTop; });
        await page.evaluate(() => {
            const s = document.querySelector(".home-feed");
            const filler = document.createElement("div");
            filler.style.height = "3000px";
            s.prepend(filler);
            s.scrollTop = 0;
        });
        await page.getByPlaceholder("Message the agent").pressSequentially("hello");
        await page.waitForTimeout(500);
        if ((await gap()) > 40) throw new Error("typing did not bring the chat to the bottom");
    },
    async "a message sent while the computer cannot be reached waits, and arrives once when it can"(page) {
        const words = `from the train ${Date.now()}`;
        const sent = [];
        await home(page);
        await page.route(MESSAGES, (route) => (route.request().method() === "POST" && sent.length === 0 ? (sent.push("refused"), route.abort()) : (sent.push("sent"), route.fallback())));
        await page.getByPlaceholder("Message the agent").fill(words);
        await page.getByRole("button", {name: /send/i}).last().click();
        await page.getByText(words).first().waitFor({timeout: SHOWN});
        await page.getByText(words).first().waitFor();
        await page.waitForFunction((marker) => document.body.innerText.includes(marker), words, {timeout: 20000});
        await page.waitForTimeout(6000);
        const counts = sent.filter((word) => word === "sent").length;
        if (counts !== 1) throw new Error(`the message was sent ${counts} times: ${sent.join(",")}`);
        if ((await page.getByText(words).count()) !== 1) throw new Error("the message shows more than once");
    },
    async "an answer the computer refuses is said, with a way to try again"(page) {
        await home(page);
        await page.route(ANSWERS, (route) => reply(route, {error: "that answer was not understood"}, 400));
        await card(page, "Which bridge?").getByText("Old bridge", {exact: true}).click();
        await page.getByText(/That didn't go through: that answer was not understood/).first().waitFor({timeout: SHOWN});
    },
}, {voice: false, device: {...PHONE, storageState: state}});
