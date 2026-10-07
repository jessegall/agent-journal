import {reply, runScenarios} from "../harness.mjs";
import {home, PAIR, PHONE, pairedState, SHOWN, tab} from "./paired.mjs";

const MESSAGES = /\/p\/message$/;
const ANSWERS = /\/p\/answer$/;

const state = await pairedState();
const card = (page, title) => page.locator("article.question", {hasText: title});

await runScenarios(
    PAIR,
    {
        async "a paired phone shows what waits for the user"(page) {
            await home(page);
            await page.getByText("Which road?").first().waitFor({timeout: SHOWN});
            await page
                .getByText(/\d+ needs? you/)
                .first()
                .waitFor({timeout: SHOWN});
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
            await page.locator(".home-feed").waitFor({timeout: SHOWN});
            const gap = () =>
                page.evaluate(() => {
                    const s = document.querySelector(".home-feed");
                    return s.scrollHeight - s.clientHeight - s.scrollTop;
                });
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
            await page.route(MESSAGES, (route) =>
                route.request().method() === "POST" && sent.length === 0
                    ? (sent.push("refused"), route.abort())
                    : (sent.push("sent"), route.fallback())
            );
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
        async "the four tabs open Chat, Home, To-dos and Everything"(page) {
            await home(page);
            await tab(page, "Home");
            await page.getByRole("button", {name: "Change Home"}).waitFor({timeout: SHOWN});
            await tab(page, "To-dos");
            await page.getByRole("button", {name: "Water the plants"}).waitFor({timeout: SHOWN});
            await tab(page, "Everything");
            await page.getByText("Plans the agent wrote; approve one to start it").waitFor({timeout: SHOWN});
            await page.getByText("Shared by every environment.").waitFor();
            await page.getByRole("button", {name: /^Facts/}).click();
            await page.getByText("Things the agent learned about this project and keeps in mind.").waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: "The roses face south"}).waitFor({timeout: SHOWN});
            await tab(page, "Chat");
            await page.getByPlaceholder("Message the agent").waitFor();
        },
        async "search finds places, commands and items"(page) {
            await home(page);
            await tab(page, "Everything");
            await page.getByRole("button", {name: /Search everything/}).click();
            await page.getByLabel("Search places, commands and items").fill("plants");
            await page.getByRole("button", {name: /Water the plants/}).waitFor({timeout: SHOWN});
            await page.getByLabel("Search places, commands and items").fill("tour");
            await page.getByRole("button", {name: /Show the tour again/}).click();
            await page.getByText("1 of 3").waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: "Next"}).click();
            await page.locator(".tab.spot[data-tab=todos]").waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: "Next"}).click();
            await page.locator(".tab.spot[data-tab=everything]").waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: "Close the tour"}).click();
            if (await page.locator(".spot").count()) throw new Error("the tour left something lit after it closed");
        },
        async "a to-do swiped right is marked done, and Undo opens it again"(page) {
            await home(page);
            await tab(page, "To-dos");
            const row = page.getByRole("button", {name: "Water the plants"});
            await row.waitFor({timeout: SHOWN});
            const box = await row.boundingBox();
            const y = box.y + box.height / 2;
            await page.mouse.move(box.x + 60, y);
            await page.mouse.down();
            for (const x of [70, 100, 140, 190, 240]) await page.mouse.move(box.x + x, y);
            await page.mouse.up();
            await page.getByText(/Marked to-do \d+ done/).waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: "Undo"}).click();
            await page.getByText(/To-do \d+ is open again/).waitFor({timeout: SHOWN});
            await row.waitFor({timeout: SHOWN});
        },
        async "an answer the computer refuses is said, with a way to try again"(page) {
            await home(page);
            await page.route(ANSWERS, (route) => reply(route, {error: "that answer was not understood"}, 400));
            await card(page, "Which bridge?").getByText("Old bridge", {exact: true}).click();
            await page
                .getByText(/That didn't go through: that answer was not understood/)
                .first()
                .waitFor({timeout: SHOWN});
        },
        async "the To-dos tab lists the lanes, and the board moves a card to another lane"(page) {
            await home(page);
            await tab(page, "To-dos");
            await page.getByRole("heading", {name: "Held · 2"}).waitFor({timeout: SHOWN});
            await page.getByText("blocked: waits for the hinges").waitFor();
            await page.getByRole("radio", {name: "Board"}).click();
            await page.getByRole("button", {name: "Everything you can do with To-do 3"}).click();
            await page.getByRole("button", {name: "Move to another lane"}).click();
            await page.getByRole("button", {name: "Doing"}).click();
            await page.getByText("Moved to-do 3 to Doing").waitFor({timeout: SHOWN});
            await page.getByRole("tab", {name: /^Doing 1/}).waitFor({timeout: SHOWN});
        },
        async "a to-do's own page blocks it with a reason, unblocks it, and lists every action under More"(page) {
            await home(page);
            await tab(page, "To-dos");
            await page.getByRole("button", {name: "Water the plants"}).click();
            const item = page.locator(".reader-foot");
            await item.getByRole("button", {name: "Block", exact: true}).click();
            await page.getByLabel("Why is it blocked? A reason is needed.").fill("waits for rain");
            await page.locator("form").getByRole("button", {name: "Block"}).click();
            await page.getByText("Blocked to-do 1").waitFor({timeout: SHOWN});
            await page.locator(".reader-body").getByText("waits for rain").waitFor({timeout: SHOWN});
            await item.getByRole("button", {name: "Unblock"}).click();
            await page.getByText("Unblocked to-do 1").waitFor({timeout: SHOWN});
            await item.getByRole("button", {name: "More", exact: true}).click();
            const actions = page.getByRole("dialog");
            for (const action of ["Change priority", "Move to another lane", "Edit title and details", "Strike it", "Delete"])
                await actions.getByRole("button", {name: action}).waitFor({timeout: SHOWN});
        },
        async "each tab keeps its own pages"(page) {
            await home(page);
            await tab(page, "To-dos");
            await page.getByRole("button", {name: "Fix the gate"}).click();
            await page.getByRole("heading", {name: "Fix the gate"}).waitFor({timeout: SHOWN});
            await tab(page, "Chat");
            await page.getByPlaceholder("Message the agent").waitFor();
            await tab(page, "To-dos");
            await page.getByRole("heading", {name: "Fix the gate"}).waitFor({timeout: SHOWN});
        },
        async "New makes a to-do and opens it"(page) {
            await home(page);
            await tab(page, "To-dos");
            await page.getByRole("button", {name: "New to-do"}).click();
            await page.getByLabel("Title").fill("Sweep the porch");
            await page.getByRole("button", {name: "Add"}).click();
            await page.getByRole("heading", {name: "Sweep the porch"}).waitFor({timeout: SHOWN});
        },
    },
    {voice: false, device: {...PHONE, storageState: state}}
);
