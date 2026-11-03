<script setup>
import {computed, onUnmounted, ref} from "vue";
import {age, Btn, Icon, peekRef, RunningCommand, TaskStatusIcon, useNow, useWindow} from "@journal/window-kit";

// one agent as a calm two lines: the profile and given name with its time, then the provider, model, kind and task count; a click opens the card on
// its number, usage, Inspect, its tasks under the state names of the tasks window, and its instruction
const FALLBACK_TITLES = {main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer"};
const SHOWN_KINDS = new Set(["subagent", "worker", "reviewer"]);
const TASK_STATES = ["started", "testing", "blocked", "open", "completed", "cancelled"];
const props = defineProps({row: {type: Object, required: true}, facts: {type: Object, default: null}});
const now = useNow();
const title = computed(() => {
    const name = props.facts?.profile || FALLBACK_TITLES[props.row.role] || props.row.role;
    return name.slice(0, 1).toUpperCase() + name.slice(1);
});
const tasks = computed(() => props.facts?.tasks ?? []);
// a worker with tasks in testing and none started waits for its proofs' tests, which bring it its next task or a failure
const waitingForTests = computed(() => !props.row.ended_at && tasks.value.some((task) => task.state === "testing") && !tasks.value.some((task) => task.state === "started"));
const identity = computed(() => [props.row.program, props.facts?.model, SHOWN_KINDS.has(props.row.role) ? props.row.role : ""].filter(Boolean).join(" · "));
const runTime = computed(() => (props.row.ended_at ? `${age(props.row.ended_at, now.value)} ago` : age(props.row.process_started_at || props.row.created_at, now.value)));
const dotState = computed(() => (props.row.ended_at ? "closed" : waitingForTests.value ? "waiting" : props.facts?.state || "running"));
const usage = computed(() => {
    const parts = [`agent ${props.row.id}`];
    if (props.facts?.context_percent !== null && props.facts?.context_percent !== undefined) parts.push(`Context ${props.facts.context_percent}%`);
    if (props.facts?.cost_dollars) parts.push(`$${props.facts.cost_dollars.toFixed(2)}`);
    return parts.join(" · ");
});
const completedCount = computed(() => tasks.value.filter((task) => task.state === "completed").length);
const taskCount = computed(() => `${completedCount.value} of ${tasks.value.length} ${tasks.value.length === 1 ? "task" : "tasks"}`);
const sections = computed(() => TASK_STATES.map((state) => ({state, label: state.slice(0, 1).toUpperCase() + state.slice(1), tasks: tasks.value.filter((task) => task.state === state)})).filter((section) => section.tasks.length));
const opened = ref(false);
// a running worker's card names the command it runs, as the foot of the chat does for the main agent
const context = useWindow();
const runningCommand = ref("");
const showsCommand = computed(() => props.row.role === "worker" && !props.row.ended_at);
async function readCommand() {
    if (!showsCommand.value) return;
    const answer = await context.read(`usage tool --agent ${props.row.id}`);
    runningCommand.value = answer.ok ? answer.value.tool : "";
}
const stopFollowing = context.follow(["hook_call.*"], readCommand);
onUnmounted(() => stopFollowing?.());
readCommand();
</script>

<template>
    <div class="agent-card" :data-agent-open="row.id" :aria-expanded="opened" :title="row.session" @click="opened = !opened">
        <span class="agent-head">
            <span class="agent-dot" :data-state="dotState" />
            <span class="agent-title" data-agent-title>{{ title }}</span>
            <span class="agent-name" data-agent-name>{{ facts?.given_name || row.id }}</span>
            <span class="agent-time">{{ runTime }}</span>
            <Icon :class="['agent-chevron', {opened}]" name="caret" :size="12" />
        </span>
        <span class="agent-line">
            <span class="agent-identity" data-agent-identity>{{ identity }}</span>
            <template v-if="tasks.length">
                <span class="agent-tasks" data-agent-tasks>{{ taskCount }}</span>
            </template>
        </span>
        <template v-if="showsCommand">
            <span class="agent-command" data-agent-command><RunningCommand :text="waitingForTests ? 'waiting for its tests' : runningCommand" idle="thinking" /></span>
        </template>
        <template v-if="opened">
            <div class="agent-more" data-agent-more @click.stop>
                <span class="agent-usage-line">
                    <span class="agent-usage" data-agent-card-usage>{{ usage }}</span>
                    <Btn small bordered data-agent-inspect @click="peekRef(`agents:${row.id}`)">Inspect</Btn>
                </span>
                <template v-for="section in sections" :key="section.state">
                    <p class="agent-label" :data-agent-section="section.state">{{ section.label }} <span class="agent-section-count">{{ section.tasks.length }}</span></p>
                    <template v-for="task in section.tasks" :key="task.id">
                        <button type="button" class="agent-task" :data-agent-delegated="task.id" @click="peekRef(`tasks:${task.id}`)">
                            <TaskStatusIcon :status="task.state" />
                            <span class="agent-task-number">{{ task.id }}</span>
                            <span class="agent-task-title">{{ task.title }}</span>
                        </button>
                    </template>
                </template>
                <template v-if="facts?.instruction">
                    <p class="agent-label">Instruction</p>
                    <div class="agent-instruction" data-agent-instruction>{{ facts.instruction }}</div>
                </template>
            </div>
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
    padding: 9px 22px 9px 12px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
}

.agent-card[aria-expanded="false"]:hover {
    background: var(--hover);
}

.agent-head,
.agent-line {
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
    background: var(--accent);
}

.agent-dot[data-state="closed"] {
    background: var(--text-3);
}

.agent-dot[data-state="waiting"] {
    background: var(--paused);
}

.agent-dot[data-state="blocked"] {
    background: var(--blocking);
}

.agent-title {
    flex: none;
    max-width: 60%;
    overflow: hidden;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.agent-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.agent-time,
.agent-identity,
.agent-usage,
.agent-label {
    color: var(--text-3);
    font-size: 12px;
}

.agent-time {
    flex: none;
    margin-left: auto;
    font-variant-numeric: tabular-nums;
}

.agent-chevron {
    position: absolute;
    top: 11px;
    right: 6px;
    color: var(--text-3);
    opacity: 0;
}

.agent-card:hover .agent-chevron {
    opacity: 1;
}

.agent-chevron.opened {
    transform: rotate(180deg);
}

.agent-line {
    padding-left: 15px;
}

.agent-command {
    display: flex;
    min-width: 0;
    padding-left: 15px;
}

.agent-identity {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.agent-tasks {
    flex: none;
    color: var(--text-2);
    font-size: 12px;
}

.agent-section-count {
    margin-left: 2px;
}

.agent-task {
    display: flex;
    gap: 8px;
    align-items: center;
    min-width: 0;
    padding: 3px 4px;
    border: 0;
    border-radius: 4px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.agent-task:hover {
    background: var(--hover);
    color: var(--text);
}

.agent-task-number {
    flex: none;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.agent-task-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.agent-more {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 6px 0 2px 15px;
    cursor: default;
}

.agent-usage-line {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
}

.agent-label {
    margin: 0;
}

.agent-instruction {
    max-height: 240px;
    padding: 0 0 20px 10px;
    overflow-y: auto;
    border-left: 2px solid var(--border-2);
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.5;
    white-space: pre-wrap;
    mask-image: linear-gradient(to bottom, #000 calc(100% - 16px), transparent);
}
</style>
