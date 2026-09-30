<script setup>
import {computed, onUnmounted, ref} from "vue";
import {phone} from "../api/phone.js";
import {usePoll} from "../poll.js";
import {TICK, line, visibleQueue} from "../layout/bar.js";

const BAR_EVERY = 1000;
const queue = ref([]);
const state = ref({at: 0, since: 0});
const message = ref(null);
const elapsed = ref(0);

usePoll(
    "phone-bar",
    () => phone.bar().catch(() => null),
    BAR_EVERY,
    (got) => got && Array.isArray(got.queue) && (queue.value = got.queue),
);

function step() {
    const now = Date.now() / 1000;
    const got = visibleQueue(queue.value, state.value, now);
    if (got.at !== state.value.at || got.since !== state.value.since) state.value = {at: got.at, since: got.since};
    if (got.message !== message.value) message.value = got.message;
    const seconds = got.message ? Math.floor(Math.max(0, now - got.since)) : 0;
    if (seconds !== elapsed.value) elapsed.value = seconds;
}

const ticking = setInterval(step, TICK);
onUnmounted(() => clearInterval(ticking));

const shown = computed(() => line(message.value, elapsed.value));
</script>

<template>
    <p class="status">
        <template v-if="shown">
            <span class="status-text">{{ shown.text }}</span>
            <span class="status-clock">{{ shown.clock }}</span>
        </template>
    </p>
</template>

<style scoped>
.status {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    height: 22px;
    margin: 0;
    padding: 0 2px;
    overflow: hidden;
    contain: strict;
    color: var(--text-3);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11px;
}

.status-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.status-clock {
    flex: none;
}
</style>
