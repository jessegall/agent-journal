import {planButton} from "../domain/plans.js";
import {saveSettings} from "./settings.js";
import {api} from "../api/client.js";
import {store} from "../state/store.js";

const AUTO = "work_tracking.auto";

export function setAuto(on, client = api) {
    return saveSettings({features: {[AUTO]: on}}, client);
}

export function runPlan(plan, client = api) {
    return client.act("plan", plan.n, planButton(plan)[0]);
}
