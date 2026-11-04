<script setup>
import {computed, defineAsyncComponent, onUnmounted, ref} from "vue";
import {age, EmptyState, FoldGroup, Icon, InnerTabs, loadWindowComponent, peekRef, SwitchCase, TaskStatusIcon, TimeAgo, useNow, useWindow} from "@journal/window-kit";
import AgentCommand from "./AgentCommand.vue";
import TranscriptRows from "./TranscriptRows.vue";

// one agent as a calm two lines: the profile and given name with its time, then the provider, model, kind and task count; a click opens the card on
// its number, usage, Inspect and three tabs: its tasks under the state names of the tasks window with its instruction, its transcript and the files it changed;
// whether the card is open is the window's to say (`open`), and a click asks it to flip that (`toggle`)
const FALLBACK_TITLES = {subagent: "Subagent", reviewer: "Reviewer"};
const TASK_STATES = ["started", "blocked", "open", "completed"];
const MILLISECONDS_PER_HOUR = 3600000;
const props = defineProps({row: {type: Object, required: true}, facts: {type: Object, default: null}, progress: {type: Object, default: null}, waitReason: {type: String, default: ""}, open: Boolean});
const emit = defineEmits(["toggle"]);
const now = useNow();
const title = computed(() => {
    const name = props.facts?.profile || FALLBACK_TITLES[props.row.role] || props.row.role;
    return name.slice(0, 1).toUpperCase() + name.slice(1);
});
const tasks = computed(() => props.facts?.tasks ?? []);
const identity = computed(() => [props.row.program, props.facts?.model, props.facts?.effort, props.row.role === "main" ? "" : props.progress ? `${props.row.role} ${props.row.id}` : props.row.role].filter(Boolean).join(" · "));
const runTime = computed(() => age(props.row.process_started_at || props.row.created_at, now.value));
const UNFINISHED_STATES = new Set(["open", "started", "testing"]);
const stoppedWithWork = computed(() => Boolean(props.row.ended_at) && props.row.role !== "main" && tasks.value.some((task) => UNFINISHED_STATES.has(task.state)));
const dotState = computed(() => (props.waitReason || stoppedWithWork.value ? "waiting" : props.row.state === "running" ? props.facts?.state || props.row.state : props.row.state));
const usage = computed(() => {
    const parts = [];
    if (props.facts?.context_percent !== null && props.facts?.context_percent !== undefined) parts.push(`Context: ${props.facts.context_percent}%`);
    if (props.facts?.cost_dollars) parts.push(`$${props.facts.cost_dollars.toFixed(2)}`);
    return parts.join(" · ");
});
const completedCount = computed(() => props.progress?.completed_count ?? tasks.value.filter((task) => task.state === "completed").length);
const totalCount = computed(() => props.progress?.task_count ?? tasks.value.length);
const taskCount = computed(() => `${completedCount.value} of ${totalCount.value} ${totalCount.value === 1 ? "task" : "tasks"}`);
const tasksPerHour = computed(() => {
    const started = Date.parse(props.progress?.started_at || props.row.created_at);
    const finished = props.progress ? props.progress.finished_at : props.row.ended_at;
    const ended = finished ? Date.parse(finished) : now.value;
    const hours = (ended - started) / MILLISECONDS_PER_HOUR;
    return props.row.role !== "main" && hours > 0 && completedCount.value ? `${Math.round(completedCount.value / hours)}/h` : "";
});
const sections = computed(() => tasks.value.length ? TASK_STATES.map((state) => ({state, label: state.slice(0, 1).toUpperCase() + state.slice(1), tasks: tasks.value.filter((task) => task.state === state || (state === "started" && task.state === "testing") || (state === "completed" && task.state === "cancelled"))})) : []);
const FOLDED_STATES = new Set(["completed"]);
const folded = ref({});
const sectionOpen = (state) => !(folded.value[state] ?? FOLDED_STATES.has(state));
const fold = (state) => (folded.value = {...folded.value, [state]: sectionOpen(state)});
// a running helper's card names the command it runs, as the foot of the chat does for the main agent, or says plainly that it ran none
const context = useWindow();
const tab = ref(context.tabs[0]);
const components = Object.fromEntries(context.tabs.filter((tab) => tab.component).map((tab) => [tab.key, defineAsyncComponent(() => loadWindowComponent(tab.component))]));
// a subagent has no tasks and writes no files, so its card holds its transcript under its folded instruction, with no tabs
const isSubagent = computed(() => props.row.role === "subagent" || props.row.role === "reviewer");
const instructionOpen = ref(false);
const runningCommand = ref("");
const noCommandNote = ref("");
const showsCommand = computed(() => props.row.role !== "main" && (!props.row.ended_at || stoppedWithWork.value || props.waitReason));
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
    <div :class="['agent-card', {open}]" :data-agent-open="row.id" :aria-expanded="open" :role="open ? undefined : 'button'" :tabindex="open ? undefined : 0" :title="row.session" @click="!open && emit('toggle')" @keydown.enter.self.prevent="!open && emit('toggle')" @keydown.space.self.prevent="!open && emit('toggle')">
        <span class="agent-head">
            <template v-if="open"><button type="button" class="agent-back" title="Back to the list" aria-label="Back to the list" @click.stop="emit('toggle')"><Icon name="chevronRight" facing="left" :size="14" /></button></template>
            <span class="agent-dot" :data-state="dotState" />
            <span class="agent-title" data-agent-title>{{ title }}</span>
            <span class="agent-name" data-agent-name>{{ facts?.given_name || row.id }}</span>
            <template v-if="!open"><Icon class="agent-chevron" name="chevronRight" :size="12" /></template>
            <template v-if="row.ended_at && !stoppedWithWork">
                <TimeAgo class="agent-time" :at="row.ended_at" />
            </template>
            <template v-else>
                <span class="agent-time">{{ runTime }}</span>
            </template>
        </span>
        <span class="agent-line">
            <span class="agent-identity" data-agent-identity>{{ identity }}</span>
            <template v-if="totalCount">
                <template v-if="tasksPerHour">
                    <span class="agent-tasks" data-agent-pace>{{ tasksPerHour }}</span>
                </template>
                <span class="agent-tasks" data-agent-tasks>{{ taskCount }}</span>
            </template>
        </span>
        <template v-if="showsCommand && !open">
            <AgentCommand class="agent-command" :wait-reason="waitReason" :stopped="stoppedWithWork" :command="runningCommand" :note="noCommandNote" />
        </template>
        <template v-if="open">
            <div class="agent-more" data-agent-more @click.stop>
                <template v-if="usage">
                    <span class="agent-usage" data-agent-card-usage>{{ usage }}</span>
                </template>
                <template v-if="showsCommand"><AgentCommand class="agent-command" :wait-reason="waitReason" :stopped="stoppedWithWork" :command="runningCommand" :note="noCommandNote" /></template>
                <template v-if="isSubagent">
                    <div class="agent-tab-body" data-agent-tab-body="transcript" data-agent-only-transcript>
                        <template v-if="facts?.instruction">
                            <div class="agent-subagent-brief">
                                <FoldGroup label="Instruction" :open="instructionOpen" data-agent-section="instruction" @toggle="instructionOpen = !instructionOpen">
                                    <div class="agent-instruction" data-agent-instruction>{{ facts.instruction }}</div>
                                </FoldGroup>
                            </div>
                        </template>
                        <TranscriptRows :line="`agent transcript ${row.id}`" padding="0" />
                    </div>
                </template>
                <template v-else>
                <InnerTabs class="agent-tabs" :active="tab" :answer="{tasks: tasks.length}" @choose="tab = $event" />
                <div class="agent-tab-body" :data-agent-tab-body="tab?.key">
                    <SwitchCase :value="tab?.key">
                        <template #tasks>
                            <template v-if="!tasks.length"><EmptyState title="No tasks">No tasks have been assigned to this agent.</EmptyState></template>
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
                        <template #transcript>
                            <TranscriptRows :line="`agent transcript ${row.id}`" padding="0" />
                        </template>
                        <template v-for="(component, key) in components" :key="key" #[key]>
                            <component :is="component" :agent="row.id" />
                        </template>
                    </SwitchCase>
                </div>
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

.agent-dot[data-state="idle"], .agent-dot[data-state="retired"] {
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
    color: var(--text-3);
    font-size: 10.5px;
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

/* the open card is the whole window: its tab body takes what is left and scrolls inside it */
.agent-card.open {
    min-height: 0;
}

.agent-card.open .agent-more {
    flex: 1;
    min-height: 0;
}

.agent-card.open .agent-tab-body {
    flex: 1;
    min-height: 0;
}

/* what a tab holds, a transcript or a file feed, takes the whole body */
.agent-card.open .agent-tab-body:not([data-agent-tab-body="tasks"]) > :deep(*) {
    flex: 1;
    min-height: 0;
}

/* opened, the instruction runs down the whole body and scrolls inside it */
.agent-card.open .agent-instruction {
    flex: 1;
    max-height: none;
    min-height: 0;
}

/* a subagent's instruction sits above its transcript, which keeps the height */
.agent-card.open .agent-tab-body > .agent-subagent-brief {
    flex: none;
    padding: 8px 22px 0 27px;
}

.agent-card.open .agent-subagent-brief .agent-instruction {
    max-height: 240px;
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

.agent-card { gap: 2px; padding: 9px 14px; }
.agent-head { gap: 6px; }
.agent-dot { margin-right: 3px; }
.agent-name { flex: 0 1 auto; }
.agent-chevron { position: static; flex: none; margin-left: -2px; color: var(--text-4); opacity: 1; }
.agent-card:hover .agent-chevron { color: var(--text-2); }
.agent-line, .agent-command { padding-left: 16px; }
.agent-command { font-size: 11px; }
.agent-waiting { color: var(--accent-text); font-size: 11.5px; text-decoration: none; }
.agent-waiting:hover { color: var(--accent-text); text-decoration: underline; }
.agent-back { display: grid; place-items: center; flex: none; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 6px; background: none; color: var(--text-3); cursor: pointer; }
.agent-back:hover { background: var(--hover); color: var(--text); }
.agent-card.open { padding: 0; gap: 0; cursor: default; }
.agent-card.open .agent-head { gap: 9px; padding: 7px 14px 0 8px; background: var(--side); }
.agent-card.open .agent-title { font-weight: 600; }
.agent-card.open .agent-line { padding: 0 14px 7px 50px; border-bottom: 1px solid var(--border); background: var(--side); }
.agent-card.open .agent-command { padding: 6px 14px; border-bottom: 1px solid var(--border); }
.agent-card.open .agent-more { order: 2; gap: 0; padding: 0; }
.agent-usage { display: block; padding: 6px 14px; border-bottom: 1px solid var(--border); }
.agent-card.open .agent-tabs { height: 30px; flex: none; align-items: center; margin: 0; padding: 0 14px; background: var(--bg-2); border-bottom: 1px solid var(--border); }
.agent-card.open .agent-tab-body { gap: 0; margin: 0; }
.agent-card.open .agent-tab-body[data-agent-tab-body="tasks"] { padding: 0; }
.agent-card.open .agent-tab-body :deep(.row-list-row) { padding: 8px 14px; border-bottom: 1px solid var(--border); }
.agent-card.open .agent-tab-body[data-agent-tab-body="transcript"] :deep(.row-list-row) { gap: 8px; }
.agent-card.open .agent-tab-body[data-agent-tab-body="transcript"] :deep(.author) { min-width: 54px; font-size: 11.5px; letter-spacing: .03em; }
.agent-card.open .agent-tab-body[data-agent-tab-body="file-feed"] :deep(.row-list-row) { padding: 0; }
.agent-card.open .agent-tab-body > .agent-subagent-brief { padding: 0; }
.agent-task { width: 100%; padding: 7px 14px; border-radius: 0; }
.agent-task-number { min-width: 30px; }
.agent-label { margin: 12px 14px 0; }
.agent-card.open .agent-instruction { margin: 12px 14px 16px; padding: 0 0 0 10px; line-height: 1.55; mask-image: none; }
.agent-card.open .agent-more { animation: agent-open 240ms ease 60ms both; }
@keyframes agent-open { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .agent-card.open .agent-more { animation: none; } }
</style>
