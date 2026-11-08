<script setup>
import {computed, toRef} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import SkeletonLine from "../kit/SkeletonLine.vue";
import {peekRef} from "../route.js";
import {useAgentPause} from "../composables/agentPause.js";

// the agent the page is about, as version 4's agent bar drew it: whether it runs and the task it is working in
const props = defineProps({agent: {type: Object, default: null}, task: {type: Object, default: null}, loading: Boolean, helpers: {type: Number, default: 0}, processes: {type: Number, default: 0}, run: {type: Function, default: async () => ({ok: false, error: "nothing to ask"})}});
const emit = defineEmits(["open", "changed"]);
const LOADING_BARS = [{width: "220px", height: 12}];
const {failure, paused, toggle} = useAgentPause(toRef(props, "agent"), props.run, () => emit("changed"));
const running = computed(() => Boolean(props.agent) && !props.agent.ended_at);
const pendingWork = computed(() => props.agent?.work_status);
const word = computed(() => (pendingWork.value ? `Status: ${pendingWork.value}` : !running.value ? "Ended" : paused.value ? "Paused" : "Working"));
</script>

<template>
    <div class="agent-state" data-agent-bar>
        <template v-if="agent || !loading">
            <span :class="['dot', {running: running && !paused, paused: paused || pendingWork}]" />
        </template>
        <template v-if="agent">
            <strong data-agent-word>{{ word }}</strong>
            <template v-if="task">
                <button type="button" class="agent-task" data-agent-task :title="task.title" @click="peekRef(`tasks:${task.id}`)">Task {{ task.id }}: {{ task.title }}</button>
                <template v-if="task.planId">
                    <span class="agent-plan" data-agent-plan>Plan {{ task.planId }}</span>
                </template>
            </template>
            <template v-if="failure">
                <span class="agent-failure" role="alert" data-agent-failure>{{ failure }}</span>
            </template>
            <span class="agent-space" />
            <template v-if="running">
                <Btn variant="icon" :class="['agent-pause', {paused}]" data-agent-pause :aria-label="paused ? 'Resume' : 'Pause'" :title="paused ? 'Resume: the agent carries on where it stopped' : 'Pause: only journal commands, read tools and read commands run until you resume it'" @click="toggle">
                    <Icon :name="paused ? 'resume' : 'pause'" :size="16" />
                </Btn>
                <span class="agent-divider" />
            </template>
        </template>
        <template v-else>
            <template v-if="loading">
                <SkeletonLine :bars="LOADING_BARS" data-agent-bar-loading />
            </template>
            <template v-else>
                <strong>No agent</strong>
            </template>
            <span class="agent-space" />
        </template>
        <slot />
        <button type="button" class="agent-helpers agent-helpers-count" data-process-queue aria-label="Process queue" title="Process queue: processes running now" @click="peekRef('test_queue:0')">
            <Icon name="terminal" :size="12" />
            {{ processes }}
        </button>
        <button type="button" class="agent-helpers agent-helpers-count" data-helpers aria-label="Helpers" title="Running: helpers" @click="emit('open', 'helpers', $event.currentTarget)">
            <Icon name="agents" :size="12" />
            {{ helpers }}
        </button>
    </div>
</template>

<style scoped>
.agent-state {
    display: flex;
    gap: 10px;
    align-items: center;
    min-height: 54px;
    padding: 0 16px;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
}

@media (max-width: 760px) {
    .agent-state {
        flex-wrap: wrap;
        padding-block: 8px;
    }
}

.agent-plan {
    flex: none;
    color: var(--text-3);
    font-size: 11px;
}

.agent-divider {
    flex: none;
    width: 1px;
    height: 18px;
    background: var(--border-2);
}

.agent-pause {
    flex: none;
    color: var(--text-2);
}

.agent-pause :deep(svg) {
    stroke-width: 2.4;
}

.agent-pause.paused {
    color: var(--accent-text);
}

.agent-failure {
    color: var(--danger);
    font-size: 12px;
}

.dot.paused {
    background: var(--warn, var(--text-3));
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
    flex: 0 1 auto;
    min-width: 0;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
}
.agent-task:hover { text-decoration: underline; }
.agent-space {
    flex: 1;
}

.agent-helpers {
    flex: none;
    padding: 3px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer;
}

.agent-helpers:hover {
    background: var(--hover);
    color: var(--text);
}

.agent-helpers-count {
    display: inline-flex;
    gap: 5px;
    align-items: center;
    font-variant-numeric: tabular-nums;
}
</style>
