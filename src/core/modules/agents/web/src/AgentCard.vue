<script setup>
import {computed, onUnmounted, ref} from "vue";
import {age, FoldGroup, Icon, InnerTabs, peekRef, RunningCommand, TaskStatusIcon, useNow, useWindow} from "@journal/window-kit";
import AgentFileEdits from "./AgentFileEdits.vue";
import TranscriptRows from "./TranscriptRows.vue";

// one agent as a calm two lines: the profile and given name with its time, then the provider, model, kind and task count; a click opens the card on
// its number, usage, Inspect and three tabs: its tasks under the state names of the tasks window with its instruction, its transcript and the files it changed
const FALLBACK_TITLES = {main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer"};
const SHOWN_KINDS = new Set(["subagent", "worker", "reviewer"]);
const TASK_STATES = ["started", "testing", "blocked", "open", "completed", "cancelled"];
const MILLISECONDS_PER_HOUR = 3600000;
const props = defineProps({row: {type: Object, required: true}, facts: {type: Object, default: null}});
const now = useNow();
const title = computed(() => {
    const name = props.facts?.profile || FALLBACK_TITLES[props.row.role] || props.row.role;
    return name.slice(0, 1).toUpperCase() + name.slice(1);
});
const tasks = computed(() => props.facts?.tasks ?? []);
// a worker with tasks in testing and none started waits for its proofs' tests, which bring it its next task or a failure
const waitingForTests = computed(() => !props.row.ended_at && tasks.value.some((task) => task.state === "testing") && !tasks.value.some((task) => task.state === "started"));
const identity = computed(() => [props.row.program, props.facts?.model, props.row.role === "worker" ? `worker ${props.row.id}` : SHOWN_KINDS.has(props.row.role) ? props.row.role : ""].filter(Boolean).join(" · "));
const runTime = computed(() => (props.row.ended_at ? `${age(props.row.ended_at, now.value)} ago` : age(props.row.process_started_at || props.row.created_at, now.value)));
const dotState = computed(() => (props.row.ended_at ? "closed" : waitingForTests.value ? "waiting" : props.facts?.state || "running"));
const usage = computed(() => {
    const parts = [];
    if (props.facts?.context_percent !== null && props.facts?.context_percent !== undefined) parts.push(`Context ${props.facts.context_percent}%`);
    if (props.facts?.cost_dollars) parts.push(`$${props.facts.cost_dollars.toFixed(2)}`);
    return parts.join(" · ");
});
const completedCount = computed(() => tasks.value.filter((task) => task.state === "completed").length);
const taskCount = computed(() => `${completedCount.value} of ${tasks.value.length} ${tasks.value.length === 1 ? "task" : "tasks"}`);
// a worker's pace: the tasks it completed per hour of its run, up to its end
const tasksPerHour = computed(() => {
    const started = Date.parse(props.row.process_started_at || props.row.created_at);
    const ended = props.row.ended_at ? Date.parse(props.row.ended_at) : now.value;
    const hours = (ended - started) / MILLISECONDS_PER_HOUR;
    return props.row.role === "worker" && hours > 0 && completedCount.value ? `${Math.round(completedCount.value / hours)}/h` : "";
});
const sections = computed(() => TASK_STATES.map((state) => ({state, label: state.slice(0, 1).toUpperCase() + state.slice(1), tasks: tasks.value.filter((task) => task.state === state)})).filter((section) => section.tasks.length));
const opened = ref(false);
const FOLDED_STATES = new Set(["completed"]);
const folded = ref({});
const sectionOpen = (state) => !(folded.value[state] ?? FOLDED_STATES.has(state));
const fold = (state) => (folded.value = {...folded.value, [state]: sectionOpen(state)});
// a running helper's card names the command it runs, as the foot of the chat does for the main agent, or says plainly that it ran none
const context = useWindow();
const tab = ref(context.tabs[0]);
const runningCommand = ref("");
const noCommandNote = ref("");
const showsCommand = computed(() => props.row.role !== "main" && !props.row.ended_at);
async function readCommand() {
    if (!showsCommand.value) return;
    const answer = await context.read(`usage tool --agent ${props.row.id}`);
    runningCommand.value = answer.ok ? answer.value.tool : "";
    noCommandNote.value = answer.ok ? answer.value.note : "";
}
const stopFollowing = context.follow(["hook_call.*", "process_part.*"], readCommand);
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
                <template v-if="tasksPerHour">
                    <span class="agent-tasks" data-agent-pace>{{ tasksPerHour }}</span>
                </template>
                <span class="agent-tasks" data-agent-tasks>{{ taskCount }}</span>
            </template>
        </span>
        <template v-if="showsCommand">
            <span class="agent-command" data-agent-command>
                <template v-if="waitingForTests">
                    <button type="button" class="agent-waiting" data-agent-waiting title="Open the test queue" @click.stop="peekRef('test_queue:0')">waiting for its tests</button>
                </template>
                <template v-else>
                    <RunningCommand :text="runningCommand" :idle="noCommandNote || 'thinking'" />
                </template>
            </span>
        </template>
        <template v-if="opened">
            <div class="agent-more" data-agent-more @click.stop>
                <template v-if="usage">
                    <span class="agent-usage" data-agent-card-usage>{{ usage }}</span>
                </template>
                <InnerTabs class="agent-tabs" :active="tab" :answer="{tasks: tasks.length}" @choose="tab = $event" />
                <div class="agent-tab-body" :data-agent-tab-body="tab?.key">
                    <template v-if="tab?.key === 'tasks'">
                        <template v-for="section in sections" :key="section.state">
                            <FoldGroup :label="section.label" :count="section.tasks.length" :open="sectionOpen(section.state)" :data-agent-section="section.state" @toggle="fold(section.state)">
                                <template v-for="task in section.tasks" :key="task.id">
                                    <button type="button" class="agent-task" :data-agent-delegated="task.id" @click="peekRef(`tasks:${task.id}`)">
                                        <TaskStatusIcon :status="task.state" />
                                        <span class="agent-task-number">{{ task.id }}</span>
                                        <span class="agent-task-title">{{ task.title }}</span>
                                    </button>
                                </template>
                            </FoldGroup>
                        </template>
                        <template v-if="facts?.instruction">
                            <p class="agent-label">Instruction</p>
                            <div class="agent-instruction" data-agent-instruction>{{ facts.instruction }}</div>
                        </template>
                    </template>
                    <template v-else-if="tab?.key === 'transcript'">
                        <TranscriptRows :line="`agent transcript ${row.id}`" />
                    </template>
                    <template v-else-if="tab?.key === 'file-feed'">
                        <AgentFileEdits :agent="row.id" />
                    </template>
                </div>
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

.agent-waiting {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-decoration: underline dotted;
    cursor: pointer;
}

.agent-waiting:hover {
    color: var(--text);
}

.agent-tasks {
    flex: none;
    color: var(--text-2);
    font-size: 12px;
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

.agent-tabs {
    margin: 0 -22px -6px -27px;
    padding: 0 22px 0 27px;
    border-bottom: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
}

.agent-tab-body {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 320px;
    margin: 0 -22px -11px -27px;
    overflow-y: auto;
}

.agent-tab-body[data-agent-tab-body="tasks"] {
    padding: 8px 22px 8px 27px;
}

.agent-tab-body:not([data-agent-tab-body="tasks"]) {
    min-height: 96px;
}

.agent-tab-body :deep(.row-list-row) {
    padding: 6px 22px 6px 27px;
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
