<script setup>
import {computed, ref} from "vue";
import {phone} from "../api/phone.js";
import {usePoll} from "../poll.js";
import {line} from "../layout/bar.js";
import {useBarLine} from "../composables/barLine.js";

const BUSY_EVERY = 1000;
const CALM_EVERY = 3000;
const props = defineProps({working: {type: Boolean, default: false}});
const queue = ref([]);

usePoll(
    "phone-bar",
    () => phone.bar().catch(() => null),
    () => (props.working ? BUSY_EVERY : CALM_EVERY),
    (got) => got && Array.isArray(got.queue) && (queue.value = got.queue)
);

const {message, elapsed} = useBarLine(() => queue.value);

const shown = computed(() => line(message.value, elapsed.value));
const RECENT = 5;
const open = ref(false);
const recent = computed(() =>
    queue.value
        .slice(-RECENT)
        .map((one) => line(one, 0))
        .filter(Boolean)
        .reverse()
);
</script>

<template>
    <div :class="['status-wrap', {empty: !shown}]">
        <template v-if="open && recent.length">
            <ul class="status-recent" @click="open = false">
                <template v-for="one in recent" :key="one.key">
                    <li :class="{done: one.done}">{{ one.text }}</li>
                </template>
            </ul>
        </template>
        <p class="status" @click="open = !open">
            <template v-if="shown">
                <span class="status-text">{{ shown.text }}</span>
                <span class="status-clock">{{ shown.clock }}</span>
            </template>
        </p>
    </div>
</template>

<style scoped>
.status-wrap {
    position: relative;
    flex: none;
}

.status-recent {
    position: absolute;
    right: 0;
    bottom: 100%;
    left: 0;
    z-index: 5;
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 0 0 4px;
    padding: 8px 10px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    color: var(--text-2);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 0.676rem;
    list-style: none;
}

.status-recent li {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.status-recent li.done {
    color: var(--text-4);
}

.status {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    min-height: 22px;
    margin: 0;
    padding: 0 2px;
    contain: layout;
    color: var(--text-3);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 0.647rem;
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
