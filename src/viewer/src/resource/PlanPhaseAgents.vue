<script setup>
import {computed} from "vue";
import {peekRef} from "../route.js";

// the agents holding or queued for the tasks of one phase not yet closed, each once, with whether it works on one now or has them waiting
const HELD_STATES = new Set(["started", "testing", "blocked"]);
const CLOSED_STATES = new Set(["completed", "cancelled"]);
const props = defineProps({tasks: {type: Array, required: true}});
const agents = computed(() => {
    const byId = new Map();
    for (const task of props.tasks.filter((one) => one.helper_id && !CLOSED_STATES.has(one.state))) {
        const held = byId.get(task.helper_id)?.held || HELD_STATES.has(task.state);
        byId.set(task.helper_id, {id: task.helper_id, name: task.helper_name, held});
    }
    return [...byId.values()];
});
</script>

<template>
    <template v-if="agents.length">
        <div class="phase-agents" data-plan-phase-agents>
            <template v-for="agent in agents" :key="agent.id">
                <button type="button" class="phase-agent" :title="`Open ${agent.name}`" data-plan-phase-agent @click="peekRef(`agents:${agent.id}`)">
                    <span :class="['agent-dot', {held: agent.held}]" />
                    {{ agent.name }}
                    <span class="agent-word">{{ agent.held ? "Working" : "Queued" }}</span>
                </button>
            </template>
        </div>
    </template>
</template>

<style scoped>
.phase-agents {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 2px 0 6px 24px;
}

.phase-agent {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 8px;
    border: 1px solid var(--border);
    border-radius: 99px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 11.5px;
    line-height: 20px;
    cursor: pointer;
}

.agent-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-3);
}

.agent-dot.held {
    background: var(--progress);
}

.agent-word {
    color: var(--text-3);
}
</style>
