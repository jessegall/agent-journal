<script setup>
import {computed, ref} from "vue";
import {agentNumber, agentTitle, perHour, seenWords, sinceWords, AgentTip, Btn, Icon, useNow, useWindow} from "@journal/window-kit";
import AgentActions from "./AgentActions.vue";
import AgentCardDetails from "./AgentCardDetails.vue";
import AgentStatusDot from "./AgentStatusDot.vue";
import AgentTaskLine from "./AgentTaskLine.vue";
import InformationBar from "../../../../../viewer/src/shell/InformationBar.vue";

const IN_HAND_STATES = new Set(["started", "testing", "blocked"]);
// a task moved to testing counts as done for the tasks per hour
const DONE_STATES = ["completed", "testing"];
// the words for the standing the server works out for an agent's program
const STANDING_WORDS = {running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started"};
const props = defineProps({row: {type: Object, required: true}, facts: {type: Object, default: null}, progress: {type: Object, default: null}, waitReason: {type: String, default: ""}, open: Boolean});
const emit = defineEmits(["toggle"]);
const now = useNow();
const menuOpen = ref(false);
const named = computed(() => agentTitle(props.row, props.facts));
const tasks = computed(() => props.facts?.tasks ?? []);
const queuedTasks = computed(() => tasks.value.filter((task) => task.state === "open"));
const currentTask = computed(() => tasks.value.find((task) => task.id === props.progress?.task_id && task.state === "started"));
const jobTask = computed(() => currentTask.value || tasks.value.find((task) => task.id === props.facts?.task_id) || tasks.value.find((task) => IN_HAND_STATES.has(task.state)) || queuedTasks.value[0] || tasks.value.at(-1));
const job = computed(() => props.row.role === "helper" ? props.facts?.helper_job || "" : (props.facts?.job_enabled ? currentTask.value?.title || props.facts?.task_title || queuedTasks.value[0]?.title || tasks.value.at(-1)?.title || "" : ""));
const roleLabel = computed(() => agentNumber(props.row));
const identity = computed(() => [props.row.program, props.facts?.model, props.facts?.effort, roleLabel.value].filter(Boolean).join(" · "));
const context = useWindow();
const UNFINISHED_STATES = new Set(["open", "started", "testing"]);
const LAUNCH_LABELS = {fresh: "new conversation", resumed: "resumed"};
const jobLaunch = computed(() => [props.facts?.helper_job_program, LAUNCH_LABELS[props.facts?.occupant_launch]].filter(Boolean).join(", "));
const pendingWork = computed(() => props.facts?.work_status);
const stoppedWithWork = computed(() => Boolean(props.row.ended_at) && props.row.role !== "main" && tasks.value.some((task) => UNFINISHED_STATES.has(task.state)));
// an agent whose program's plan allowance is used up waits at the usage limit until it starts again
const limited = computed(() => props.row.state === "running" && props.facts?.state === "at usage limit" && Boolean(props.facts?.usage_limit_ends_at));
// an agent the journal stopped at the limit says since when and when it goes on; one only marked says when the allowance starts again
const clockTime = (text) => new Date(text).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
const limitText = computed(() => (props.row.halted_at ? `Stopped at the usage limit since ${clockTime(props.row.halted_at)}, goes on at ${clockTime(props.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(props.facts.usage_limit_ends_at).toLocaleString()}`));
const dotState = computed(() => (props.row.retired_at || props.row.state === "retired" ? "retired" : limited.value || pendingWork.value || props.waitReason || stoppedWithWork.value ? "waiting" : props.row.state === "running" ? props.facts?.state || props.row.state : props.row.state));
const workStatus = computed(() => limited.value ? limitText.value : pendingWork.value ? `Status: ${pendingWork.value}` : props.waitReason ? `Waiting: ${props.waitReason}` : dotState.value === "blocked" ? (props.facts?.blocked_reason ? `Blocked: ${props.facts.blocked_reason}` : "Blocked") : stoppedWithWork.value ? "Stopped with work left" : "");
const completedCount = computed(() => props.progress?.completed_count ?? tasks.value.filter((task) => DONE_STATES.includes(task.state)).length);
const perHourRate = computed(() => perHour(completedCount.value, props.progress?.started_at || props.row.created_at, props.progress ? props.progress.finished_at : props.row.ended_at, now.value));
const rate = computed(() => (props.row.role === "main" ? 0 : perHourRate.value));
const retired = computed(() => Boolean(props.row.retired_at) || props.row.state === "retired");
const statusWords = computed(() => {
    if (retired.value) return "Retired";
    if (dotState.value === "blocked" || dotState.value === "waiting") return workStatus.value || (dotState.value === "blocked" ? "Blocked" : "Waiting");
    return STANDING_WORDS[props.row.standing];
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
        <div class="agent-head" data-agent-head>
            <template v-if="open"><button type="button" class="agent-back" title="Back" aria-label="Back" @click.stop="emit('toggle')"><Icon name="chevronRight" facing="left" :size="14" /></button></template>
            <template v-if="open">
                <span class="agent-title" data-agent-title data-agent-motion>{{ named.title }}</span>
                <span class="agent-name" data-agent-name data-agent-motion>{{ named.subtext }}</span>
                <Btn variant="ghost" small class="agent-menu-button" data-agent-menu :aria-expanded="menuOpen" @click.stop="menuOpen = !menuOpen">Actions</Btn>
            </template>
            <template v-else>
                <AgentTip :agent-id="row.id" :label="named.text" class="agent-who">
                    <span class="agent-title" data-agent-title data-agent-motion>{{ named.title }}</span>
                    <span class="agent-name" data-agent-name data-agent-motion>{{ named.subtext }}</span>
                </AgentTip>
                <Icon class="agent-chevron" name="chevronRight" :size="12" />
            </template>
        </div>
        <template v-if="open && menuOpen"><div class="agent-menu" data-agent-menu-panel><AgentActions :row="row" :held="dotState === 'blocked'" /></div></template>
        <template v-if="!open">
            <span class="agent-line">
                <span class="agent-identity" data-agent-identity data-agent-motion>{{ identity }}</span>
                <template v-if="facts?.sandbox_off"><span class="agent-sandbox-off" data-agent-sandbox-off>sandbox off</span></template>
            </span>
        </template>
        <template v-if="open && !retired"><InformationBar class="agent-live" :agent-programs="context.props.programs.rows.value" :agent="row" :branch="progress?.branch" :usage="{agents: facts ? [facts] : [], windows: facts?.windows ?? []}" card>
            <template v-if="facts?.sandbox_off"><span class="agent-sandbox-off" data-agent-sandbox-off>sandbox off</span></template>
        </InformationBar></template>
        <template v-if="!open && facts?.unit_name">
            <div class="agent-unit" data-agent-unit>Unit: {{ facts.unit_name }}</div>
        </template>
        <template v-if="!open"><AgentTaskLine :tasks="tasks" :in-hand="row.role !== 'helper' && facts?.job_enabled ? jobTask || null : null" :job="row.role === 'helper' ? job : ''" :job-title="row.role === 'helper' ? facts?.helper_job_title || '' : ''" :job-launch="row.role === 'helper' ? jobLaunch : ''" :per-hour="rate" /></template>
        <AgentStatusDot :state="dotState" :doing="statusWords" :since="statusSince" :seen="statusSeen" />
        <template v-if="open"><AgentCardDetails :row="row" :facts="facts" :progress="progress" :wait-reason="waitReason" :tasks="tasks" :stopped-with-work="stoppedWithWork" :open="open" /></template>
    </div>
</template>

<style scoped>
.agent-unit {
    overflow: hidden;
    color: var(--text-3);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
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

.agent-identity,
.agent-usage,
.agent-label {
    color: var(--text-3);
    font-size: 12px;
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
.agent-name { flex: 0 1 auto; }
.agent-head { flex-wrap: wrap; }
.agent-chevron { position: static; flex: none; margin-left: -2px; color: var(--text-4); opacity: 1; }
.agent-card:hover .agent-chevron { color: var(--text-2); }
.agent-line { padding-left: 0; }
.agent-back { display: grid; place-items: center; flex: none; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 6px; background: none; color: var(--text-3); cursor: pointer; }
.agent-back:hover { background: var(--hover); color: var(--text); }
.agent-card.open { padding: 0; gap: 0; cursor: default; }
.agent-card.open .agent-head { gap: 9px; padding: 7px 36px 7px 8px; border-bottom: 1px solid var(--border-inner); background: var(--side); }
.agent-card.open .agent-title { font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
.agent-who { display: inline-flex; gap: 6px; align-items: baseline; min-width: 0; }
.agent-menu-button { margin-left: auto; }
.agent-menu { padding: 8px 14px; border-bottom: 1px solid var(--border-inner); background: var(--side); }
.agent-live { background: var(--bg-2); }
</style>
