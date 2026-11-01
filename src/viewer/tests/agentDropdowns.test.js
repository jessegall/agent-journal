import {afterEach, expect, test} from "vitest";
import WorkerDropdown from "../../suites/coding/modules/workers/web/src/WorkerDropdown.vue";
import ReviewerDropdown from "../../core/modules/reviews/web/src/ReviewerDropdown.vue";
import {opening} from "../src/route.js";
import {context, mounted, page} from "./support/windowContext.js";

afterEach(() => opening([]));

test("the workers dropdown lists running workers first, counts them, and each opens its panel", async () => {
    const element = await mounted(WorkerDropdown, context({"agent list --role worker": page([
        {id: 3, session: "ended", ended_at: "2026-11-01T10:00:00Z"},
        {id: 5, session: "going", ended_at: null},
    ])}));
    const rows = [...element.querySelectorAll("[data-agent-row]")];
    expect(rows.map((row) => row.dataset.agentRow)).toEqual(["5", "3"]);
    expect(rows[0].textContent).toContain("Running");
    expect(rows[1].textContent).toContain("Closed");
    expect(element.querySelector("[data-agent-rows-count]").textContent).toBe("1 running");
    rows[0].click();
    expect(window.location.href).toContain("agents:5");
});

test("the reviewers dropdown reads its own role and says when there are none", async () => {
    const element = await mounted(ReviewerDropdown, context({"agent list --role reviewer": page([])}));
    expect(element.textContent).toContain("No reviewers have been sent from here");
});
