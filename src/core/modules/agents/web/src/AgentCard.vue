<script setup>
import {computed, defineAsyncComponent, onUnmounted, ref, watch} from "vue";
import {READ_RATES, coalesced, age, perHour, Btn, EmptyState, FoldGroup, Icon, InnerTabs, loadWindowComponent, SwitchCase, TabBody, TimeAgo, peekRef, useNow, useWindow} from "@journal/window-kit";
import InformationBar from "../../../../../viewer/src/shell/InformationBar.vue";
import AgentCommand from "./AgentCommand.vue";
import AgentTaskGroup from "./AgentTaskGroup.vue";
import TranscriptRows from "./TranscriptRows.vue";
import AgentActions from "./AgentActions.vue";

// one agent as a calm two lines: the profile and given name with its time, then the provider, model, type and task count; a click opens the card on
// its number, usage, tasks, transcript, files and terminal;
// whether the card is open is the window's to say (`open`), and a click asks it to flip that (`toggle`)
const FALLBACK_TITLES = {helper: "Helper", reviewer: "Reviewer"};
const TASK_STATES = ["started", "blocked", "open", "completed"];
const ENDED_WITHOUT_REPORT = "It ended without a report";
const props = defineProps({row: {type: Object, required: true}, facts: {type: Object, default: null}, progress: {type: Object, default: null}, waitReason: {type: String, default: ""}, open: Boolean});
const emit = defineEmits(["toggle"]);
const now = useNow();
const title = computed(() => {
    if (props.facts?.profile_title) return props.facts.profile_title;
    if (props.facts?.profile) return props.facts.profile;
    const name = FALLBACK_TITLES[props.row.role] || props.row.role;
    return name.slice(0, 1).toUpperCase() + name.slice(1);
});
const tasks = computed(() => props.facts?.tasks ?? []);
const queuedTasks = computed(() => tasks.value.filter((task) => task.state === "open"));
const planTask = computed(() => {
    const current = tasks.value.find((task) => task.id === props.facts?.task_id);
    return current?.plan_id ? current : queuedTasks.value.find((task) => task.plan_id);
});
const job = computed(() => props.row.role === "helper" ? props.facts?.helper_job || "" : (props.facts?.job_enabled ? props.facts?.task_title || queuedTasks.value[0]?.title || tasks.value.at(-1)?.title || "" : ""));
const report = computed(() => props.facts?.job_returned || props.row.job_returned || "");
const jobRef = computed(() => {
    const match = job.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
    return match ? `${match[1].toLowerCase() === "plan" ? "plans" : "docs"}:${match[2]}` : "";
});
const identity = computed(() => [props.row.program, props.facts?.model, props.facts?.effort, props.row.role === "main" ? "" : props.progress ? `${props.row.role} ${props.row.id}` : props.row.role, props.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · "));
const endedReason = computed(() => (props.row.ended_at && props.facts?.job_returned?.startsWith(ENDED_WITHOUT_REPORT) ? props.facts.job_returned : ""));
const runTime = computed(() => age(props.row.process_started_at || props.row.created_at, now.value));
const UNFINISHED_STATES = new Set(["open", "started", "testing"]);
const stoppedWithWork = computed(() => Boolean(props.row.ended_at) && props.row.role !== "main" && tasks.value.some((task) => UNFINISHED_STATES.has(task.state)));
const dotState = computed(() => (props.waitReason || stoppedWithWork.value ? "waiting" : props.row.state === "running" ? props.facts?.state || props.row.state : props.row.state));
const completedCount = computed(() => props.progress?.completed_count ?? tasks.value.filter((task) => task.state === "completed").length);
const totalCount = computed(() => props.progress?.task_count ?? tasks.value.length);
const taskCount = computed(() => `${completedCount.value} of ${totalCount.value} ${totalCount.value === 1 ? "task" : "tasks"}`);
const tasksPerHour = computed(() => {
    const rate = perHour(completedCount.value, props.progress?.started_at || props.row.created_at, props.progress ? props.progress.finished_at : props.row.ended_at, now.value);
    return props.row.role !== "main" && rate ? `${rate} per hour` : "";
});
const sections = computed(() => tasks.value.length ? TASK_STATES.map((state) => ({state, label: state.slice(0, 1).toUpperCase() + state.slice(1), tasks: tasks.value.filter((task) => task.state === state || (state === "started" && task.state === "testing") || (state === "completed" && task.state === "cancelled"))})) : []);
const FOLDED_STATES = new Set(["completed"]);
const folded = ref({});
const sectionOpen = (state) => !(folded.value[state] ?? FOLDED_STATES.has(state));
const fold = (state) => (folded.value = {...folded.value, [state]: sectionOpen(state)});
// a running helper's card names the command it runs, as the foot of the chat does for the main agent, or says plainly that it ran none
const context = useWindow();
const isReader = computed(() => props.row.access === "read-only");
const retired = computed(() => Boolean(props.row.retired_at) || props.row.state === "retired");
const cardTabs = computed(() => {
    if (retired.value) return context.tabs.filter((item) => item.key === "transcript");
    return isReader.value ? context.tabs.filter((item) => ["transcript", "terminal"].includes(item.key)) : context.tabs;
});
const tab = ref(cardTabs.value[0]);
watch(cardTabs, (tabs) => { if (!tabs.some((item) => item.key === tab.value?.key)) tab.value = tabs[0]; });
watch(() => props.open, (open) => { if (open) tab.value = cardTabs.value[0]; });
const components = Object.fromEntries(context.tabs.filter((tab) => tab.component).map((tab) => [tab.key, defineAsyncComponent(() => loadWindowComponent(tab.component))]));
const isRunningHelper = computed(() => props.row.role === "helper" && !props.row.ended_at);
const stopHelper = () => context.run(["helper", "stop", String(props.row.id)]);
const instructionOpen = ref(false);
const runningCommand = ref("");
const noCommandNote = ref("");
const showsCommand = computed(() => props.row.role !== "main" && (!props.row.ended_at || stoppedWithWork.value || props.waitReason));
async function readCommand() {
    if (!showsCommand.value) return;
    const answer = await context.read(`usage tool --agent ${props.row.id}`, {deferred: true});
    runningCommand.value = answer.ok ? answer.value.tool : "";
    noCommandNote.value = answer.ok ? answer.value.note : "";
}
const stopFollowing = context.follow(["hook_call.*", "process_part.*"], coalesced(readCommand, READ_RATES.agentCommand));
onUnmounted(() => stopFollowing?.());
readCommand();
</script>

<template>
    <div :class="['agent-card', {open}]" :data-agent-open="row.id" :aria-expanded="open" :role="open ? undefined : 'button'" :tabindex="open ? undefined : 0" :title="row.session" @click="!open && emit('toggle')" @keydown.enter.self.prevent="!open && emit('toggle')" @keydown.space.self.prevent="!open && emit('toggle')">
        <span class="agent-head">
            <template v-if="open"><button type="button" class="agent-back" title="Back to the list" aria-label="Back to the list" @click.stop="emit('toggle')"><Icon name="chevronRight" facing="left" :size="14" /></button></template>
            <span class="agent-dot" :data-state="dotState" data-agent-motion />
            <span class="agent-title" data-agent-title data-agent-motion>{{ title }}</span>
            <span class="agent-name" data-agent-name data-agent-motion>{{ facts?.given_name || row.id }}</span>
            <template v-if="!open"><Icon class="agent-chevron" name="chevronRight" :size="12" /></template>
            <span class="agent-times">
            <template v-if="row.ended_at && !stoppedWithWork">
                <TimeAgo class="agent-time" :at="row.ended_at" data-agent-motion />
            </template>
            <template v-else>
                <span class="agent-time" data-agent-motion>{{ runTime }}</span>
            </template>
            <template v-if="facts?.last_activity"><span class="agent-last-heard" data-agent-last-heard>Last heard: <TimeAgo :at="facts.last_activity" /></span></template>
            </span>
        </span>
        <span class="agent-line">
            <span class="agent-identity" data-agent-identity data-agent-motion>{{ identity }}</span>
            <template v-if="totalCount && !job">
                <span class="agent-tasks" data-agent-tasks data-agent-motion>{{ taskCount }}</span>
            </template>
        </span>
        <template v-if="planTask">
            <span class="agent-line agent-work-start"><button type="button" class="agent-plan" data-agent-plan :data-peek="`plans:${planTask.plan_id}`" @click.stop="peekRef(`plans:${planTask.plan_id}`)">Plan {{ planTask.plan_id }}: {{ planTask.plan_title }}</button></span>
        </template>
        <template v-if="job">
            <span :class="['agent-line', {'agent-work-start': !planTask}]">
                <span class="agent-job" data-agent-job :title="job"><template v-if="jobRef"><button type="button" class="agent-job-link" :data-peek="jobRef" @click.stop="peekRef(jobRef)">{{ job }}</button></template><template v-else>{{ job }}</template></span>
                <template v-if="totalCount">
                    <span class="agent-tasks" data-agent-tasks data-agent-motion>{{ taskCount }}</span>
                </template>
            </span>
        </template>
        <template v-if="report"><p class="agent-summary" data-agent-report><span>Last report: </span>{{ report }}</p></template>
        <template v-if="row.retirement_reason"><p class="agent-summary" data-agent-retirement-reason>Retirement reason: {{ row.retirement_reason }}</p></template>
        <template v-if="row.resume_reason"><p class="agent-summary" data-agent-resume-reason>{{ row.resume_reason }}</p></template>
        <AgentActions :row="row" />
        <template v-if="!open && (showsCommand || (totalCount && tasksPerHour))">
            <span :class="['agent-foot', {'agent-work-start': !job && !planTask}]" data-agent-foot>
                <template v-if="showsCommand">
                    <AgentCommand class="agent-command" :wait-reason="waitReason" :stopped="stoppedWithWork" :command="runningCommand" :note="noCommandNote" />
                </template>
                <template v-if="totalCount && tasksPerHour">
                    <span class="agent-pace" data-agent-pace data-agent-motion>{{ tasksPerHour }}</span>
                </template>
            </span>
        </template>
        <template v-if="open">
            <div class="agent-more" data-agent-more @click.stop>
                <InformationBar :agent="row" :branch="progress?.branch" :usage="{agents: facts ? [facts] : [], windows: []}" card>
                    <template v-if="isRunningHelper"><Btn variant="ghost" small data-helper-stop @click="stopHelper">Stop</Btn></template>
                </InformationBar>
                <template v-if="showsCommand"><AgentCommand class="agent-command" :wait-reason="waitReason" :stopped="stoppedWithWork" :command="runningCommand" :note="noCommandNote" /></template>
                <template v-if="endedReason"><p class="agent-ended-reason" data-agent-ended-reason>{{ endedReason }}</p></template>
                <InnerTabs class="agent-tabs" :tabs="cardTabs" :active="tab" :answer="{tasks: tasks.length}" @choose="tab = $event" />
                <TabBody class="agent-tab-body" :tab="tab" :data-agent-tab-body="tab?.key">
                    <SwitchCase :value="tab?.key">
                        <template #tasks>
                            <template v-if="!tasks.length"><EmptyState title="No tasks">No tasks have been assigned to this agent.</EmptyState></template>
                            <template v-for="section in sections" :key="section.state">
                                <AgentTaskGroup :section="section" :open="sectionOpen(section.state)" @toggle="fold(section.state)" />
                            </template>
                            <template v-if="facts?.instruction">
                                <p class="agent-label">Instruction</p>
                                <div class="agent-instruction" data-agent-instruction>{{ facts.instruction }}</div>
                            </template>
                        </template>
                        <template #transcript>
                            <template v-if="isReader">
                            <template v-if="facts?.instruction">
                                <div class="agent-helper-brief">
                                    <FoldGroup label="Instruction" :open="instructionOpen" data-agent-section="instruction" @toggle="instructionOpen = !instructionOpen">
                                        <div class="agent-instruction" data-agent-instruction>{{ facts.instruction }}</div>
                                    </FoldGroup>
                                </div>
                            </template>
                            <template v-else-if="facts && row.ended_at">
                                <p class="agent-label" data-agent-no-job>No job recorded</p>
                            </template>
                            </template>
                            <TranscriptRows :line="`agent transcript ${row.id}`" padding="0" />
                        </template>
                        <template v-for="(component, key) in components" :key="key" #[key]>
                            <component :is="component" :agent="row.id" />
                        </template>
                    </SwitchCase>
                </TabBody>
            </div>
        </template>
    </div>
</template>

<style scoped>
.agent-summary { margin: 3px 0 0 16px; color: var(--text-2); font-size: 12px; white-space: pre-wrap; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
.agent-card.open .agent-summary { margin: 8px 14px; -webkit-line-clamp: unset; }
.agent-ended-reason {
    margin: 4px 0;
    color: var(--danger, var(--text));
}

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
    font-size: 13px;
    font-weight: 500;
}

.agent-name {
    flex: 1;
    min-width: 0;
    color: var(--text-3);
    font-size: 12px;
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

.agent-job {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text-2);
    font-size: 12.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.agent-command {
    display: flex;
    min-width: 0;
    padding-left: 15px;
    color: var(--text-3);
    font-size: 10.5px;
}

.agent-work-start {
    margin-top: 4px;
}

.agent-foot {
    display: flex;
    gap: 24px;
    align-items: center;
    min-width: 0;
}

.agent-foot .agent-command {
    flex: 0 1 60%;
    max-width: 60%;
}

.agent-pace {
    flex: none;
    margin-left: auto;
    color: var(--text-4);
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

/* a helper's instruction sits above its transcript, which keeps the height */
.agent-card.open .agent-tab-body > .agent-helper-brief {
    flex: none;
    padding: 8px 22px 0 27px;
}

.agent-card.open .agent-helper-brief .agent-instruction {
    max-height: 240px;
}

.agent-tab-body {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0 -22px -11px -27px;
    overflow-x: hidden;
    overflow-y: auto;
    min-width: 0;
    contain: inline-size;
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
.agent-times { display: flex; flex-direction: column; align-items: flex-end; flex: none; margin-left: auto; }
.agent-last-heard { color: var(--text-4); font-size: 10px; white-space: nowrap; }
.agent-dot { margin-right: 3px; }
.agent-name { flex: 0 1 auto; }
.agent-head { flex-wrap: wrap; }
.agent-chevron { position: static; flex: none; margin-left: -2px; color: var(--text-4); opacity: 1; }
.agent-card:hover .agent-chevron { color: var(--text-2); }
.agent-line, .agent-command { padding-left: 16px; }
.agent-command { font-size: 11px; }
.agent-plan { min-width: 0; overflow: hidden; padding: 0; border: 0; background: none; color: var(--accent-text); font: inherit; font-size: 11.5px; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; }
.agent-job-link { padding: 0; border: 0; background: none; color: var(--accent-text); font: inherit; text-align: left; cursor: pointer; }
.agent-waiting { color: var(--accent-text); font-size: 11.5px; text-decoration: none; }
.agent-waiting:hover { color: var(--accent-text); text-decoration: underline; }
.agent-back { display: grid; place-items: center; flex: none; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 6px; background: none; color: var(--text-3); cursor: pointer; }
.agent-back:hover { background: var(--hover); color: var(--text); }
.agent-card.open { padding: 0; gap: 0; cursor: default; }
.agent-card.open .agent-head { gap: 9px; padding: 7px 14px 0 8px; background: var(--side); }
.agent-card.open .agent-title { font-weight: 600; }
.agent-card.open .agent-dot { display: none; }
.agent-card.open .agent-line { padding: 0 14px 7px 41px; border-bottom: 1px solid var(--border-inner); background: var(--side); }
.agent-card.open .agent-work-start { margin-top: 0; padding: 7px 14px; background: none; }
.agent-card.open .agent-command { width: 100%; max-width: 100%; overflow: hidden; padding: 6px 40% 6px 14px; border-bottom: 1px solid var(--border-inner); }
.agent-card.open .agent-more { order: 2; gap: 0; min-width: 0; max-width: 100%; padding: 0; }
.agent-usage-band { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 14px; border-bottom: 1px solid var(--border-inner); }
.agent-usage { display: block; min-width: 0; }
.agent-card.open .agent-tab-body { gap: 0; margin: 0; }
.agent-card.open .agent-tab-body[data-agent-tab-body="tasks"] { padding: 0; }
.agent-card.open .agent-tab-body :deep(.row-list-row) { padding: 8px 14px; border-bottom: 1px solid var(--border-inner); }
.agent-card.open .agent-tab-body[data-agent-tab-body="transcript"] :deep(.row-list-row) { gap: 8px; }
.agent-card.open .agent-tab-body[data-agent-tab-body="transcript"] :deep(.author) { min-width: 54px; font-size: 11.5px; letter-spacing: .03em; }
.agent-card.open .agent-tab-body[data-agent-tab-body="file-feed"] :deep(.row-list-row) { padding: 0; }
.agent-card.open .agent-tab-body > .agent-helper-brief { padding: 0; }


.agent-label { margin: 12px 14px 0; }
.agent-card.open .agent-instruction { margin: 12px 14px 16px; padding: 0 0 0 10px; line-height: 1.55; mask-image: none; }
</style>
