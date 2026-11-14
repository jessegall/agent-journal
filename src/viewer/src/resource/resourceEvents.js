import {inject, onScopeDispose} from "vue";
import {coalesced} from "../composables/coalesced.js";
import {WindowSubscriptions} from "../windows/windowSubscriptions.js";
import {WINDOW_CONTEXT} from "../../kit/windowContextKey.js";

export const RESOURCE_SUBSCRIPTIONS = Symbol("resource-subscriptions");

// the stage's subscriptions, or inside a module's window the window's own, so a resource drawn there still hears its events
function resourceFollow() {
    const subscriptions = inject(RESOURCE_SUBSCRIPTIONS, null);
    if (subscriptions) return (patterns, heard) => subscriptions.follow("resources", patterns, heard);
    const context = inject(WINDOW_CONTEXT, null);
    if (context) return (patterns, heard) => context.subscriptions.follow(context.window, patterns, heard);
    const unconnected = new WindowSubscriptions();
    return (patterns, heard) => unconnected.follow("resources", patterns, heard);
}

export function useResourceEvents(patterns, read, concerns = () => true) {
    const refresh = coalesced(read, 100);
    const stop = resourceFollow()(patterns, (event) => {
        if (concerns(event)) refresh();
    });
    onScopeDispose(() => {
        stop();
        refresh.cancel();
    });
}
