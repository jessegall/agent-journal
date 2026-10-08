import {mkdtempSync, writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {journal, numberOf, runScenarios, shot} from "./harness.mjs";

const SETTLE = 1500;
const MESSAGES = /\/api\/main\/message(\?|$)/;
const QUESTION_WRITES = /\/api\/main\/question\/\d+\//;
const OPTIONS = 'options=[{"title":"Red","brief":"warm"},{"title":"Blue","brief":"cool"}]';
const compose = (page) => page.getByPlaceholder("Message the agent");
const sendButton = (page) => page.locator(".compose-send");
const settle = (page) => page.waitForTimeout(SETTLE);

const stored = (page, marker) =>
    page.evaluate(async (word) => {
        const got = await (await fetch("/api/main/message?last=0&completed=true")).json();
        return got.rows.filter((row) => row.brief.includes(word)).length;
    }, marker);

async function arrived(page, marker, within = 20000) {
    const began = Date.now();
    while ((await stored(page, marker)) === 0) {
        if (Date.now() - began > within) throw new Error("the kept message never reached the server");
        await page.waitForTimeout(500);
    }
}

const answeredRows = (page, kind) =>
    page.evaluate(async (type) => (await (await fetch(`/api/main/${type}?last=0&completed=true`)).json()).rows, kind);

async function answered(page, n, outcome, within = 10000) {
    const began = Date.now();
    for (;;) {
        const row = (await answeredRows(page, "question")).find((found) => found.n === n);
        if (row && row.completed && row.outcome === outcome) return;
        if (Date.now() - began > within) throw new Error(`question ${n} was not saved as ${JSON.stringify(outcome)}`);
        await page.waitForTimeout(300);
    }
}

async function decided(page, n, decision, within = 10000) {
    const began = Date.now();
    for (;;) {
        const row = (await answeredRows(page, "suggestion")).find((found) => found.n === n);
        if (row && Boolean(row.completed) === Boolean(decision) && (row.data.decision || "") === decision) return;
        if (Date.now() - began > within)
            throw new Error(`suggestion ${n} was not saved as ${JSON.stringify(decision)}: ${JSON.stringify(row)}`);
        await page.waitForTimeout(300);
    }
}

async function type(page, words) {
    await compose(page).fill(words);
    await sendButton(page).click();
}

async function home(page, url) {
    await page.goto(`${url}#/main`);
    await compose(page).waitFor();
}

const PIXEL = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const suggest = (title) => numberOf(journal("suggestion", "suggest", title, "--brief", "Every search reads the whole tree again."));
const ask = (title) => numberOf(journal("question", "ask", title, "--abstract", "pick one", "--set", OPTIONS, "--set", "pick=1"));

await runScenarios(process.argv[2], {
    async "a message sent shows once in the chat and once on the server, also after a reload"(page, url) {
        const marker = `once ${Date.now()}`;
        await home(page, url);
        await type(page, marker);
        await page.getByText(marker).first().waitFor();
        await settle(page);
        if ((await page.getByText(marker).count()) !== 1) throw new Error("the sent message shows more than once");
        await page.reload();
        await page.getByText(marker).first().waitFor();
        if ((await page.getByText(marker).count()) !== 1 || (await stored(page, marker)) !== 1)
            throw new Error("the message was doubled by a reload");
    },
    async "typing the first words brings the chat to the newest message"(page, url) {
        await home(page, url);
        const gap = () => page.evaluate(() => { const s = document.querySelector(".thread-scroll"); return s.scrollHeight - s.clientHeight - s.scrollTop; });
        await page.evaluate(() => {
            const s = document.querySelector(".thread-scroll");
            const filler = document.createElement("div");
            filler.style.height = "3000px";
            s.prepend(filler);
            s.scrollTop = 0;
        });
        await compose(page).pressSequentially("hello");
        await page.waitForTimeout(SETTLE);
        if ((await gap()) > 40) throw new Error("typing did not bring the chat to the bottom");
    },
    async "a message sent while the server is away is kept, and sent once when it is back"(page, url) {
        const marker = `away ${Date.now()}`;
        await home(page, url);
        await page.route(MESSAGES, (route) => (route.request().method() === "POST" ? route.abort() : route.fallback()));
        await type(page, marker);
        await page.getByText(marker).first().waitFor();
        await settle(page);
        if ((await stored(page, marker)) !== 0) throw new Error("the message reached the server while it was away");
        await page.unroute(MESSAGES);
        await arrived(page, marker);
        await settle(page);
        const times = await stored(page, marker);
        if (times !== 1) throw new Error(`the kept message reached the server ${times} times`);
        if ((await page.getByText(marker).count()) !== 1) throw new Error("the kept message shows more than once in the chat");
    },
    async "two pasted images get their own names and send, and a repeated file name is refused in words"(page, url) {
        const marker = `images ${Date.now()}`;
        await home(page, url);
        const paste = (name) =>
            compose(page).evaluate((box, given) => {
                const data = new DataTransfer();
                data.items.add(new File([new Uint8Array([137, 80, 78, 71])], given, {type: "image/png"}));
                box.dispatchEvent(new ClipboardEvent("paste", {clipboardData: data, bubbles: true, cancelable: true}));
            }, name);
        await paste("image");
        await paste("image");
        await page.locator(".compose-files").getByText("Pasted image 1.png").waitFor();
        await page.locator(".compose-files").getByText("Pasted image 2.png").waitFor();
        await paste("photo.png");
        await paste("photo.png");
        await page.getByText('"photo.png" is already attached', {exact: false}).waitFor();
        await compose(page).fill(marker);
        await sendButton(page).click();
        await page.getByText(marker).first().waitFor();
        await settle(page);
        if ((await stored(page, marker)) !== 1) throw new Error("the message with two pasted images was not sent");
        await page.screenshot({path: `${process.env.SHOT_DIR || "/tmp"}/pasted-images.png`});
    },
    async "an agent's line naming an attachment shows that picture as a card in the chat"(page, url) {
        const folder = mkdtempSync(join(tmpdir(), "shown-"));
        const picture = join(folder, "IMG_1201.png");
        writeFileSync(picture, Buffer.from(PIXEL, "base64"));
        const n = numberOf(journal("message", "create", `screen ${Date.now()}`, "--brief", "this one"));
        journal("message", "attach", String(n), picture);
        journal("message", "reply", String(n), `Look at this one:\nmessage ${n} IMG_1201.png\nIt is the cut off screen.`);
        await home(page, url);
        const card = page.locator(".thread-text .file-card").first();
        await card.waitFor();
        await page.waitForFunction(() => document.querySelector(".thread-text .file-card-image")?.naturalWidth > 0);
        await shot(page, "shown-file");
        if (!(await card.innerText()).includes("IMG_1201.png")) throw new Error("the card does not name the file");
    },
    async "pressing send twice sends one message"(page, url) {
        const marker = `twice ${Date.now()}`;
        await home(page, url);
        await compose(page).fill(marker);
        await sendButton(page).dblclick();
        await settle(page);
        if ((await stored(page, marker)) !== 1) throw new Error("two presses made two messages");
    },
    async "an option picked on a question is saved as its answer"(page, url) {
        const title = `Colour ${Date.now()}`;
        const n = ask(title);
        await home(page, url);
        await page.getByText(title).first().waitFor();
        await page.getByText("Blue", {exact: true}).last().click();
        await answered(page, n, "Blue");
        await page.reload();
        await page.getByText(title).first().waitFor();
    },
    async "own words on a question are saved as its answer"(page, url) {
        const title = `Own words ${Date.now()}`;
        const n = ask(title);
        await home(page, url);
        await page.getByText(title).first().waitFor();
        await page.getByPlaceholder("Or choice in your own words…").last().fill("Green, please");
        await page.getByRole("button", {name: "Answer"}).last().click();
        await answered(page, n, "Green, please");
    },
    async "an answer the server refuses says it was not saved and offers to try again"(page, url) {
        const title = `Refused ${Date.now()}`;
        ask(title);
        await home(page, url);
        await page.getByText(title).first().waitFor();
        await page.route(QUESTION_WRITES, (route) =>
            route.request().method() === "POST"
                ? route.fulfill({status: 500, contentType: "application/json", body: JSON.stringify({error: "down"})})
                : route.fallback()
        );
        await page.getByText("Blue", {exact: true}).last().click();
        await page.getByText(/Couldn't save “Blue”/).waitFor();
        await page.unroute(QUESTION_WRITES);
        await page.getByRole("button", {name: "Try again"}).click();
        await page.getByText(/Couldn't save/).waitFor({state: "detached"});
    },
    async "a suggestion shows in the chat as a card, its no can be undone, and its yes adds a to-do"(page, url) {
        const title = `Keep the list ${Date.now()}`;
        const n = suggest(title);
        await home(page, url);
        const card = page.locator(`.thread-turn [data-card="${n}"]`).first();
        await card.getByText(title).waitFor();
        await card.getByRole("button", {name: "No, don't do this"}).click();
        await decided(page, n, "decline");
        await card.getByText("You said no.").waitFor();
        await page.getByText(`You said no to suggestion ${n}`).first().waitFor();
        await page.getByRole("button", {name: "Undo"}).click();
        await decided(page, n, "");
        await card.getByRole("button", {name: "Yes, I want this"}).click();
        await decided(page, n, "accept");
        await card.getByText(/You said yes\.\s+Added to-do/).waitFor();
    },
});
