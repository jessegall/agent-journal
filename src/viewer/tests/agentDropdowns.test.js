import {afterEach, expect, test} from "vitest";
import WorkerDropdown from "../../suites/coding/modules/workers/web/src/WorkerDropdown.vue";
import ReviewerDropdown from "../../core/modules/reviews/web/src/ReviewerDropdown.vue";
import {opening} from "../src/route.js";
import {context, mounted, page, settle} from "./support/windowContext.js";
import {workersWindowContext} from "./support/workersWindowContext.js";

afterEach(() => opening([]));

const WORKER_TABS = [{key: "workers", label: "Workers", read: "agent list --role worker"}, {key: "recent", label: "Recent activity", read: "chat-mark main --type workers.worker"}];

test("the workers dropdown lists running workers first, counts them, and each opens its panel", async () => {
    const element = await mounted(WorkerDropdown, {...workersWindowContext({"agent list --role worker": page([
        {id: 3, session: "ended", ended_at: "2026-11-01T10:00:00Z"},
        {id: 5, session: "going", ended_at: null},
    ])}), tabs: WORKER_TABS});
    const rows = [...element.querySelectorAll("[data-agent-row]")];
    expect(rows.map((row) => row.dataset.agentRow)).toEqual(["5", "3"]);
    expect(rows[0].textContent).toContain("Running");
    expect(rows[1].textContent).toContain("Closed");
    expect(element.querySelector("[data-agent-rows-count]").textContent).toBe("1 running");
    rows[0].click();
    expect(window.location.href).toContain("agents:5");
});

test("the workers dropdown's Recent activity tab lists the workers' moments newest first, opens the worker, and says when there are none", async () => {
    const moments = [{id: 8, text: "Ada sent its next job", target_model: "agents", target_id: 5, created_at: "2026-11-01T10:00:00Z"}, {id: 7, text: "Ada started task 4", target_model: "agents", target_id: 5, created_at: "2026-11-01T09:00:00Z"}];
    const element = await mounted(WorkerDropdown, {...workersWindowContext({"agent list --role worker": page([]), "chat-mark main --type workers.worker": page(moments)}), tabs: WORKER_TABS});
    element.querySelector('[data-tab="recent"]').click();
    await settle();
    const rows = [...element.querySelectorAll("[data-worker-moment]")];
    expect(rows.map((row) => row.querySelector(".worker-moment-text").textContent)).toEqual(["Ada sent its next job", "Ada started task 4"]);
    rows[0].click();
    expect(window.location.href).toContain("agents:5");
    const none = await mounted(WorkerDropdown, {...workersWindowContext({"agent list --role worker": page([]), "chat-mark main --type workers.worker": page([])}), tabs: WORKER_TABS});
    none.querySelector('[data-tab="recent"]').click();
    await settle();
    expect(none.textContent).toContain("No worker has done anything noteworthy yet");
});

test("the reviewers dropdown reads its own role and says when there are none", async () => {
    const element = await mounted(ReviewerDropdown, context({"agent list --role reviewer": page([])}));
    expect(element.textContent).toContain("No reviewers have been sent from here");
});
