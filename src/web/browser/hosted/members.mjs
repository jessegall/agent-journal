import {runScenarios} from "../harness.mjs";

const URL_ = process.env.HOSTED_URL;
const OWNER_LOGIN = process.env.HOSTED_OWNER_LOGIN;
const INVITE_LINK = process.env.HOSTED_INVITE_LINK;
const MEMBER_NAME = process.env.HOSTED_MEMBER_NAME;
const MEMBER_PASSWORD = process.env.HOSTED_MEMBER_PASSWORD;
const READER_LOGIN = process.env.HOSTED_READER_LOGIN;

await runScenarios(URL_, {
    async "the owner invites a person from People and gets the link to send them"(page, url) {
        await page.context().setExtraHTTPHeaders({Cookie: `__Host-journal=${OWNER_LOGIN}`});
        await page.goto(url);
        await page.getByRole("button", {name: "People"}).click();
        await page.getByPlaceholder("Their name").fill("Ada");
        await page.getByRole("button", {name: "Invite", exact: true}).click();
        await page.getByText("Send this link to Ada.").waitFor();
    },
    async "an invite link lets the person choose a password and opens the journal"(page) {
        await page.goto(INVITE_LINK);
        await page.getByText("The owner invited you as Bea.").waitFor();
        await page.getByLabel("Password", {exact: true}).fill(MEMBER_PASSWORD);
        await page.getByLabel("Password again").fill(MEMBER_PASSWORD);
        await page.getByRole("button", {name: "Join"}).click();
        await page.waitForURL((address) => address.pathname === "/");
    },
    async "a member logs in again with their name and password"(page, url) {
        await page.goto(`${url}login`);
        await page.getByRole("link", {name: "Log in with your name"}).click();
        await page.getByLabel("Name").fill(MEMBER_NAME);
        await page.getByLabel("Password").fill(MEMBER_PASSWORD);
        await page.getByRole("button", {name: "Log in"}).click();
        await page.waitForURL((address) => address.pathname === "/");
    },
    async "a reader sees what they can do, and a message they send is refused with the reason"(page, url) {
        await page.context().setExtraHTTPHeaders({Cookie: `__Host-journal=${READER_LOGIN}`});
        await page.goto(`${url}#/main`);
        await page.getByRole("button", {name: "People"}).click();
        await page.getByText("You are Cleo, a reader in this journal.").waitFor();
        await page.getByText("Your role is reader; the owner can make you a writer.").waitFor();
        await page.keyboard.press("Escape");
        await page.getByPlaceholder("Message the agent").fill("hello from a reader");
        await page.keyboard.press("Enter");
        await page.getByRole("status").filter({hasText: "You can't do that. Readers read this journal"}).waitFor();
    },
});
