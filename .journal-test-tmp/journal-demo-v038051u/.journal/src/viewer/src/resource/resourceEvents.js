import {inject, onScopeDispose} from "vue";
import {coalesced} from "../composables/coalesced.js";
import {WindowSubscriptions} from "../windows/windowSubscriptions.js";

export const RESOURCE_SUBSCRIPTIONS = Symbol("resource-subscriptions");

export function useResourceEvents(patterns, read) {
    const subscriptions = inject(RESOURCE_SUBSCRIPTIONS, () => new WindowSubscriptions(), true);
    const refresh = coalesced(read, 100);
    const stop = subscriptions.follow("resources", patterns, refresh);
    onScopeDispose(() => {
        stop();
        refresh.cancel();
    });
}
