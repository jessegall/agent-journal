<script setup>
import {reactive, ref, watch} from "vue";
import {peek} from "../../route.js";
import {rowsOf} from "./agentView.js";
import AgentFold from "./AgentFold.vue";
import {wordLabel} from "../../domain/labels.js";

// the three folds at the foot of an agent's inspector: the helpers it started, the skills it loaded and its details, each with a plain label;
// the inspector reads only the counts, and a list is read when its fold opens and again each time the inspector reloads while it stays open
const props = defineProps({id: {type: Number, required: true}, read: {type: Function, required: true}, counts: {type: Object, required: true}, loads: {type: Number, required: true}, details: {type: Array, required: true}});
const shown = reactive({helpers: false, skills: false});
const helpers = ref([]);
const skills = ref([]);
const listed = async (command) => rowsOf(await props.read(command));

watch(() => [shown.helpers, props.loads], async ([isOpen]) => {
    if (isOpen) helpers.value = await listed(["agent", "list", "--parent", String(props.id)]);
});
watch(() => [shown.skills, props.loads], async ([isOpen]) => {
    if (isOpen) skills.value = await listed(["agent-skill", "list", "--agent", String(props.id), "--state", "loaded"]);
});
const nameOf = (agent) => agent.given_name || `${wordLabel(agent.role)} ${agent.id}`;
</script>

<template>
    <AgentFold v-model:open="shown.helpers" icon="bot" label="Helpers" :count="counts.helpers">
        <template v-for="agent in helpers" :key="agent.id">
            <button type="button" class="row" data-agent-helper @click="peek('agents', agent.id)">
                <span class="text">{{ nameOf(agent) }}</span><span class="aside">{{ wordLabel(agent.role) }} {{ agent.id }}</span>
            </button>
        </template>
        <template v-if="!helpers.length">
            <p class="none">It started no helpers.</p>
        </template>
    </AgentFold>
    <AgentFold v-model:open="shown.skills" icon="style" label="Skills loaded" :count="counts.skills">
        <p class="skills" data-agent-skills>
            <template v-for="skill in skills" :key="skill.id">
                <span data-agent-skill>{{ skill.skill }}</span>
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
.row { display: flex; align-items: center; gap: 9px; width: 100%; padding: 8px 14px; border: 0; border-bottom: 1px solid var(--border-inner); background: none; color: var(--text-2); font: inherit; font-size: 12.5px; text-align: left; cursor: pointer; }
.row:hover { background: var(--hover); }
.text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.aside { flex: none; color: var(--text-3); font-size: 12px; }
.none { margin: 0; padding: 10px 14px; border-bottom: 1px solid var(--border-inner); color: var(--text-3); font-size: 12px; }
.skills { display: flex; flex-wrap: wrap; gap: 4px 12px; margin: 0; padding: 9px 14px; border-bottom: 1px solid var(--border-inner); color: var(--text-2); font-size: 12.5px; }
.none-inline { color: var(--text-3); }
.detail { display: flex; align-items: flex-start; gap: 10px; padding: 8px 14px; border-bottom: 1px solid var(--border-inner); font-size: 12.5px; line-height: 1.5; }
.label { flex: 0 0 118px; color: var(--text-3); font-size: 12px; }
.value { flex: 1; min-width: 0; overflow-wrap: anywhere; }
.value.code { font-family: var(--mono, ui-monospace, monospace); font-size: 11.5px; }
</style>
