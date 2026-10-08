import {runScenarios} from "../harness.mjs";

const URL_ = process.env.HOSTED_URL;
const PASSWORD = process.env.HOSTED_PASSWORD;
const OLD_LOGIN = process.env.HOSTED_OLD_LOGIN;
const MOST_TRIES = 5;

async function logIn(page, password) {
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", {name: "Log in"}).click();
}

await runScenarios(URL_, {
    async "a wrong password says so and keeps the login form"(page, url) {
        await page.goto(`${url}login`);
        await logIn(page, "not the password");
        await page.getByRole("alert").filter({hasText: "That password is wrong."}).waitFor();
        await page.getByRole("button", {name: "Log in"}).waitFor();
    },
    async "a login that ran out sends you to log in again"(page, url) {
        await page.context().setExtraHTTPHeaders({Cookie: `__Host-journal=${OLD_LOGIN}`});
        await page.goto(url);
        await page.getByRole("alert").filter({hasText: "Your login ran out. Log in again."}).waitFor();
    },
    async "the right password opens the viewer, and Log out ends the login"(page, url) {
        await page.goto(url);
        await logIn(page, PASSWORD);
        await page.waitForURL((address) => address.pathname === "/");
        await page.getByRole("button", {name: "Log out"}).click();
        await page.getByRole("alert").filter({hasText: "You are logged out."}).waitFor();
        await page.goto(url);
        await page.getByRole("button", {name: "Log in"}).waitFor();
    },
    async "too many wrong tries lock this place out and say for how long"(page, url) {
        await page.goto(`${url}login`);
        for (let tried = 0; tried < MOST_TRIES; tried += 1) await logIn(page, "still not the password");
        await page.getByRole("alert").filter({hasText: "Too many wrong tries. Try again in 15 minutes."}).waitFor();
        await page.goto(`${url}login`);
        await page.getByRole("alert").filter({hasText: "Too many wrong tries"}).waitFor();
    },
}, {voice: false});
