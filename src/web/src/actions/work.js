import {api} from "../api/client.js";
import {planButton} from "../layout/statusline.js";
import {store} from "../state/store.js";

const AUTO = "work_tracking.auto";

export async function setAuto(on, client = api) {
    const features = client === api && store.settings ? store.settings.features : null;
    const was = features?.[AUTO];
    if (features) features[AUTO] = on;
    try {
        return await client.saveSettings({features: {[AUTO]: on}});
    } catch (e) {
        if (features) features[AUTO] = was;
        throw e;
    }
}

export function runPlan(plan, client = api) {
    return client.act("plan", plan.n, planButton(plan)[0]);
}
