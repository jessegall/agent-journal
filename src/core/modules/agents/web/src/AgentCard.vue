<script setup>
import {computed} from "vue";
import {age, perHour, Btn, Icon, TimeAgo, peekRef, useNow, useWindow} from "@journal/window-kit";
import AgentCardDetails from "./AgentCardDetails.vue";
import AgentActions from "./AgentActions.vue";
import InformationBar from "../../../../../viewer/src/shell/InformationBar.vue";

const FALLBACK_TITLES = {helper: "Helper", reviewer: "Reviewer"};
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
const currentTask = computed(() => tasks.value.find((task) => task.id === props.progress?.task_id && task.state === "started"));
const jobTask = computed(() => currentTask.value || tasks.value.find((task) => task.id === props.facts?.task_id) || queuedTasks.value[0] || tasks.value.at(-1));
const blockedTasks = computed(() => currentTask.value ? tasks.value.filter((task) => task.state === "blocked") : []);
const job = computed(() => props.row.role === "helper" ? props.facts?.helper_job || "" : (props.facts?.job_enabled ? currentTask.value?.title || props.facts?.task_title || queuedTasks.value[0]?.title || tasks.value.at(-1)?.title || "" : ""));
const roleLabel = computed(() => props.facts?.job_enabled ? `${props.row.role} ${props.row.id}` : "");
const identity = computed(() => [props.row.program, props.facts?.model, props.facts?.effort, roleLabel.value].filter(Boolean).join(" · "));
const context = useWindow();
const runTime = computed(() => age(props.row.process_started_at || props.row.created_at, now.value));
const UNFINISHED_STATES = new Set(["open", "started", "testing"]);
const pendingWork = computed(() => props.facts?.work_status);
const stoppedWithWork = computed(() => Boolean(props.row.ended_at) && props.row.role !== "main" && tasks.value.some((task) => UNFINISHED_STATES.has(task.state)));
const dotState = computed(() => (props.row.retired_at || props.row.state === "retired" ? "retired" : pendingWork.value || props.waitReason || stoppedWithWork.value ? "waiting" : props.row.state === "running" ? props.facts?.state || props.row.state : props.row.state));
const workStatus = computed(() => pendingWork.value ? `Status: ${pendingWork.value}` : props.waitReason ? `Waiting: ${props.waitReason}` : dotState.value === "blocked" ? (props.facts?.blocked_reason ? `Blocked: ${props.facts.blocked_reason}` : "Blocked") : stoppedWithWork.value ? "Stopped with work left" : "");
const completedCount = computed(() => props.progress?.completed_count ?? tasks.value.filter((task) => task.state === "completed").length);
const tasksPerHour = computed(() => {
    const rate = perHour(completedCount.value, props.progress?.started_at || props.row.created_at, props.progress ? props.progress.finished_at : props.row.ended_at, now.value);
    return props.row.role !== "main" && rate ? `${rate} per hour` : "";
});
const retired = computed(() => Boolean(props.row.retired_at) || props.row.state === "retired");
</script>

<template>
    <div :class="['agent-card', {open}]" :data-agent-open="row.id" :aria-expanded="open" :role="open ? undefined : 'button'" :tabindex="open ? undefined : 0" @click="!open && emit('toggle')" @keydown.enter.self.prevent="!open && emit('toggle')" @keydown.space.self.prevent="!open && emit('toggle')">
        <span class="agent-head">
            <template v-if="open"><button type="button" class="agent-back" title="Back to the list" aria-label="Back to the list" @click.stop="emit('toggle')"><Icon name="chevronRight" facing="left" :size="14" /></button></template>
            <span class="agent-dot" :data-state="dotState" data-agent-motion />
            <span class="agent-title" data-agent-title data-agent-motion>{{ title }}</span>
            <span class="agent-name" data-agent-name data-agent-motion>{{ facts?.given_name || row.id }}</span>
            <template v-if="!open"><Icon class="agent-chevron" name="chevronRight" :size="12" /></template>
            <span class="agent-times">
            <template v-if="retired">
                <span class="agent-time" data-agent-motion>Retired, <TimeAgo :at="row.retired_at" /></span>
            </template>
            <template v-else-if="row.ended_at && pendingWork">
                <span class="agent-time" data-agent-motion>Process ended: <TimeAgo :at="row.ended_at" /></span>
            </template>
            <template v-else-if="row.ended_at">
                <span class="agent-time" data-agent-motion>Idle, <TimeAgo :at="row.ended_at" /></span>
            </template>
            <template v-else>
                <span class="agent-time" data-agent-motion>{{ runTime }}</span>
            </template>
            </span>
        </span>
        <span class="agent-line">
            <span class="agent-identity" data-agent-identity data-agent-motion>{{ identity }}</span>
            <template v-if="!open && row.role === 'worker' && tasksPerHour"><span class="agent-list-pace" data-agent-list-pace>{{ tasksPerHour }}</span></template>
            <template v-if="open"><span class="agent-first-dispatched" data-agent-first-dispatched><Icon name="time" :size="12" />First started: <TimeAgo :at="row.created_at" /></span></template>
            <template v-if="open && facts?.last_activity"><span class="agent-last-heard" data-agent-last-heard>Last heard: <TimeAgo :at="facts.last_activity" /></span></template>
        </span>
        <template v-if="open"><InformationBar :agent-programs="context.props.programs.rows.value" :agent="row" :branch="progress?.branch" :usage="{agents: facts ? [facts] : [], windows: []}" card>
            <AgentActions :row="row" />
            <template v-if="row.role === 'helper' && !row.ended_at"><Btn variant="ghost" small data-helper-stop @click.stop="context.run(['helper', 'stop', String(row.id)])">Stop</Btn></template>
        </InformationBar></template>
        <template v-if="!open && (job || workStatus)">
            <span class="agent-line agent-work-start">
                <span class="agent-job" data-agent-job :title="job"><span class="agent-job-title">{{ job }}</span><template v-if="job && row.role !== 'helper' && jobTask?.plan_id"><button type="button" class="agent-plan" data-agent-plan :data-peek="`plans:${jobTask.plan_id}`" @click.stop="peekRef(`plans:${jobTask.plan_id}`)">plan {{ jobTask.plan_id }}</button></template></span>
                <template v-if="workStatus"><span class="agent-work-status" data-agent-work-status :data-agent-waiting="waitReason ? '' : null" :data-agent-stopped="stoppedWithWork && !waitReason && !pendingWork ? '' : null">{{ workStatus }}</span></template>
            </span>
        </template>
        <template v-if="!open && blockedTasks.length"><span class="agent-line agent-work-status" data-agent-blocked-tasks>Blocked: {{ blockedTasks.map((task) => `task ${task.id}`).join(", ") }}</span></template>
        <template v-if="open"><AgentCardDetails :row="row" :facts="facts" :progress="progress" :wait-reason="waitReason" :tasks="tasks" :stopped-with-work="stoppedWithWork" :open="open" /></template>
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
.agent-dot[data-state="retired"] { background: transparent; border: 1px solid var(--text-3); }
.agent-work-status { flex: 0 1 auto; overflow: hidden; color: var(--text-3); font-size: 11.5px; text-overflow: ellipsis; white-space: nowrap; }
.agent-session { flex: none; color: var(--text-3); font-size: 11px; }

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
    display: flex;
    gap: 6px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text-2);
    font-size: 12.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.agent-job-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.agent-plan { flex: none; }

.agent-work-start {
    margin-top: 4px;
}

.agent-identity {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}











.agent-card.open { min-height: 0; }

.agent-card { --agent-padding: 14px; gap: 2px; padding: 9px var(--agent-padding); }
.agent-head { gap: 6px; }
.agent-times { display: flex; flex-direction: column; align-items: flex-end; flex: none; margin-left: auto; }
.agent-list-pace { flex: none; margin-left: auto; color: var(--text-3); font-size: 12px; font-variant-numeric: tabular-nums; }
.agent-first-dispatched, .agent-last-heard { color: var(--text-4); font-size: 10px; white-space: nowrap; }
.agent-first-dispatched .ico { margin-right: 4px; vertical-align: middle; }
.agent-dot { margin-right: 3px; }
.agent-name { flex: 0 1 auto; }
.agent-head { flex-wrap: wrap; }
.agent-chevron { position: static; flex: none; margin-left: -2px; color: var(--text-4); opacity: 1; }
.agent-card:hover .agent-chevron { color: var(--text-2); }
.agent-line { padding-left: 16px; }
.agent-plan { min-width: 0; overflow: hidden; padding: 0; border: 0; background: none; color: var(--text-3); font: inherit; font-size: 11.5px; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; }
.agent-back { display: grid; place-items: center; flex: none; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 6px; background: none; color: var(--text-3); cursor: pointer; }
.agent-back:hover { background: var(--hover); color: var(--text); }
.agent-card.open { padding: 0; gap: 0; cursor: default; }
.agent-card.open .agent-head { gap: 9px; padding: 7px var(--agent-padding) 0 8px; background: var(--side); }
.agent-card.open .agent-title { font-weight: 600; }
.agent-card.open .agent-dot { display: none; }
.agent-card.open .agent-line { padding: 0 var(--agent-padding) 7px 41px; border-bottom: 1px solid var(--border-inner); background: var(--side); }
.agent-card.open .agent-job-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.agent-plan { flex: none; }

.agent-work-start { margin-top: 0; padding: 7px 0 0 16px; background: none; }
</style>
