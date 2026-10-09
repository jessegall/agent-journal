import {reply, runScenarios} from "../harness.mjs";

const OPEN = process.env.SHARED_OPEN;
const ENDED = process.env.SHARED_ENDED;
const MISSING = process.env.SHARED_MISSING;
const COLLECTION = process.env.SHARED_COLLECTION;
const COMMENTS = /\/comment$/;
const ANSWERS = /\/answer$/;

async function comment(page, words) {
    await page.getByRole("button", {name: /Leave a comment/}).click();
    const name = page.getByPlaceholder("Shown with your comment");
    if (await name.isVisible()) await name.fill("Sam");
    await page.getByPlaceholder(/Write a comment/).fill(words);
    await page.getByRole("button", {name: "Send", exact: true}).click();
}

await runScenarios(OPEN, {
    async "a visitor reads the shared page"(page) {
        await page.goto(OPEN);
        await page.getByText("Proposal for visitors").first().waitFor();
        await page.getByText("Every detail of the plan").first().waitFor();
    },
    async "a visitor's comment shows at once, and is still there after a reload"(page) {
        const words = `Looks right ${Date.now()}`;
        await page.goto(OPEN);
        await comment(page, words);
        await page.getByText(words).first().waitFor();
        await page.reload();
        await page.getByText(words).first().waitFor();
    },
    async "a comment the server refuses says why and keeps the words"(page) {
        const words = `Refused ${Date.now()}`;
        await page.goto(OPEN);
        await page.route(COMMENTS, (route) => reply(route, {error: "no comments today"}, 422));
        await comment(page, words);
        await page.getByText(/no comments today/).first().waitFor();
        if ((await page.getByPlaceholder(/Write a comment/).inputValue()) !== words) throw new Error("the words were lost with the refusal");
    },
    async "a question put to the visitor takes one answer and shows it after a reload"(page) {
        await page.goto(OPEN);
        await page.getByText("Which shift?").first().waitFor();
        await page.getByPlaceholder("Your name").first().fill("Sam");
        await page.getByText("Night shift", {exact: true}).click();
        await page.getByText("Answered: Night shift").waitFor();
        await page.reload();
        await page.getByText("Answered: Night shift").waitFor();
    },
    async "an answer the server refuses says why"(page) {
        await page.goto(OPEN);
        await page.getByText("Which room?").first().waitFor();
        await page.route(ANSWERS, (route) => reply(route, {error: "that question is closed"}, 422));
        await page.getByPlaceholder("Your name").last().fill("Sam");
        await page.getByText("Back room", {exact: true}).click();
        await page.getByText(/that question is closed/).waitFor();
    },
    async "a shared collection lists a row of another environment beside its own"(page) {
        await page.goto(COLLECTION);
        await page.getByText("Proposal for visitors").first().waitFor();
        await page.getByRole("tab", {name: /Plans/}).click();
        await page.getByText("Plan from the ticket").first().waitFor();
        await page.getByText("Ticket 1 · Fix the login page").first().waitFor();
        await page.getByRole("tab", {name: /Tickets/}).click();
        await page.getByText("Fix the login page").first().waitFor();
        await page.getByText("Doing", {exact: true}).first().waitFor();
        await page.getByRole("tab", {name: /Boards/}).click();
        await page.getByText("Launch board").first().waitFor();
        await page.getByText("Ideas", {exact: true}).first().waitFor();
        await page.getByRole("button", {name: "Fix the login page"}).waitFor();
        await page.getByText("Visitors log in without a reload").waitFor();
        await page.getByText("A wrong password is refused").waitFor();
        await page.getByRole("button", {name: "Open plan of ticket 1"}).first().click();
        await page.getByText("Done elsewhere").first().waitFor();
    },
    async "a plan of another environment shows skeleton rows and a skeleton timeline until its to-dos have arrived"(page) {
        await page.clock.install();
        let replies = 0;
        await page.route("**/data.json", async (route) => {
            replies += 1;
            const got = await route.fetch();
            const body = await got.json();
            if (replies === 1) {
                for (const ref of Object.keys(body.rows)) if (ref.includes("todo:")) delete body.rows[ref];
                for (const row of Object.values(body.rows)) row.members = row.members.filter((member) => !member.includes("todo:"));
            }
            await route.fulfill({response: got, json: body});
        });
        await page.goto(`${COLLECTION}#?tab=plans&open=plan:1@ticket-1`);
        await page.getByText("Done elsewhere").first().waitFor();
        await page.locator(".bones").first().waitFor();
        await page.locator(".share-timeline [aria-label=\"Loading the timeline\"]").first().waitFor();
        if (await page.getByText("Add the theme tokens").count()) throw new Error("the to-do showed before it had arrived");
        await page.clock.fastForward(25000);
        await page.getByText("Add the theme tokens").first().waitFor();
        if (await page.locator(".bones").count()) throw new Error("the skeleton rows stayed after the to-dos arrived");
    },
    async "a link that ended says so"(page) {
        await page.goto(ENDED);
        await page.getByText(/Nothing is shared on this link/).first().waitFor();
    },
    async "a link that never existed says so and shows nothing of the journal"(page) {
        await page.goto(MISSING);
        await page.getByText(/Nothing is shared on this link/).first().waitFor();
        if (await page.getByText("Proposal for visitors").count()) throw new Error("an unknown link showed the document");
    },
}, {voice: false});
