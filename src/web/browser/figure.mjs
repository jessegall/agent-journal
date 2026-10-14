import {journal, numberOf, runScenarios, shot} from "./harness.mjs";

// The figure belongs to the avatar feature, which is off in a fresh journal, so without this every scenario here waits for a
// figure that is never mounted and times out. It was off for long enough that all seven did.
journal("feature", "switch", "avatar", "--on");

const FIGURE = ".voice-figure";
const HOME = "[data-figure-home]";
const DOCKS = "[data-figure-docked-bars]";
const CLOSE_THE_BAR = 'section[aria-label="Update report"] .btn.icon';
// the most of its whole fall the figure may come down in one frame as the bar under it goes
const MOST_OF_A_FALL_IN_A_FRAME = 0.5;
// the most of a hop's height the figure may cover in one frame of it, so the jump and the fall stepped in code never snap
const MOST_OF_A_HOP_IN_A_FRAME = 0.25;

// the environment's agent as the agent list reports it, with `data` on its row
async function agentAs(page, data) {
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
            data: {at: now, provider: "claude", model: "opus", ...data},
        };
        await route.fulfill({response, json: {...body, rows: [row, ...(body.rows || [])]}});
    });
}

// at work with a search in flight
const working = (page) => agentAs(page, {status: "working", event: "PreToolUse", tool: "Grep"});

// idle, waiting for the user's next message
const idle = (page) => agentAs(page, {status: "idle"});

// paused, so its figure sits on a corner of the compose box
const paused = (page) => agentAs(page, {status: "idle", paused: true});

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
                    frames.push({
                        x: box.left,
                        y: box.top,
                        t: performance.now(),
                        walking: element.dataset.walking === "true",
                        hopping: element.dataset.hopping === "true",
                        trip: element.dataset.trip,
                        clip: element.dataset.clip,
                    });
                    if (performance.now() < until) requestAnimationFrame(look);
                    else done(frames);
                };
                requestAnimationFrame(look);
            }),
        [FIGURE, ms]
    );

// the runs of frames in a row that `holds` holds for
const runsOf = (frames, holds) =>
    frames.reduce((runs, frame, at) => {
        if (!holds(frame)) return runs;
        if (at && holds(frames[at - 1])) runs.at(-1).push(frame);
        else runs.push([frame]);
        return runs;
    }, []);

// How far the figure moved on each frame, by `of`, weighed against the longer of the last two gaps between frames in frames' worth of
// time, as after a frame stalled on a busy machine the figure makes up the stalled stretch one frame late
const weighedSteps = (frames, of) =>
    frames
        .slice(2)
        .map(
            (frame, at) =>
                Math.abs(of(frame) - of(frames[at + 1])) /
                Math.max(1, (frame.t - frames[at + 1].t) / FRAME_MS, (frames[at + 1].t - frames[at].t) / FRAME_MS)
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

// the frames as runs of the same place, walk, trip and clip, each with the milliseconds since the first, so a failure shows where the figure was and when
const trail = (frames) => {
    const runs = [];
    for (const f of frames) {
        const said = `${Math.round(f.x)},${Math.round(f.y)}${f.walking ? "W" : ""}:${f.trip || "-"}:${f.clip}`;
        if (runs.length && runs.at(-1)[0] === said) runs.at(-1)[1]++;
        else runs.push([said, 1, Math.round(f.t - frames[0].t)]);
    }
    return runs.map(([said, n, at]) => `${n}x${said}@${at}`).join(" ");
};

// a frame or two either side of a leg is the page catching up with the clock that started or ended it; more is the walk on the spot
const CATCH_UP_FRAMES = 3;

// the walk covers a pixel or two a frame and a hop goes straight up or down, so a figure that moves further across in one frame jumped;
// a busy page draws fewer frames, and the first after a stall can still show where the figure was, so the step is reckoned over two
// frames and per sixtieth of a second, never per frame drawn
const MOST_ACROSS_IN_A_FRAME = 12;
const FRAME_MS = 1000 / 60;

// how long a picture may take to finish easing from one posture to the next once the figure moves off, CHANGE_SECONDS, in milliseconds
const SETTLING_MS = 300;

// a click on the figure while its agent is as `agent` sets: it walks or hops out of the box it was in, never across the page in one frame
async function clickedAway(page, url, agent) {
    await agent(page);
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
    const leaps = weighedSteps(frames, (frame) => frame.x);
    const leap = Math.max(0, ...leaps);
    const onTheSpot = longestRun(frames, (frame, last) => frame.walking && frame.x === last.x && frame.y === last.y);
    const clip = await page.locator(FIGURE).evaluate((figure, home) => {
        const ground = document.querySelector(home)?.getBoundingClientRect();
        const trip = figure.dataset.trip ? `, ${figure.dataset.trip}` : ", on no trip";
        return `${figure.dataset.clip} clip, walking ${figure.dataset.walking}${trip}, ground ${ground ? `${Math.round(ground.left)}..${Math.round(ground.right)} at ${Math.round(ground.top)}` : "none"}`;
    }, HOME);
    const measured = `from ${Math.round(before.x)},${Math.round(before.y)} to ${Math.round(after.x)},${Math.round(after.y)}, longest step across ${leap.toFixed(1)}px, longest walk on the spot ${onTheSpot}, ${clip}`;
    console.log(`the figure clicked away, ${agent.name}: ${measured}`);
    if (overlapping) throw new Error(`clicked while ${agent.name}, the figure stayed over the box it was in: ${measured}`);
    if (leap > MOST_ACROSS_IN_A_FRAME) throw new Error(`clicked, the figure jumped across the page: ${measured}; FRAMES ${trail(frames)}`);
    if (onTheSpot > CATCH_UP_FRAMES) throw new Error(`clicked, the figure walked on the spot: ${measured}`);
}

// the scenario of a bar closing under the figure: it is docked, the figure stands on it, the bar is closed and every frame is read
async function fallsWhenClosed(page, url, agent) {
    await agent(page);
    await page.goto(`${url}#/main`);
    await page.locator(FIGURE).waitFor({state: "visible"});
    await page.locator(DOCKS).waitFor({state: "attached"});
    await settled(page);
    const frames = await page.evaluate(
        ([figure, close]) =>
            new Promise((done) => {
                const element = document.querySelector(figure);
                const frames = [];
                const until = performance.now() + 2500;
                document.querySelector(close).click();
                const look = () => {
                    frames.push({bottom: element.getBoundingClientRect().bottom, t: performance.now()});
                    if (performance.now() < until) requestAnimationFrame(look);
                    else done(frames);
                };
                requestAnimationFrame(look);
            }),
        [FIGURE, CLOSE_THE_BAR]
    );
    const drop = frames.at(-1).bottom - frames[0].bottom;
    const steps = weighedSteps(frames, (frame) => frame.bottom);
    const longest = Math.max(0, ...steps);
    const falling = steps.filter((step) => step > 0.5).length;
    const measured = `fell ${drop.toFixed(1)}px over ${falling} frames, longest step ${longest.toFixed(1)}px a frame; FRAMES ${frames.map((frame) => `${frame.bottom.toFixed(0)}@${frame.t.toFixed(0)}`).join(" ")}`;
    console.log(`the figure's fall: ${measured}`);
    if (drop < 10) throw new Error(`the bar closed, the figure did not come down: ${measured}`);
    if (longest > drop * MOST_OF_A_FALL_IN_A_FRAME) throw new Error(`the bar closed, the figure snapped down: ${measured}`);
}

await runScenarios(process.argv[2], {
    async "the walk plays only while the figure moves across, and the figure moves across only while it walks"(page, url) {
        await working(page);
        await page.goto(`${url}#/main`);
        await page.locator(FIGURE).waitFor({state: "visible"});
        await settled(page);
        await page.locator(`${FIGURE}-body`).click();
        const frames = await framesOf(page, 8000);
        const across = (frame, before) => Math.abs(frame.x - before.x) > 0.05;
        const walked = frames.filter((frame) => frame.walking).length;
        const onTheSpot = longestRun(frames, (frame, before) => frame.walking && !across(frame, before) && frame.y === before.y);
        const gliding = longestRun(frames, (frame, before) => !frame.walking && across(frame, before));
        const measured = `${frames.length} frames, ${walked} walking, longest walk on the spot ${onTheSpot}, longest glide ${gliding}`;
        console.log(`the figure's walk: ${measured}`);
        const state = await page.evaluate((figure) => JSON.stringify(document.querySelector(figure)?.dataset || {}), FIGURE);
        if (!walked) throw new Error(`clicked, the figure never walked: ${measured}; figure ${state}`);
        if (onTheSpot > CATCH_UP_FRAMES) throw new Error(`the figure walked on the spot: ${measured}`);
        if (gliding > CATCH_UP_FRAMES) throw new Error(`the figure moved across without walking: ${measured}; FRAMES ${trail(frames)}`);
    },

    async "closing the bar docked under the figure lets it fall down onto the compose box, never down in one frame"(page, url) {
        for (const agent of [paused, working]) {
            const report = numberOf(journal("report", "recap", "The figure stands on this bar until it is closed."));
            try {
                await fallsWhenClosed(page, url, agent);
            } finally {
                journal("report", "dismiss", String(report));
            }
        }
    },

    async "a walking figure falls frame by frame when the floor it walks on drops away, and lands on it"(page, url) {
        await working(page);
        await page.goto(`${url}#/main`);
        await page.locator(FIGURE).waitFor({state: "visible"});
        await settled(page);
        await page.locator(`${FIGURE}-body`).click();
        const frames = await page.evaluate(
            ([figure, home]) =>
                new Promise((done, failed) => {
                    const element = document.querySelector(figure);
                    const floor = document.querySelector(home);
                    const frames = [];
                    const until = performance.now() + 6000;
                    let dropped = 0;
                    const look = () => {
                        const bottom = element.getBoundingClientRect().bottom;
                        if (!dropped && element.dataset.walking === "true") {
                            floor.style.transform = "translateY(40px)";
                            dropped = performance.now();
                        }
                        if (dropped) frames.push({bottom, floor: floor.getBoundingClientRect().top, t: performance.now()});
                        if (dropped && performance.now() > dropped + 1500) return done(frames);
                        if (performance.now() > until) return failed(new Error("the figure never walked after the click"));
                        requestAnimationFrame(look);
                    };
                    requestAnimationFrame(look);
                }),
            [FIGURE, HOME]
        );
        const drop = frames.at(-1).bottom - frames[0].bottom;
        const longest = Math.max(0, ...weighedSteps(frames, (frame) => frame.bottom));
        const measured = `fell ${drop.toFixed(1)}px, longest step ${longest.toFixed(1)}px a frame, ending ${(frames.at(-1).bottom - frames.at(-1).floor).toFixed(1)}px past the floor's top`;
        console.log(`a walker's fall: ${measured}`);
        if (drop < 30) throw new Error(`the floor dropped 40px under a walking figure and it did not come down: ${measured}`);
        if (longest > drop * MOST_OF_A_FALL_IN_A_FRAME) throw new Error(`the walking figure snapped down: ${measured}`);
    },

    async "a hop stepped in code rises and falls frame by frame, never covering much of its height in one frame"(page, url) {
        await working(page);
        await page.goto(`${url}#/main`);
        await page.locator(FIGURE).waitFor({state: "visible"});
        await settled(page);
        // the figure roams onto bubbles and tabs and back by its own odds; a click now and then sends it on, until it has hopped
        let hops = [];
        for (let round = 0; round < 8 && !hops.length; round++) {
            await page.locator(`${FIGURE}-body`).click();
            const frames = await framesOf(page, 6000);
            hops = runsOf(frames, (frame) => frame.hopping).filter((run) => Math.abs(run.at(-1).y - run[0].y) > 20);
        }
        if (!hops.length) throw new Error("the figure never hopped in eight rounds of clicks");
        for (const hop of hops) {
            const height = Math.abs(hop.at(-1).y - hop[0].y);
            const longest = Math.max(0, ...weighedSteps(hop, (frame) => frame.y));
            const measured = `a ${hop[0].clip} of ${height.toFixed(0)}px in ${hop.length} frames, longest step ${longest.toFixed(1)}px a frame`;
            console.log(`a hop: ${measured}`);
            if (longest > height * MOST_OF_A_HOP_IN_A_FRAME) throw new Error(`the hop snapped: ${measured}`);
        }
    },

    async "a click on the figure sends it walking or hopping out of the box it was in, never across the page in one frame"(page, url) {
        for (const agent of [working, idle, paused]) await clickedAway(page, url, agent);
    },

    async "while it gets up to go, the figure keeps to the compose box as the box moves under it, and then walks level along it"(
        page,
        url
    ) {
        await paused(page);
        await page.goto(`${url}#/main`);
        await page.locator(FIGURE).waitFor({state: "visible"});
        await settled(page);
        const RISE = 48;
        const frames = await page.evaluate(
            ([figure, home, rise]) =>
                new Promise((done) => {
                    const element = document.querySelector(figure);
                    const box = document.querySelector(home);
                    const frames = [];
                    const until = performance.now() + 6000;
                    // clicked, the seated figure gets up to go to the other corner, and in the same moment the box rises under it
                    element.querySelector(`${figure}-body`).click();
                    box.style.transform = `translateY(-${rise}px)`;
                    const look = () => {
                        const picture = element.getBoundingClientRect();
                        const walking = element.dataset.walking === "true";
                        frames.push({bottom: picture.bottom, edge: box.getBoundingClientRect().top, walking, t: performance.now()});
                        if (performance.now() < until) requestAnimationFrame(look);
                        else done(frames);
                    };
                    requestAnimationFrame(look);
                }),
            [FIGURE, HOME, RISE]
        );
        // past its first steps, as the picture finishes easing up from the seat, the walking figure's feet are on the box's edge
        const walked = frames.filter((frame) => frame.walking);
        const strides = walked.filter((frame) => frame.t >= walked[0].t + SETTLING_MS);
        const off = Math.max(0, ...strides.map((frame) => Math.abs(frame.bottom - frame.edge)));
        const measured = `${strides.length} walking frames, feet at most ${off.toFixed(1)}px from the edge, which rose ${RISE}px`;
        console.log(`the figure getting up as the box moved: ${measured}`);
        if (!strides.length) throw new Error(`clicked, the seated figure never walked to the other corner: ${measured}`);
        if (off > 12) throw new Error(`the figure walked off the edge it got up from: ${measured}`);
    },

    async "the figure is drawn on the Home page alone, and on coming back to Home it enters again on the compose box"(page, url) {
        await working(page);
        await page.goto(`${url}#/main`);
        await page.locator(FIGURE).waitFor({state: "visible"});
        await page.goto(`${url}#/main/todo`);
        await page.locator(FIGURE).waitFor({state: "detached"});
        await page.goto(`${url}#/main`);
        await page.locator(FIGURE).waitFor({state: "visible"});
        await page.waitForFunction(
            ([figure, home]) => {
                const feet = document.querySelector(figure).getBoundingClientRect().bottom;
                return Math.abs(feet - document.querySelector(home).getBoundingClientRect().top) < 12;
            },
            [FIGURE, HOME]
        );
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
