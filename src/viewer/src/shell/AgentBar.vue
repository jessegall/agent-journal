<script setup>
import {computed, toRef} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import SkeletonLine from "../kit/SkeletonLine.vue";
import {useAgentPause} from "../composables/agentPause.js";

// the agent the page is about, as version 4's agent bar drew it: whether it runs and the task it is working in
const props = defineProps({agent: {type: Object, default: null}, task: {type: Object, default: null}, loading: Boolean, workers: {type: Number, default: 0}, helpers: {type: Number, default: 0}, run: {type: Function, default: async () => ({ok: false, error: "nothing to ask"})}});
const emit = defineEmits(["open", "changed"]);
const LOADING_BARS = [{width: "220px", height: 12}];
const {failure, paused, toggle} = useAgentPause(toRef(props, "agent"), props.run, () => emit("changed"));
const running = computed(() => Boolean(props.agent) && !props.agent.ended_at);
const word = computed(() => (!running.value ? "Ended" : paused.value ? "Paused" : "Working"));
</script>

<template>
    <div class="agent-state" data-agent-bar>
        <template v-if="agent || !loading">
            <span :class="['dot', {running: running && !paused, paused}]" />
        </template>
        <template v-if="agent">
            <strong data-agent-word>{{ word }}</strong>
            <template v-if="task">
                <span class="agent-task" data-agent-task :title="task.title">Task {{ task.id }}: {{ task.title }}</span>
            </template>
            <template v-if="failure">
                <span class="agent-failure" role="alert" data-agent-failure>{{ failure }}</span>
            </template>
            <span class="agent-space" />
            <template v-if="running">
                <Btn kind="icon" :class="['agent-pause', {paused}]" data-agent-pause :aria-label="paused ? 'Resume' : 'Pause'" :title="paused ? 'Resume: the agent carries on where it stopped' : 'Pause: only journal commands, read tools and read commands run until you resume it'" @click="toggle">
                    <Icon :name="paused ? 'resume' : 'pause'" :size="16" />
                </Btn>
                <span class="agent-divider" />
            </template>
            <button type="button" class="agent-helpers" data-helpers title="Running: subagents, workers and reviewers" @click="emit('open', 'helpers', $event.currentTarget)">
                {{ helpers }} {{ helpers === 1 ? "helper" : "helpers" }}
            </button>
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
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
</style>
