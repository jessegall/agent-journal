import {api} from "../api/client.js";
import {word} from "../state/store.js";
import {patched, rows} from "../sync/rows.js";

const act = (plan, method) => api.act("plan", plan.n, word("plan", method));
const becomes = (status) => (plan) => (plan.data.status = status);

export const approvePlan = (plan) => patched(plan, becomes("approved"), () => act(plan, "approve"));

export const parkPlan = (plan) => patched(plan, becomes("parked"), () => act(plan, "park"));

export function startPlan(plan) {
    const takeOver = (row) => {
        rows("plan")
            .filter((p) => p !== row && ["active", "waiting"].includes(p.data.status))
            .forEach(becomes("parked"));
        becomes("active")(row);
    };
    return patched(plan, takeOver, () => act(plan, "start"));
}
