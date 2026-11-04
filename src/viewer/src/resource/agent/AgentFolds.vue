<script setup>
import {peek} from "../../route.js";
import AgentFold from "./AgentFold.vue";

// the three folds at the foot of an agent's inspector: the subagents it started, the skills it loaded and its details, each with a plain label
const props = defineProps({subagents: {type: Array, required: true}, skills: {type: Array, required: true}, details: {type: Array, required: true}});
const nameOf = (agent) => agent.given_name || `${agent.role.slice(0, 1).toUpperCase()}${agent.role.slice(1)} ${agent.id}`;
</script>

<template>
    <AgentFold icon="bot" label="Subagents" :count="props.subagents.length">
        <template v-for="agent in subagents" :key="agent.id">
            <button type="button" class="row" data-agent-subagent @click="peek('agents', agent.id)">
                <span class="text">{{ nameOf(agent) }}</span><span class="aside">{{ agent.role }} {{ agent.id }}</span>
            </button>
        </template>
        <template v-if="!subagents.length">
            <p class="none">It started no subagents.</p>
        </template>
    </AgentFold>
    <AgentFold icon="style" label="Skills loaded" :count="skills.length">
        <p class="skills" data-agent-skills>
            <template v-for="skill in skills" :key="skill.id">
                <span data-agent-skill>{{ skill.name }}</span>
            </template>
            <template v-if="!skills.length"><span class="none-inline">It loaded no skills.</span></template>
        </p>
    </AgentFold>
    <AgentFold icon="rules" label="Details" :count="details.length">
        <template v-for="[label, value, look] in details" :key="label">
            <div class="detail" data-agent-detail>
                <span class="label">{{ label }}:</span><span :class="['value', look]">{{ value }}</span>
            </div>
        </template>
    </AgentFold>
</template>

<style scoped>
.row { display: flex; align-items: center; gap: 9px; width: 100%; padding: 8px 14px; border: 0; border-bottom: 1px solid var(--border); background: none; color: var(--text-2); font: inherit; font-size: 12.5px; text-align: left; cursor: pointer; }
.row:hover { background: var(--hover); }
.text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.aside { flex: none; color: var(--text-3); font-size: 12px; }
.none { margin: 0; padding: 10px 14px; border-bottom: 1px solid var(--border); color: var(--text-3); font-size: 12px; }
.skills { display: flex; flex-wrap: wrap; gap: 4px 12px; margin: 0; padding: 9px 14px; border-bottom: 1px solid var(--border); color: var(--text-2); font-size: 12.5px; }
.none-inline { color: var(--text-3); }
.detail { display: flex; align-items: flex-start; gap: 10px; padding: 8px 14px; border-bottom: 1px solid var(--border); font-size: 12.5px; line-height: 1.5; }
.label { flex: 0 0 118px; color: var(--text-3); font-size: 12px; }
.value { flex: 1; min-width: 0; overflow-wrap: anywhere; }
.value.code { font-family: var(--mono, ui-monospace, monospace); font-size: 11.5px; }
</style>
