<script setup>
import {computed, ref} from "vue";
import {age, Icon, MenuItem, MenuPanel, peekRef, useNow} from "@journal/window-kit";

// one agent as a card: what it is, how long it has run, the task it works on and its context and cost; a button on it counts the tasks
// given to it and opens them in a dropdown
const ROLE_NAMES = {main: "Main agent", subagent: "Helper", worker: "Worker", reviewer: "Reviewer"};
const props = defineProps({row: {type: Object, required: true}, facts: {type: Object, default: null}});
const roleName = computed(() => ROLE_NAMES[props.row.role] ?? props.row.role);
const now = useNow();
const runTime = computed(() => (props.row.ended_at ? `Closed ${new Date(props.row.ended_at).toLocaleString()}` : `Running ${age(props.row.process_started_at || props.row.created_at, now.value)}`));
const usage = computed(() => {
    const parts = [];
    if (props.facts?.context_percent !== null && props.facts?.context_percent !== undefined) parts.push(`Context ${props.facts.context_percent}%`);
    if (props.facts?.cost_dollars) parts.push(`$${props.facts.cost_dollars.toFixed(2)}`);
    return parts.join(" · ");
});
const tasks = computed(() => props.facts?.delegated ?? []);
const taskCount = computed(() => `${tasks.value.length} ${tasks.value.length === 1 ? "task" : "tasks"}`);
const anchor = ref(null);
const toggleTasks = (event) => (anchor.value = anchor.value ? null : event.currentTarget);

function openTask(id) {
    anchor.value = null;
    peekRef(`tasks:${id}`);
}
</script>

<template>
    <div class="agent-card" :data-agent-open="row.id" :title="row.session">
        <button type="button" class="agent-open" :aria-label="`Open ${roleName} ${row.id}`" @click="peekRef(`agents:${row.id}`)" />
        <span class="agent-head">
            <span :class="['agent-dot', {running: !row.ended_at}]" />
            <span class="agent-name">{{ roleName }} {{ row.id }}</span>
            <span class="agent-program">{{ row.program }}<template v-if="facts?.model"> · {{ facts.model }}</template></span>
            <span :class="['agent-time', {running: !row.ended_at}]">{{ runTime }}</span>
        </span>
        <template v-if="facts?.task_id || tasks.length">
            <span class="agent-line">
                <span class="agent-task" data-agent-card-task>
                    <template v-if="facts?.task_id">Task {{ facts.task_id }}: {{ facts.task_title }}</template>
                </span>
                <template v-if="tasks.length">
                    <button type="button" class="agent-tasks" data-agent-tasks :aria-expanded="Boolean(anchor)" @click="toggleTasks">
                        {{ taskCount }}
                        <Icon name="caret" :size="12" />
                    </button>
                </template>
            </span>
        </template>
        <template v-if="usage">
            <span class="agent-usage" data-agent-card-usage>{{ usage }}</span>
        </template>
        <template v-if="anchor">
            <MenuPanel :anchor="anchor" :min-width="260" :max-width="420" data-agent-task-menu @close="anchor = null">
                <template v-for="task in tasks" :key="task.id">
                    <MenuItem :data-agent-delegated="task.id" @click="openTask(task.id)">Task {{ task.id }}: {{ task.title }} · {{ task.state }}</MenuItem>
                </template>
            </MenuPanel>
        </template>
    </div>
</template>

<style scoped>
.agent-card {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
    padding: 9px 12px;
    border-bottom: 1px solid var(--border);
}

.agent-card:hover {
    background: var(--hover);
}

/* the whole card is the button that opens the agent; the tasks button sits above it, as a button cannot hold a button */
.agent-open {
    position: absolute;
    inset: 0;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
}

.agent-head,
.agent-line,
.agent-usage {
    position: relative;
    pointer-events: none;
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

.agent-line {
    display: flex;
    gap: 8px;
    align-items: center;
    min-width: 0;
}

.agent-tasks {
    display: inline-flex;
    flex: none;
    gap: 4px;
    align-items: center;
    margin-left: auto;
    padding: 1px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    pointer-events: auto;
}

.agent-tasks:hover {
    background: var(--hover);
    color: var(--text);
}

.agent-task {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text-2);
    font-size: 12.5px;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
