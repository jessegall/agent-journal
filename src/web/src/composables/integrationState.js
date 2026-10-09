import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import {isOn} from "../domain/integrations.js";
import {store} from "../state/store.js";
import {pollKey, usePoll} from "./poll.js";

const EVERY = 15000;

export function useIntegrationState(feature) {
    const on = computed(() => isOn(store.settings, feature.name));
    const state = ref(null);
    const now = usePoll(
        pollKey(),
        () => (on.value ? api.integration(feature.name) : Promise.resolve(null)),
        EVERY,
        (got) => (state.value = got),
        () => on.value
    );
    watch(on, (switchedOn) => switchedOn && now());
    return {on, state};
}
