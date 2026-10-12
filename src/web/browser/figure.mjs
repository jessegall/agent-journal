import {runScenarios, shot} from "./harness.mjs";

const FIGURE = ".voice-figure";
const HOME = "[data-figure-home]";

// the environment's agent as the agent list reports it, at work with a search in flight
async function working(page) {
    await page.route(/\/api\/main\/agent\?/, async (route) => {
        const response = await route.fetch();
        const body = await response.json();
        const now = Date.now() / 1000;
        const row = {
            n: 9001,
            title: "claude-9001",
            type: "agent",
            completed: 0,
            deleted: 0,
            created: now - 60,
            updated: now,
            refs: [],
            seen: [],
            sections: [],
            brief: "",
            outcome: "",
            abstract: "",
            data: {status: "working", event: "PreToolUse", tool: "Grep", at: now, provider: "claude", model: "opus"},
        };
        await route.fulfill({response, json: {...body, rows: [row, ...(body.rows || [])]}});
    });
}

// where the figure's feet are, and the top of the compose box it stands on
const footing = (page) =>
    page.evaluate(
        ([figure, home]) => {
            const box = document.querySelector(figure).getBoundingClientRect();
            return {
                feet: box.bottom,
                edge: document.querySelector(home).getBoundingClientRect().top,
                shown: getComputedStyle(document.querySelector(figure)).display,
            };
        },
        [FIGURE, HOME]
    );

// a question waiting on the user, as the dashboard lists it
async function questionWaits(page) {
    await page.route(/\/api\/main\/dashboard/, async (route) => {
        const response = await route.fetch();
        const body = await response.json();
        if (body.rows?.question) {
            const now = Date.now() / 1000;
            const question = {
                n: 777,
                type: "question",
                ref: "question:777",
                title: "Which port should the preview use",
                abstract: "",
                brief: "",
                sections: [],
                refs: [],
                seen: ["agent"],
                completed: 0,
                deleted: 0,
                created: now - 30,
                updated: now - 30,
                outcome: "",
                data: {
                    options: [
                        {title: "8431", text: "the preview port"},
                        {title: "8432", text: "the next one"},
                    ],
                    pick: 1,
                    files: {},
                },
            };
            body.rows.question = {...body.rows.question, rows: [question, ...(body.rows.question.rows || [])]};
        }
        await route.fulfill({response, json: body});
    });
}

// the controls the figure's box lies over, by their words
const hidden = (page) =>
    page.evaluate((figure) => {
        const box = document.querySelector(figure).getBoundingClientRect();
        const controls = [...document.querySelectorAll("button, a[href], input, select, textarea, [role=tab], [role=button]")];
        return controls
            .filter((control) => {
                const r = control.getBoundingClientRect();
                return r.width && r.left < box.right && box.left < r.right && r.top < box.bottom && box.top < r.bottom;
            })
            .map((control) => (control.innerText || control.getAttribute("aria-label") || control.tagName).trim());
    }, FIGURE);

await runScenarios(process.argv[2], {
    async "it goes to the tab where a question waits behind another, and stands where it hides no control"(page, url) {
        await working(page);
        await questionWaits(page);
        await page.goto(`${url}#/main`);
        await page.locator(FIGURE).waitFor({state: "visible"});
        const tab = page.locator('[data-tab="question"]');
        if ((await tab.getAttribute("aria-selected")) === "true") await page.locator('[data-tab="waiting"]').click();
        await page.waitForFunction(
            ([figure, view]) => {
                const box = document.querySelector(figure).getBoundingClientRect();
                const target = document.querySelector(`[data-tab="${view}"]`).getBoundingClientRect();
                return (
                    Math.abs(box.left + box.width / 2 - (target.left + target.width / 2)) < 2 * box.width &&
                    box.top < target.bottom + box.height
                );
            },
            [FIGURE, "question"],
            {timeout: 20000}
        );
        const covered = await hidden(page);
        if (covered.length) throw new Error(`standing at the question's tab the figure hides ${covered.join(", ")}`);
        await shot(page, "figure-at-the-question-tab");
    },

    async "on a page with no compose box it stands on the page's own floor, off the activity rail and over no control"(page, url) {
        await working(page);
        await page.goto(`${url}#/main/todo`);
        await page.locator(FIGURE).waitFor({state: "visible"});
        await page.waitForTimeout(8000);
        const place = await page.evaluate((figure) => {
            const box = document.querySelector(figure).getBoundingClientRect();
            const floor = document.querySelector("[data-figure-floor]").getBoundingClientRect();
            return {
                left: box.left,
                right: box.right,
                feet: box.bottom,
                floorLeft: floor.left,
                floorRight: floor.right,
                floor: floor.bottom,
            };
        }, FIGURE);
        if (place.left < place.floorLeft || place.right > place.floorRight)
            throw new Error(
                `the figure spans ${place.left} to ${place.right}, outside the page's ${place.floorLeft} to ${place.floorRight}`
            );
        if (Math.abs(place.feet - place.floor) > 12)
            throw new Error(`the figure's feet are at ${place.feet}, the page's floor at ${place.floor}`);
        const covered = await hidden(page);
        if (covered.length) throw new Error(`on the to-do page the figure hides ${covered.join(", ")}`);
    },

    async "the voice's figure stands on the compose box on every load, and a reload takes its file from the cache, not the network"(
        page,
        url
    ) {
        await working(page);
        const fetched = [];
        page.on("request", (request) => request.url().endsWith(".glb") && fetched.push(request.url()));
        await page.goto(`${url}#/main`);
        await page.locator(FIGURE).waitFor({state: "visible"});
        fetched.length = 0;
        await page.reload();
        await page.locator(FIGURE).waitFor({state: "visible"});
        await page.waitForFunction(
            ([figure, home]) => {
                const feet = document.querySelector(figure).getBoundingClientRect().bottom;
                return Math.abs(feet - document.querySelector(home).getBoundingClientRect().top) < 12;
            },
            [FIGURE, HOME]
        );
        const {feet, edge, shown} = await footing(page);
        if (shown !== "block") throw new Error(`the figure is ${shown} after a reload`);
        if (Math.abs(feet - edge) > 12) throw new Error(`the figure's feet are at ${feet}, the compose box's edge at ${edge}`);
        if (fetched.length) throw new Error(`the reload fetched the figure's file from the network again: ${fetched.join(", ")}`);
        await shot(page, "figure-on-the-compose-box");
    },
});
