<script setup>
import {computed, toRef} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import {useAgentPause} from "../composables/agentPause.js";

// the agent the page is about, as version 4's agent bar drew it: whether it runs and the task it is working in
const props = defineProps({agent: {type: Object, default: null}, task: {type: Object, default: null}, loading: Boolean, waiting: {type: Number, default: 0}, workers: {type: Number, default: 0}, helpers: {type: Number, default: 0}, run: {type: Function, default: async () => ({ok: false, error: "nothing to ask"})}});
const emit = defineEmits(["open", "changed"]);
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
            <template v-if="waiting">
                <button type="button" class="agent-waiting" data-agent-waiting title="Show what the agent needs to go ahead" @click="emit('open', 'waiting', $event.currentTarget)">Waiting: {{ waiting }}</button>
            </template>
            <template v-if="task">
                <span class="agent-task" data-agent-task :title="task.title">Task {{ task.id }}: {{ task.title }}</span>
            </template>
            <template v-if="failure">
                <span class="agent-failure" role="alert" data-agent-failure>{{ failure }}</span>
            </template>
            <template v-if="running">
                <span class="agent-divider" />
                <Btn kind="icon" :class="['agent-pause', {paused}]" data-agent-pause :aria-label="paused ? 'Resume' : 'Pause'" :title="paused ? 'Resume: the agent carries on where it stopped' : 'Pause: only journal commands run until you resume it'" @click="toggle">
                    <Icon :name="paused ? 'resume' : 'pause'" />
                </Btn>
            </template>
            <span class="agent-space" />
            <button type="button" class="agent-helpers" data-helpers title="Helpers running: subagents, workers and reviewers" @click="emit('open', 'helpers', $event.currentTarget)">
                {{ helpers }} {{ helpers === 1 ? "helper" : "helpers" }}
            </button>
        </template>
        <template v-else>
            <template v-if="!loading">
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
    min-height: 46px;
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

.agent-waiting {
    padding: 0 6px;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
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
