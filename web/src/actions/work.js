import {api} from "../api/client.js";
import {planButton} from "../layout/statusline.js";

export function setAuto(on, client = api) {
    return client.saveSettings({features: {"work.auto": on}});
}

export function runPlan(plan, client = api) {
    return client.act("plan", plan.n, planButton(plan)[0]);
}
