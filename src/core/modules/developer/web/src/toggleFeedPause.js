export function toggleFeedPause(paused, load) {
    paused.value = !paused.value;
    if (!paused.value) load();
}
