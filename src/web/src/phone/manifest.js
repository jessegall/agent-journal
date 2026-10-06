import {api} from "../api/client.js";
import {store} from "../state/store.js";

let asked = null;

export const loadSpec = () =>
    (asked ||= api.manifest().then(
        (spec) => (store.spec = spec),
        (error) => {
            asked = null;
            throw error;
        }
    ));
