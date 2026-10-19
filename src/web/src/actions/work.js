import {planButton} from "../domain/plans.js";
import {saveSettings} from "./settings.js";
import {api} from "../api/client.js";
import {store} from "../state/store.js";

export function setAuto(on, client = api) {
    return saveSettings({tasks: {...((store.settings && store.settings.tasks) || {}), auto: on}}, client);
}

export function runPlan(plan, client = api) {
    return client.act("plans", plan.id, planButton(plan)[0]);
}
