import {planWindowContext} from "./support/planWindowContext.js";
import {expect, test} from "vitest";
import PlanCards from "../../core/modules/plans/web/src/PlanCards.vue";
import {context, mounted, settle} from "./support/windowContext.js";

const TABS = [{key: "open", label: "Open", read: "plan board", count_field: "open_total"}, {key: "closed", label: "Closed", read: "plan board --closed", count_field: "closed_total"}];
const BOARD = {ok: true, value: {open_total: 3, closed_total: 79, plans: []}};

test("only the active tab reads, the other tab reads when it is opened, and both show their counts", async () => {
    const window = {...planWindowContext({"plan board": BOARD, "plan board --closed": BOARD}), tabs: TABS};
    const element = await mounted(PlanCards, window);
    expect(window.reads).toEqual(["plan board"]);
    expect(element.querySelector('[data-tab="open"]').textContent).toContain("3");
    expect(element.querySelector('[data-tab="closed"]').textContent).toContain("79");
    element.querySelector('[data-tab="closed"]').click();
    await settle();
    expect(window.reads).toEqual(["plan board", "plan board --closed"]);
});

test("choosing the active plan tab keeps its cards and sends no read", async () => {
    const window = {...planWindowContext({"plan board": {ok: true, value: {...BOARD.value, plans: [{id: 1, title: "Cart", state: "started", task_count: 0, completed_count: 0}]}}}), tabs: TABS};
    const element = await mounted(PlanCards, window);
    element.querySelector('[data-tab="open"]').click();
    await settle();
    expect(element.querySelector('[data-row="1"]').textContent).toContain("Cart");
    expect(window.reads).toEqual(["plan board"]);
});
