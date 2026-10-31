import {createApp, h, nextTick} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {expect, test} from "vitest";
import ReviewerSteps from "../../core/modules/reviews/web/src/ReviewerSteps.vue";
import {context, page} from "./support/windowContext.js";

const MINUTE = 60 * 1000;
const at = (minutesAgo) => new Date(Date.now() - minutesAgo * MINUTE).toISOString();

async function mounted(windowContext) {
    const element = document.createElement("div");
    const app = createApp({render: () => h(ReviewerSteps)});
    app.provide(WINDOW_CONTEXT, windowContext);
    app.mount(element);
    for (let round = 0; round < 5; round++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve));
    return element;
}

test("with no review the window says so, in the words of version 4", async () => {
    const element = await mounted(context({"review list": page([])}, 2));
    expect(element.textContent).toContain("No review yet");
    expect(element.textContent).toContain("The reviewer shows here what it does with each worker's work");
});

test("the steps of the latest review are drawn in order, a dot for each outcome and how long ago", async () => {
    const steps = [
        {id: 1, text: "Started reviewing task 1", outcome: "none", created_at: at(5)},
        {id: 2, text: "1 passed", outcome: "passed", created_at: at(3)},
        {id: 3, text: "2 short: wrong total", outcome: "failed", created_at: at(1)},
    ];
    const windowContext = context({"review list": page([{id: 1, state: "reviewing"}]), "review-step list": page(steps)}, 2);
    const element = await mounted(windowContext);
    const items = [...element.querySelectorAll(".step")];
    expect(items.map((item) => item.querySelector(".text").textContent)).toEqual(["Started reviewing task 1", "1 passed", "2 short: wrong total"]);
    expect(items.map((item) => item.querySelector(".dot").dataset.outcome)).toEqual(["none", "passed", "failed"]);
    expect(items[0].querySelector("time").textContent).toBe("5 min ago");
    expect(windowContext.reads).toContain("review-step list --review 1 --oldest");
});

test("the number of reviews waiting in the queue is shown", async () => {
    const answers = {"review list --state queued": page([{id: 2}, {id: 3}]), "review list": page([])};
    const element = await mounted(context(answers, 2));
    expect(element.textContent).toContain("2 reviews waiting");
});
