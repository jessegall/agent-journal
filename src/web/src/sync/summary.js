import {api} from "../api/client.js";
import {store} from "../state/store.js";

let flying = null;

export function readSummary() {
    flying =
        flying ||
        api
            .summary()
            .then((got) => (store.summary = got))
            .finally(() => (flying = null));
    return flying;
}
