<script setup>
import {computed} from "vue";
import {age, peekRef} from "@journal/window-kit";

// one agent as a card: what it is, how long it has run, the task it works on and its context and cost
const ROLE_NAMES = {main: "Main agent", subagent: "Helper", worker: "Worker", reviewer: "Reviewer"};
const props = defineProps({row: {type: Object, required: true}, facts: {type: Object, default: null}});
const roleName = computed(() => ROLE_NAMES[props.row.role] ?? props.row.role);
const runTime = computed(() => (props.row.ended_at ? `Closed ${new Date(props.row.ended_at).toLocaleString()}` : `Running ${age(props.row.process_started_at || props.row.created_at)}`));
const usage = computed(() => {
    const parts = [];
    if (props.facts?.context_percent !== null && props.facts?.context_percent !== undefined) parts.push(`Context ${props.facts.context_percent}%`);
    if (props.facts?.cost_dollars) parts.push(`$${props.facts.cost_dollars.toFixed(2)}`);
    return parts.join(" · ");
});
</script>

<template>
    <button type="button" class="agent-card" :data-agent-open="row.id" :title="row.session" @click="peekRef(`agents:${row.id}`)">
        <span class="agent-head">
            <span :class="['agent-dot', {running: !row.ended_at}]" />
            <span class="agent-name">{{ roleName }} {{ row.id }}</span>
            <span class="agent-program">{{ row.program }}<template v-if="facts?.model"> · {{ facts.model }}</template></span>
            <span :class="['agent-time', {running: !row.ended_at}]">{{ runTime }}</span>
        </span>
        <template v-if="facts?.task_id">
            <span class="agent-task" data-agent-card-task>Task {{ facts.task_id }}: {{ facts.task_title }}</span>
        </template>
        <template v-if="usage">
            <span class="agent-usage" data-agent-card-usage>{{ usage }}</span>
        </template>
    </button>
</template>

<style scoped>
.agent-card {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
    padding: 9px 12px;
    border: 0;
    border-bottom: 1px solid var(--border);
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.agent-card:hover {
    background: var(--hover);
}

.agent-head {
    display: flex;
    gap: 8px;
    align-items: center;
    min-width: 0;
}

.agent-dot {
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--text-3);
}

.agent-dot.running {
    background: var(--accent);
}

.agent-name {
    flex: none;
    font-weight: 500;
}

.agent-program,
.agent-time,
.agent-usage {
    color: var(--text-3);
    font-size: 12px;
}

.agent-program {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.agent-time {
    flex: none;
}

.agent-time.running {
    color: var(--accent-text);
}

.agent-task {
    overflow: hidden;
    color: var(--text-2);
    font-size: 12.5px;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
