import {api} from "../api/client.js";
import {patched, rows} from "../sync/rows.js";

const act = (plan, method) => api.act("plans", plan.id, method);
const becomes = (state) => (plan) => (plan.state = state);

export const approvePlan = (plan) => patched(plan, becomes("approved"), () => act(plan, "approve"));

export const parkPlan = (plan) => patched(plan, becomes("parked"), () => act(plan, "suspend"));

export function startPlan(plan) {
    const takeOver = (row) => {
        rows("plans")
            .filter((p) => p !== row && p.state === "started")
            .forEach(becomes("parked"));
        becomes("started")(row);
    };
    return patched(plan, takeOver, () => act(plan, "start"));
}
