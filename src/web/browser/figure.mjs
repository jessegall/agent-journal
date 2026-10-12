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

// Waits until the figure has stopped where it is going, since a box read while it walks is not where it will stand
const settled = async (page) => {
    let before = null;
    for (let look = 0; look < 40; look++) {
        const now = await page.evaluate((figure) => {
            const box = document.querySelector(figure).getBoundingClientRect();
            return `${Math.round(box.left)},${Math.round(box.top)}`;
        }, FIGURE);
        if (now === before) return;
        before = now;
        await page.waitForTimeout(250);
    }
    throw new Error("the figure never stopped moving");
};

// The figure's left and top on every frame the page draws for `ms`, and whether its legs walk on that frame
const framesOf = (page, ms) =>
    page.evaluate(
        ([figure, ms]) =>
            new Promise((done) => {
                const frames = [];
                const until = performance.now() + ms;
                const look = () => {
                    const element = document.querySelector(figure);
                    const box = element.getBoundingClientRect();
                    frames.push({x: box.left, y: box.top, walking: element.dataset.walking === "true"});
                    if (performance.now() < until) requestAnimationFrame(look);
                    else done(frames);
                };
                requestAnimationFrame(look);
            }),
        [FIGURE, ms]
    );

// the longest run of frames for which `holds(frame, before)` is true
const longestRun = (frames, holds) => {
    let run = 0;
    let longest = 0;
    for (let at = 1; at < frames.length; at++) {
        run = holds(frames[at], frames[at - 1]) ? run + 1 : 0;
        longest = Math.max(longest, run);
    }
    return longest;
};

// a frame or two either side of a leg is the page catching up with the clock that started or ended it; more is the walk on the spot
const CATCH_UP_FRAMES = 3;

// the walk covers a pixel or two a frame and a hop goes straight up or down, so a figure that moves further across in one frame jumped
const MOST_ACROSS_IN_A_FRAME = 12;

await runScenarios(process.argv[2], {
    async "the walk plays only while the figure moves across, and the figure moves across only while it walks"(page, url) {
        await working(page);
        await questionWaits(page);
        await page.goto(`${url}#/main`);
        await page.locator(FIGURE).waitFor({state: "visible"});
        const tab = page.locator('[data-tab="question"]');
        if ((await tab.getAttribute("aria-selected")) === "true") await page.locator('[data-tab="waiting"]').click();
        const frames = await framesOf(page, 12000);
        const across = (frame, before) => Math.abs(frame.x - before.x) > 0.05;
        const walked = frames.filter((frame) => frame.walking).length;
        const onTheSpot = longestRun(frames, (frame, before) => frame.walking && !across(frame, before) && frame.y === before.y);
        const gliding = longestRun(frames, (frame, before) => !frame.walking && across(frame, before));
        const measured = `${frames.length} frames, ${walked} walking, longest walk on the spot ${onTheSpot}, longest glide ${gliding}`;
        console.log(`the figure's walk: ${measured}`);
        if (!walked) throw new Error(`the figure never walked to the question's tab: ${measured}`);
        if (onTheSpot > CATCH_UP_FRAMES) throw new Error(`the figure walked on the spot: ${measured}`);
        if (gliding > CATCH_UP_FRAMES) throw new Error(`the figure moved across without walking: ${measured}`);
    },

    async "a click on the figure sends it walking or hopping out of the box it was in, never across the page in one frame"(page, url) {
        await working(page);
        await page.goto(`${url}#/main`);
        await page.locator(FIGURE).waitFor({state: "visible"});
        await settled(page);
        const before = await page.locator(FIGURE).boundingBox();
        await page.locator(`${FIGURE}-body`).click();
        const frames = await framesOf(page, 8000);
        await settled(page);
        const after = await page.locator(FIGURE).boundingBox();
        const overlapping =
            before.x < after.x + after.width &&
            after.x < before.x + before.width &&
            before.y < after.y + after.height &&
            after.y < before.y + before.height;
        const leaps = frames.slice(1).map((frame, at) => Math.abs(frame.x - frames[at].x));
        const leap = Math.max(0, ...leaps);
        const onTheSpot = longestRun(frames, (frame, last) => frame.walking && frame.x === last.x && frame.y === last.y);
        const measured = `from ${Math.round(before.x)},${Math.round(before.y)} to ${Math.round(after.x)},${Math.round(after.y)}, longest step across ${leap.toFixed(1)}px, longest walk on the spot ${onTheSpot}`;
        console.log(`the figure clicked away: ${measured}`);
        if (overlapping) throw new Error(`clicked, the figure stayed over the box it was in: ${measured}`);
        if (leap > MOST_ACROSS_IN_A_FRAME) throw new Error(`clicked, the figure jumped across the page: ${measured}`);
        if (onTheSpot > CATCH_UP_FRAMES) throw new Error(`clicked, the figure walked on the spot: ${measured}`);
    },

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
        await settled(page);
        const covered = await hidden(page);
        if (covered.length) throw new Error(`standing at the question's tab the figure hides ${covered.join(", ")}`);
        await shot(page, "figure-at-the-question-tab");
    },

    async "on a page with no compose box it stands on the page's own floor, off the activity rail and over no control"(page, url) {
        await working(page);
        await page.goto(`${url}#/main/todo`);
        await page.locator(FIGURE).waitFor({state: "visible"});
        await settled(page);
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

    async "when the profiles cannot be read at first, as while the server restarts, the figure arrives once they can, with no reload"(
        page,
        url
    ) {
        await working(page);
        let refusing = true;
        let refused = 0;
        await page.route(/\/api\/main\/profile\?/, (route) =>
            refusing ? (refused++, route.abort("connectionrefused")) : route.continue()
        );
        await page.goto(`${url}#/main`);
        await page.waitForTimeout(5000);
        if (!refused) throw new Error("the profiles were never asked for while they could not be read");
        if (await page.locator(FIGURE).isVisible()) throw new Error("the figure showed before its voice's profile could be read");
        refusing = false;
        await page.locator(FIGURE).waitFor({state: "visible", timeout: 40000});
    },
});
