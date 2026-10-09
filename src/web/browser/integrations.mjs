import {createServer} from "node:http";
import {journal, numberOf, reply, runScenarios, shot} from "./harness.mjs";

const switchOff = () => ["linear", "gmail"].forEach((name) => journal("feature", "switch", name, "--no-on"));

const leavingThemOff = (cases) =>
    Object.fromEntries(
        Object.entries(cases).map(([name, run]) => [
            name,
            async (page, url) => {
                try {
                    await run(page, url);
                } finally {
                    switchOff();
                }
            },
        ])
    );

await runScenarios(process.argv[2], leavingThemOff({
    async "Linear is off at first and its card shows only the switch and the state, with the key on its settings page"(page, url) {
        await page.goto(`${url}#/main/integrations`);
        const card = page.locator('[data-integration="linear"]');
        await card.waitFor();
        await page.getByText("Outside services the journal can reach for you").first().waitFor();
        await card.getByText("Use Linear").waitFor();
        if (await card.getByText("Key", {exact: true}).count()) throw new Error("the card shows the key, which belongs on the settings page");
        if ((await card.getByRole("switch", {name: "Use Linear", exact: true}).getAttribute("aria-checked")) !== "false") throw new Error("Linear starts switched on");
        await card.locator("[data-state]").getByText("Off", {exact: true}).waitFor();
        await shot(page, "integrations-off");
    },
    async "a key can be picked and the switch turns Linear on"(page, url) {
        const title = `Linear key ${Date.now()}`;
        await page.goto(`${url}#/main/secrets`);
        await page.getByRole("button", {name: "New secret"}).click();
        await page.getByRole("radio", {name: /Login/}).click();
        await page.locator("#secret-title").fill(title);
        await page.getByRole("button", {name: "Create secret"}).click();
        await page.getByText("Not set").first().waitFor();
        await page.goto(`${url}#/main/integrations`);
        const card = page.locator('[data-integration="linear"]');
        await card.getByRole("switch", {name: "Use Linear", exact: true}).click();
        await card.getByText("Not logged in to Linear.").waitFor();
        await card.getByRole("button", {name: "Log in"}).waitFor();
        await card.getByRole("switch", {name: "Agents can use Linear directly"}).waitFor();
        await card.locator("[data-state]").getByText(/Not checked yet|Last checked|Could not reach Linear/).waitFor();
        await card.getByRole("button", {name: "Settings"}).click();
        const settings = page.locator('[data-settings="linear"]');
        await settings.getByText("Linear settings").waitFor();
        const reading = settings.getByRole("switch", {name: "Read Linear into tickets"});
        if ((await reading.getAttribute("aria-checked")) !== "false") throw new Error("reading Linear into tickets starts switched on");
        await reading.click();
        await settings.locator('[data-picker="key"]').getByText(title).click();
        await settings.getByText(`Linear signs in with the secret ${title}.`).waitFor();
        await settings.getByText("Webhook signing secret").waitFor();
        await settings.getByText(/Paste this address into Linear's webhook settings|Turn on sharing to get an address/).waitFor();
        await page.reload();
        await page.locator('[data-settings="linear"]').getByRole("switch", {name: "Read Linear into tickets", checked: true}).waitFor();
        await shot(page, "integrations-settings");
        await page.getByRole("button", {name: "Integrations"}).click();
        await page.locator('[data-integration="linear"]').getByRole("switch", {name: "Use Linear", exact: true, checked: true}).waitFor();
        await shot(page, "integrations-on");
        const raw = '{"errors":[{"message":"Authentication required, not authenticated"}]}';
        await page.route(/\/api\/main\/integration\/linear(\?|$)/, (route) => reply(route, {last_checked: 0, last_error: `https://api.linear.app answered 401: ${raw}`}));
        await page.reload();
        const line = page.locator('[data-integration="linear"] [data-state]');
        await line.getByText("Linear did not accept the key. Pick another key.", {exact: true}).waitFor();
        if (await page.getByText("Authentication required").count()) throw new Error("the card shows Linear's raw answer before Show is pressed");
        await page.locator('[data-integration="linear"]').getByRole("button", {name: "Show"}).click();
        await page.getByText("Authentication required", {exact: false}).waitFor();
        await page.unroute(/\/api\/main\/integration\/linear(\?|$)/);
    },
    async "a card that is logged in offers Log out, which asks the server and shows Log in again"(page, url) {
        let at = Date.now() / 1000 - 120;
        const asked = [];
        await page.route(/\/api\/main\/integration\/linear(\?|$)/, (route) => reply(route, {last_checked: 0, logged_in_at: at}));
        await page.route(/\/api\/main\/integration\/linear\/logout(\?|$)/, (route) => (asked.push(route.request().method()), (at = 0), reply(route, {loggedOut: true})));
        await page.goto(`${url}#/main/integrations`);
        const card = page.locator('[data-integration="linear"]');
        await card.getByRole("switch", {name: "Use Linear", exact: true}).click();
        await card.getByText("Logged in to Linear 2 minutes ago.").waitFor();
        if (await card.getByRole("button", {name: "Log in"}).count()) throw new Error("a logged in card still offers Log in");
        await card.getByRole("button", {name: "Log out"}).click();
        await card.getByText("Not logged in to Linear.").waitFor();
        await card.getByRole("button", {name: "Log in"}).waitFor();
        if (asked.join() !== "POST") throw new Error("Log out did not ask the server once");
        await page.unroute(/\/api\/main\/integration\/linear(\?|$)/);
        await page.unroute(/\/api\/main\/integration\/linear\/logout(\?|$)/);
    },
    async "Gmail is off at first and its card asks for the address and the mail to read once it is on"(page, url) {
        await page.goto(`${url}#/main/integrations`);
        const card = page.locator('[data-integration="gmail"]');
        await card.waitFor();
        await card.getByText("Use Gmail").waitFor();
        if ((await card.getByRole("switch", {name: "Use Gmail", exact: true}).getAttribute("aria-checked")) !== "false") throw new Error("Gmail starts switched on");
        if (await card.getByText("Agents can use Gmail directly").count()) throw new Error("Gmail offers a direct-use switch it does not have");
        const written = (answer) => answer.request().method() === "POST" && /\/api\/main\/settings$/.test(answer.url());
        const switched = page.waitForResponse(written);
        await card.getByRole("switch", {name: "Use Gmail", exact: true}).click();
        await switched;
        if (await card.locator("[data-gmail-account]").count()) throw new Error("the Gmail card shows the address, which belongs on the settings page");
        await card.getByRole("button", {name: "Settings"}).click();
        const settings = page.locator('[data-settings="gmail"]');
        await settings.getByRole("switch", {name: "Read Gmail into tickets"}).click();
        await settings.locator("[data-gmail-account]").waitFor();
        await settings.locator("[data-gmail-search]").waitFor();
        const saved = page.waitForResponse((answer) => written(answer) && (answer.request().postData() || "").includes("me@gmail.com"));
        await settings.locator("[data-gmail-account]").fill("me@gmail.com");
        await settings.locator("[data-gmail-account]").blur();
        await saved;
        await page.reload();
        await page.waitForFunction(() => document.querySelector('[data-settings="gmail"] [data-gmail-account]')?.value === "me@gmail.com");
        await shot(page, "integrations-gmail");
    },
    async "at phone width the Linear settings with a board picked and its stage rows fit with no sideways scroll and no overlapping text"(page, url) {
        const title = `Phone key ${Date.now()}`;
        const board = `Phone board ${Date.now()}`;
        journal("board", "create", board);
        await page.setViewportSize({width: 390, height: 844});
        await page.goto(`${url}#/main/secrets`);
        await page.getByRole("button", {name: "New secret"}).click();
        await page.getByRole("radio", {name: /Login/}).click();
        await page.locator("#secret-title").fill(title);
        await page.getByRole("button", {name: "Create secret"}).click();
        await page.getByRole("dialog").waitFor({state: "detached"});
        await page.getByText(title).first().waitFor();
        await page.goto(`${url}#/main/integrations`);
        await page.locator(".project-flash").waitFor({state: "detached"});
        const card = page.locator('[data-integration="linear"]');
        await card.waitFor();
        const use = card.getByRole("switch", {name: "Use Linear", exact: true});
        if ((await use.getAttribute("aria-checked")) !== "true") await use.click();
        await card.getByRole("switch", {name: "Use Linear", exact: true, checked: true}).waitFor();
        await card.getByRole("button", {name: "Settings"}).click();
        const linear = page.locator('[data-settings="linear"]');
        const reading = linear.getByRole("switch", {name: "Read Linear into tickets"});
        if ((await reading.getAttribute("aria-checked")) !== "true") await reading.click();
        await linear.locator('[data-picker="key"]').getByRole("option", {name: title}).click();
        await linear.getByRole("option", {name: board}).click();
        await linear.getByText(/When a ticket moves to .*, set the issue to/).first().waitFor();
        const sideways = await page.evaluate(async () => {
            const wide = (el) => el.scrollWidth > el.clientWidth;
            const rows = () => [...document.querySelectorAll("[data-settings] .use, [data-settings] .team")];
            const layout = () => JSON.stringify([document.documentElement.scrollWidth, document.documentElement.clientWidth, document.querySelectorAll("[data-settings]").length,
                ...rows().flatMap((row) => [...row.children].map((child) => Object.values(child.getBoundingClientRect().toJSON()).map(Math.round)))]);
            const frame = () => new Promise((next) => requestAnimationFrame(() => next()));
            await document.fonts.ready;
            for (let seen = layout(), steady = 0, tries = 0; steady < 3 && tries < 300; tries++) {
                await frame();
                const now = layout();
                steady = now === seen ? steady + 1 : 0;
                seen = now;
            }
            const found = [document.documentElement, document.querySelector(".integrations"), ...document.querySelectorAll("[data-settings]")].filter(Boolean).filter(wide);
            const overlapping = [];
            for (const row of rows()) {
                const boxes = [...row.children].map((child) => child.getBoundingClientRect()).filter((box) => box.width && box.height);
                for (const [at, one] of boxes.entries()) {
                    for (const other of boxes.slice(at + 1)) {
                        if (one.left < other.right - 1 && other.left < one.right - 1 && one.top < other.bottom - 1 && other.top < one.bottom - 1) overlapping.push(row.textContent.trim().slice(0, 60));
                    }
                }
            }
            return {wide: found.map((el) => el.dataset.settings || el.className || el.tagName), overlapping};
        });
        if (sideways.wide.length) throw new Error(`at phone width these scroll sideways: ${sideways.wide.join(", ")}`);
        if (sideways.overlapping.length) throw new Error(`at phone width these rows overlap: ${sideways.overlapping.join(" | ")}`);
        await shot(page, "integrations-phone");
    },
    async "an image in text from Linear shows as a link and loads nothing from its host"(page, url) {
        const asked = [];
        const host = createServer((request, answer) => (asked.push(request.url), answer.end("x"))).listen(0);
        await new Promise((done) => host.once("listening", done));
        const image = `http://127.0.0.1:${host.address().port}/pixel.png`;
        const brief = `<untrusted source="linear" author="Ana">See ![pixel](${image}) and <img src="${image}"></untrusted>`;
        const n = numberOf(journal("todo", "create", `From Linear ${Date.now()}`, "--brief", brief));
        try {
            await page.goto(`${url}#/main/todo/${n}`);
            await page.locator("article").getByText("pixel (image)").waitFor();
            await page.waitForTimeout(500);
            if (asked.length) throw new Error(`the viewer asked the image's host: ${asked.join(", ")}`);
        } finally {
            host.close();
        }
    },
}));
