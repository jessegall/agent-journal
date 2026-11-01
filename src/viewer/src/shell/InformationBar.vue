<script setup>
import {computed} from "vue";

// the one line under the agent bar, as version 4's information bar drew it: the program, the state and how long the agent has run
const props = defineProps({
    agent: {type: Object, default: null},
    facts: {type: Object, default: () => ({helpers: 0, tasks: 0, waiting: 0})},
    now: {type: Number, default: () => Date.now()},
});
const emit = defineEmits(["open"]);
// each count asks to open what it counts; the stage knows which window that is
const COUNTS = [
    {key: "tasks", title: "Open tasks"},
    {key: "waiting", title: "Questions waiting"},
    {key: "helpers", title: "Helpers running"},
];
const running = computed(() => Boolean(props.agent) && !props.agent.ended_at);
const uptime = computed(() => {
    const started = props.agent?.process_started_at ? new Date(props.agent.process_started_at).getTime() : 0;
    const minutes = started ? Math.max(0, Math.floor((props.now - started) / 60000)) : 0;
    return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
});
</script>

<template>
    <div class="information" data-information-bar>
        <template v-if="agent">
            <span>{{ agent.program }}</span>
            <span>{{ running ? "Working" : "Ended" }}</span>
            <span>{{ uptime }} up</span>
            <template v-for="count in COUNTS" :key="count.key">
                <button type="button" class="information-count" :data-count="count.key" :title="count.title" @click="emit('open', count.key)">
                    {{ facts[count.key] }} <span class="information-count-name">{{ count.title.toLowerCase() }}</span>
                </button>
            </template>
        </template>
    </div>
</template>

<style scoped>
.information {
    display: flex;
    gap: 16px;
    align-items: center;
    min-height: 30px;
    padding: 0 16px;
    border-bottom: 1px solid var(--border);
    color: var(--text-3);
    font-size: 12px;
}
.information-count {
    padding: 2px 6px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
}

.information-count:hover {
    background: var(--hover);
    color: var(--text);
}
</style>
