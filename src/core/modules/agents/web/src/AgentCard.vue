<script setup>
import {computed} from "vue";
import {age, peekRef, perHour, seenWords, sinceWords, AgentTip, Btn, Icon, TimeAgo, useNow, useWindow} from "@journal/window-kit";
import AgentCardDetails from "./AgentCardDetails.vue";
import AgentActions from "./AgentActions.vue";
import AgentStatusDot from "./AgentStatusDot.vue";
import AgentTaskLine from "./AgentTaskLine.vue";
import InformationBar from "../../../../../viewer/src/shell/InformationBar.vue";

const IN_HAND_STATES = new Set(["started", "testing", "blocked"]);
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
const jobTask = computed(() => currentTask.value || tasks.value.find((task) => task.id === props.facts?.task_id) || tasks.value.find((task) => IN_HAND_STATES.has(task.state)) || queuedTasks.value[0] || tasks.value.at(-1));
const job = computed(() => props.row.role === "helper" ? props.facts?.helper_job || "" : (props.facts?.job_enabled ? currentTask.value?.title || props.facts?.task_title || queuedTasks.value[0]?.title || tasks.value.at(-1)?.title || "" : ""));
const roleLabel = computed(() => `${props.row.role} ${props.row.number}`);
const identity = computed(() => [props.row.program, props.facts?.model, props.facts?.effort, roleLabel.value].filter(Boolean).join(" · "));
const context = useWindow();
const runTime = computed(() => age(props.row.process_started_at || props.row.created_at, now.value));
const UNFINISHED_STATES = new Set(["open", "started", "testing"]);
const pendingWork = computed(() => props.facts?.work_status);
const stoppedWithWork = computed(() => Boolean(props.row.ended_at) && props.row.role !== "main" && tasks.value.some((task) => UNFINISHED_STATES.has(task.state)));
// an agent whose program's plan allowance is used up waits at the usage limit until it starts again
const limited = computed(() => props.row.state === "running" && props.facts?.state === "at usage limit" && Boolean(props.facts?.usage_limit_ends_at));
// an agent the journal stopped at the limit says since when and when it goes on; one only marked says when the allowance starts again
const clockTime = (text) => new Date(text).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
const limitText = computed(() => (props.row.halted_at ? `Stopped at the usage limit since ${clockTime(props.row.halted_at)}, goes on at ${clockTime(props.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(props.facts.usage_limit_ends_at).toLocaleString()}`));
const dotState = computed(() => (props.row.retired_at || props.row.state === "retired" ? "retired" : limited.value || pendingWork.value || props.waitReason || stoppedWithWork.value ? "waiting" : props.row.state === "running" ? props.facts?.state || props.row.state : props.row.state));
const workStatus = computed(() => limited.value ? limitText.value : pendingWork.value ? `Status: ${pendingWork.value}` : props.waitReason ? `Waiting: ${props.waitReason}` : dotState.value === "blocked" ? (props.facts?.blocked_reason ? `Blocked: ${props.facts.blocked_reason}` : "Blocked") : stoppedWithWork.value ? "Stopped with work left" : "");
const completedCount = computed(() => props.progress?.completed_count ?? tasks.value.filter((task) => task.state === "completed").length);
const perHourRate = computed(() => perHour(completedCount.value, props.progress?.started_at || props.row.created_at, props.progress ? props.progress.finished_at : props.row.ended_at, now.value));
const rate = computed(() => (props.row.role === "main" ? 0 : perHourRate.value));
const retired = computed(() => Boolean(props.row.retired_at) || props.row.state === "retired");
const statusWords = computed(() => {
    if (retired.value) return "Retired";
    if (dotState.value === "blocked" || dotState.value === "waiting") return workStatus.value || (dotState.value === "blocked" ? "Blocked" : "Waiting");
    return props.row.ended_at ? "Idle: its process has stopped" : "Working";
});
const statusAt = computed(() => {
    if (retired.value) return props.row.retired_at;
    const held = dotState.value === "blocked" || dotState.value === "waiting";
    return props.row.ended_at || (held && props.facts?.last_activity) || props.row.process_started_at || props.row.created_at;
});
const statusSince = computed(() => sinceWords(statusAt.value, now.value));
const statusSeen = computed(() => seenWords(props.facts?.last_activity, now.value));
</script>

<template>
    <div :class="['agent-card', {open}]" :data-agent-open="row.id" :aria-expanded="open" :role="open ? undefined : 'button'" :tabindex="open ? undefined : 0" @click="!open && emit('toggle')" @keydown.enter.self.prevent="!open && emit('toggle')" @keydown.space.self.prevent="!open && emit('toggle')">
        <AgentTip :agent-id="row.id" :label="title" class="agent-head">
            <template v-if="open"><button type="button" class="agent-back" title="Back" aria-label="Back" @click.stop="emit('toggle')"><Icon name="chevronRight" facing="left" :size="14" /></button></template>
            <span class="agent-title" data-agent-title data-agent-motion>{{ title }}</span>
            <span class="agent-name" data-agent-name data-agent-motion>{{ facts?.given_name || row.id }}</span>
            <template v-if="!open"><Icon class="agent-chevron" name="chevronRight" :size="12" /></template>
            <template v-if="open"><span class="agent-time" data-agent-motion data-agent-run-time title="How long this session has run">{{ runTime }}</span></template>
        </AgentTip>
        <span class="agent-line">
            <span class="agent-identity" data-agent-identity data-agent-motion>{{ identity }}</span>
            <template v-if="facts?.sandbox_off"><span class="agent-sandbox-off" data-agent-sandbox-off>sandbox off</span></template>
            <template v-if="open"><span class="agent-first-dispatched" data-agent-first-dispatched>Started <TimeAgo :at="row.created_at" /></span></template>
            <template v-if="open && facts?.last_activity"><span class="agent-last-heard" data-agent-last-heard>Seen <TimeAgo :at="facts.last_activity" /></span></template>
        </span>
        <template v-if="open"><InformationBar :agent-programs="context.props.programs.rows.value" :agent="row" :branch="progress?.branch" :usage="{agents: facts ? [facts] : [], windows: facts?.windows ?? []}" card>
            <AgentActions :row="row" />
            <Btn variant="ghost" small data-agent-inspector @click.stop="peekRef(`agents:${row.id}`)">Open inspector</Btn>
            <template v-if="row.role === 'helper' && !row.ended_at"><Btn variant="ghost" small data-helper-stop @click.stop="context.run(['helper', 'stop', String(row.id)])">Stop</Btn></template>
        </InformationBar></template>
        <template v-if="!open"><AgentTaskLine :tasks="tasks" :in-hand="row.role !== 'helper' && facts?.job_enabled ? jobTask || null : null" :job="row.role === 'helper' ? job : ''" :job-title="row.role === 'helper' ? facts?.helper_job_title || '' : ''" :per-hour="rate" /></template>
        <AgentStatusDot :state="dotState" :doing="statusWords" :since="statusSince" :seen="statusSeen" />
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

.agent-sandbox-off { flex: none; color: var(--warn); font-size: 11.5px; }
.agent-session { flex: none; color: var(--text-3); font-size: 11px; }

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


.agent-identity {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}











.agent-card.open { min-height: 0; }

.agent-card { --agent-padding: 14px; gap: 2px; padding: 9px var(--agent-padding); }
.agent-head { gap: 6px; padding-right: 22px; }
.agent-first-dispatched, .agent-last-heard { color: var(--text-3); font-size: 12px; white-space: nowrap; }
.agent-first-dispatched { margin-left: auto; }
.agent-name { flex: 0 1 auto; }
.agent-head { flex-wrap: wrap; }
.agent-chevron { position: static; flex: none; margin-left: -2px; color: var(--text-4); opacity: 1; }
.agent-card:hover .agent-chevron { color: var(--text-2); }
.agent-line { padding-left: 0; }
.agent-back { display: grid; place-items: center; flex: none; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 6px; background: none; color: var(--text-3); cursor: pointer; }
.agent-back:hover { background: var(--hover); color: var(--text); }
.agent-card.open { padding: 0; gap: 0; cursor: default; }
.agent-card.open .agent-head { gap: 9px; padding: 7px 36px 0 8px; background: var(--side); }
.agent-card.open .agent-title { font-weight: 600; }
.agent-card.open .agent-line { padding: 0 36px 7px 41px; border-bottom: 1px solid var(--border-inner); background: var(--side); }
</style>
