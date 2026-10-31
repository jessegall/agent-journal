import {api} from "../api/client.js";
import {patched, rows} from "../sync/rows.js";
import {workMode} from "../composables/settings.js";

const act = (plan, method) => api.act("plans", plan.id, method);
const becomes = (state) => (plan) => (plan.state = state);

export const approvePlan = (plan) => patched(plan, becomes("approved"), () => act(plan, "approve"));

// approves a plan once the comment sent with it is in, naming that comment by the key it was sent with
export function approveWithMessage(id, key) {
    const plan = rows("plans").find((p) => p.id === id);
    return plan ? patched(plan, becomes("approved"), () => api.act("plans", id, "approve", {comment_key: key})) : null;
}

export const pausePlan = (plan) => patched(plan, becomes("paused"), () => act(plan, "pause"));

export const dismissPlan = (plan) => patched(plan, (row) => (row.is_dismissed = true), () => act(plan, "dismiss"));

export function startPlan(plan) {
    const takeOver = (row) => {
        if (workMode.value !== "orchestrator") {
            rows("plans")
                .filter((p) => p !== row && p.state === "started")
                .forEach(becomes("paused"));
        }
        becomes("started")(row);
    };
    return patched(plan, takeOver, () => act(plan, "start"));
}
