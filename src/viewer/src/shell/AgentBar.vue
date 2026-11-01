<script setup>
import {computed} from "vue";

// the agent the page is about, as version 4's agent bar drew it: whether it runs, which program, its role and its session
const props = defineProps({agent: {type: Object, default: null}, helpers: {type: Number, default: 0}});
const emit = defineEmits(["open"]);
const running = computed(() => Boolean(props.agent) && !props.agent.ended_at);
</script>

<template>
    <div class="agent-state" data-agent-bar>
        <span :class="['dot', {running}]" />
        <template v-if="agent">
            <strong>{{ running ? "Working" : "Ended" }}</strong>
            <span class="detail">{{ agent.program }} · {{ agent.role }} · {{ agent.session }}</span>
            <span class="agent-space" />
            <button type="button" class="agent-helpers" data-helpers title="Helpers running" @click="emit('open', 'agents.subagents')">
                {{ helpers }} {{ helpers === 1 ? "helper" : "helpers" }}
            </button>
        </template>
        <template v-else>
            <strong>No agent</strong>
        </template>
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
.agent-space {
    flex: 1;
}

.agent-helpers {
    padding: 3px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.agent-helpers:hover {
    background: var(--hover);
    color: var(--text);
}
</style>
