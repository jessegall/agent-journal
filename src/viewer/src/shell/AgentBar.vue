<script setup>
import {computed} from "vue";

// the agent the page is about, as version 4's agent bar drew it: whether it runs and the task it is working in
const props = defineProps({agent: {type: Object, default: null}, task: {type: Object, default: null}});
const running = computed(() => Boolean(props.agent) && !props.agent.ended_at);
</script>

<template>
    <div class="agent-state" data-agent-bar>
        <span :class="['dot', {running}]" />
        <template v-if="agent">
            <strong>{{ running ? "Working" : "Ended" }}</strong>
            <template v-if="task">
                <span class="agent-task" data-agent-task :title="task.title">Task {{ task.id }}: {{ task.title }}</span>
            </template>
        </template>
        <template v-else>
            <strong>No agent</strong>
        </template>
    </div>
</template>

<style scoped>
.agent-state {
    display: flex;
    gap: 10px;
    align-items: center;
    min-height: 46px;
    padding: 0 16px;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-4);
}

.dot.running {
    background: var(--accent);
}

.detail {
    color: var(--text-3);
}

.agent-task {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}</style>
