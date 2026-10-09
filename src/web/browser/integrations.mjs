import {createServer} from "node:http";
import {journal, numberOf, runScenarios, shot} from "./harness.mjs";

await runScenarios(process.argv[2], {
    async "Linear is off at first and its card says how the key and the state read"(page, url) {
        await page.goto(`${url}#/main/integrations`);
        const card = page.locator('[data-integration="linear"]');
        await card.waitFor();
        await page.getByText("Outside services the journal can reach for you").first().waitFor();
        await card.getByText("Use Linear").waitFor();
        await card.getByText("Key", {exact: true}).waitFor();
        await card.getByText("No key is picked, so Linear is not reached.").waitFor();
        await card.getByText("no command can use it").waitFor();
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
        await card.locator('[data-picker="key"]').getByText(title).click();
        await card.getByText(`Linear signs in with the secret ${title}.`).waitFor();
        await card.getByRole("switch", {name: "Use Linear", exact: true}).click();
        await card.locator("[data-state]").getByText(/Not checked yet|Last checked|Could not reach Linear/).waitFor();
        await card.getByText("Webhook signing secret").waitFor();
        await card.getByText(/Paste this address into Linear's webhook settings|Turn on sharing to get an address/).waitFor();
        await page.reload();
        await page.locator('[data-integration="linear"]').getByRole("switch", {name: "Use Linear", exact: true, checked: true}).waitFor();
        await shot(page, "integrations-on");
    },
    async "Gmail is off at first and its card asks for the address and the mail to read once it is on"(page, url) {
        await page.goto(`${url}#/main/integrations`);
        const card = page.locator('[data-integration="gmail"]');
        await card.waitFor();
        await card.getByText("Use Gmail").waitFor();
        if ((await card.getByRole("switch", {name: "Use Gmail", exact: true}).getAttribute("aria-checked")) !== "false") throw new Error("Gmail starts switched on");
        if (await card.getByText("Agents can use Gmail directly").count()) throw new Error("Gmail offers a direct-use switch it does not have");
        await card.getByRole("switch", {name: "Use Gmail", exact: true}).click();
        await card.locator("[data-gmail-account]").waitFor();
        await card.locator("[data-gmail-search]").waitFor();
        const saved = page.waitForResponse((answer) => answer.request().method() === "POST" && /\/api\/main\/settings$/.test(answer.url()));
        await card.locator("[data-gmail-account]").fill("me@gmail.com");
        await card.locator("[data-gmail-account]").blur();
        await saved;
        await page.reload();
        await page.waitForFunction(() => document.querySelector('[data-integration="gmail"] [data-gmail-account]')?.value === "me@gmail.com");
        await shot(page, "integrations-gmail");
    },
    async "at phone width the Linear card with a board picked, its stage rows and the Gmail card fit with no sideways scroll and no overlapping text"(page, url) {
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
        const linear = page.locator('[data-integration="linear"]');
        await linear.waitFor();
        await linear.locator('[data-picker="key"]').getByRole("option", {name: title}).click();
        const use = linear.getByRole("switch", {name: "Use Linear", exact: true});
        if ((await use.getAttribute("aria-checked")) !== "true") await use.click();
        await linear.getByRole("switch", {name: "Use Linear", exact: true, checked: true}).waitFor();
        await linear.getByRole("option", {name: board}).click();
        await linear.getByText(/When a ticket moves to .*, set the issue to/).first().waitFor();
        const gmail = page.locator('[data-integration="gmail"]');
        await gmail.waitFor();
        const sideways = await page.evaluate(async () => {
            const wide = (el) => el.scrollWidth > el.clientWidth;
            const rows = () => [...document.querySelectorAll("[data-integration] .use, [data-integration] .team")];
            const layout = () => JSON.stringify([document.documentElement.scrollWidth, document.documentElement.clientWidth, document.querySelectorAll("[data-integration]").length,
                ...rows().flatMap((row) => [...row.children].map((child) => Object.values(child.getBoundingClientRect().toJSON()).map(Math.round)))]);
            const frame = () => new Promise((next) => requestAnimationFrame(() => next()));
            await document.fonts.ready;
            for (let seen = layout(), steady = 0, tries = 0; steady < 3 && tries < 300; tries++) {
                await frame();
                const now = layout();
                steady = now === seen ? steady + 1 : 0;
                seen = now;
            }
            const found = [document.documentElement, document.querySelector(".integrations"), ...document.querySelectorAll("[data-integration]")].filter(Boolean).filter(wide);
            const overlapping = [];
            for (const row of rows()) {
                const boxes = [...row.children].map((child) => child.getBoundingClientRect()).filter((box) => box.width && box.height);
                for (const [at, one] of boxes.entries()) {
                    for (const other of boxes.slice(at + 1)) {
                        if (one.left < other.right - 1 && other.left < one.right - 1 && one.top < other.bottom - 1 && other.top < one.bottom - 1) overlapping.push(row.textContent.trim().slice(0, 60));
                    }
                }
            }
            return {wide: found.map((el) => el.dataset.integration || el.className || el.tagName), overlapping};
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
});
