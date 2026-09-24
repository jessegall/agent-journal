import {narrow} from "../platform/view.js";
import {store} from "../state/store.js";

export const activityShown = () => (narrow.value ? store.activityOpen : store.activity);

export function toggleActivity() {
    if (narrow.value) store.activityOpen = !store.activityOpen;
    else store.activity = !store.activity;
}

export function closeOverlays() {
    store.sideOpen = false;
    store.activityOpen = false;
}
