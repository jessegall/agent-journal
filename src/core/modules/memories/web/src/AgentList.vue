<script setup>
import {watch} from "vue";
import {TimeAgo, wordLabel} from "@journal/window-kit";
import WhoRow from "./WhoRow.vue";
import {AGENT_ROWS, agentOf} from "./memoryScope.js";
import {usePagedRead} from "./usePagedRead.js";

// the agents that hold memories and are at work, or that have ended: a fold for the ended ones that reads only how many there are until it is open
const props = defineProps({environment: {type: String, required: true}, ended: Boolean, role: {type: String, required: true}, name: {type: String, default: ""}, who: {type: String, required: true}, open: Boolean});
const emit = defineEmits(["pick", "fold", "counted"]);

const shown = () => !props.ended || props.open;
const agents = usePagedRead(props.ended ? "ended" : "working", (limit) => ({environment: props.environment, ...(props.role !== "all" ? {access: props.role} : {}), ...(props.name.trim() ? {name: props.name.trim()} : {}), [props.ended ? "ended" : "working"]: true, limit: shown() ? limit : 1}), AGENT_ROWS, ["agent.*", "memory.*"]);
watch(() => [props.environment, props.role, props.name, props.open], () => agents.reset());
watch(agents.total, (total) => emit("counted", total));

const countOf = (agent) => agent.active_memories || `${agent.removed_memories} removed`;
</script>

<template>
    <template v-if="agents.total.value">
        <template v-if="ended">
            <button type="button" class="head fold" :aria-expanded="open" data-ended-fold @click="emit('fold')">
                <span class="caret">{{ open ? "▾" : "▸" }}</span>Ended <em>{{ agents.total.value }}</em>
            </button>
        </template>
        <template v-else>
            <p class="head" data-working-head>Working now <em>{{ agents.total.value }}</em></p>
        </template>
        <template v-if="shown()">
            <template v-for="agent in agents.rows.value" :key="agent.agent_id">
                <WhoRow :name="agent.name" :count="countOf(agent)" :selected="who === agentOf(agent.agent_id)" :mark="ended ? '' : 'live'" @pick="emit('pick', agent)">
                    <template #meta>{{ wordLabel(agent.role) }}, <template v-if="ended">ended <TimeAgo :at="agent.ended_at" /></template><template v-else>working now</template></template>
                </WhoRow>
            </template>
            <template v-if="agents.hasMore.value">
                <div class="more"><button type="button" class="more-button" data-agents-more @click="agents.more()">Show {{ AGENT_ROWS }} more of {{ agents.total.value }}</button></div>
            </template>
        </template>
    </template>
</template>

<style scoped>
.head {
    display: flex;
    gap: 6px;
    align-items: center;
    width: 100%;
    margin: 0;
    padding: 9px 8px 4px;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11.5px;
    font-weight: 600;
    text-align: left;
}

.fold {
    cursor: pointer;
}

.head em {
    font-style: normal;
    font-weight: 400;
}

.caret {
    width: 10px;
}

.more {
    display: flex;
    justify-content: center;
    padding: 8px 0 0;
}

.more-button {
    min-height: 26px;
    padding: 3px 10px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
}

.more-button:hover {
    background: var(--hover);
}
</style>
