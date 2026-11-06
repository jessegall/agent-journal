import {reviewerWindowContext} from "./support/reviewerWindowContext.js";
import {expect, test} from "vitest";
import ReviewerSteps from "../../core/modules/reviews/web/src/ReviewerSteps.vue";
import {context, mounted} from "./support/windowContext.js";

const MINUTE = 60 * 1000;
const at = (minutesAgo) => new Date(Date.now() - minutesAgo * MINUTE).toISOString();

test("with no review the window says so", async () => {
    const element = await mounted(ReviewerSteps, reviewerWindowContext({"review board": {ok: true, value: {queued: 0, reviews: []}}}, 2));
    expect(element.textContent).toContain("No review yet");
    expect(element.textContent).toContain("Reviews appear here with test results, requirement checks and the reviewer’s report.");
});

test("the steps of the latest review are drawn in order, a dot for each outcome and how long ago", async () => {
    const steps = [
        {id: 1, text: "Started reviewing task 1", outcome: "none", created_at: at(5)},
        {id: 2, text: "1 passed", outcome: "passed", created_at: at(3)},
        {id: 3, text: "2 short: wrong total", outcome: "failed", created_at: at(1)},
    ];
    const windowContext = reviewerWindowContext({"review board": {ok: true, value: {queued: 0, reviews: [{id: 1, title: "task 1", steps}]}}}, 2);
    const element = await mounted(ReviewerSteps, windowContext);
    const items = [...element.querySelectorAll(".step")];
    expect(items.map((item) => item.querySelector(".text").textContent)).toEqual(["Started reviewing task 1", "1 passed", "2 short: wrong total"]);
    expect(items.map((item) => item.querySelector(".dot").dataset.outcome)).toEqual(["none", "passed", "failed"]);
    expect(items[0].querySelector("time").textContent).toBe("5m ago");
    expect(windowContext.reads).toEqual(["review board"]);
});

test("the number of reviews waiting in the queue is shown", async () => {
    const element = await mounted(ReviewerSteps, reviewerWindowContext({"review board": {ok: true, value: {queued: 2, reviews: []}}}, 2));
    expect(element.textContent).toContain("2 reviews waiting");
});
