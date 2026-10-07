<script setup>
import {computed} from "vue";
import {loadedSkills, pendingChoice} from "../../domain/agents.js";
import {span} from "../../format/time.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import {useLeadAgent} from "./lead.js";

const emit = defineEmits(["read"]);
const {data, loaded} = useLeadAgent();
const filled = computed(() => Math.round(Number(data.value.context || 0)));
const running = (rows) => (rows || []).filter((row) => row.running).length;
const waiting = (key, now) => (pendingChoice(data.value, key) ? `${pendingChoice(data.value, key)}, waiting for the agent` : now);
</script>

<template>
    <template v-if="data">
        <CellGroup head="More about the agent">
            <Cell icon="model" label="Model" :sub="waiting('model', data.model || 'Not reported')" @pick="emit('read', 'agentcontrol:model')" />
            <Cell icon="bolt" label="Reasoning effort" :sub="waiting('effort', data.effort || 'Not reported')" @pick="emit('read', 'agentcontrol:effort')" />
            <Cell icon="gauge" label="Memory used" :sub="waiting('context', `${filled}% of the agent's memory is used`)" @pick="emit('read', 'agentcontrol:context')" />
            <Cell icon="book" label="Skills loaded" :count="loadedSkills(data).length" @pick="emit('read', 'agentskills:')" />
            <Cell icon="terminal" label="Agent terminal" :count="running(data.shell_rows) || ''" @pick="emit('read', 'terminal:')" />
            <Cell icon="loop" label="Repeating prompts" :count="Object.keys(data.loops || {}).length" @pick="emit('read', 'loops:')" />
            <Cell icon="activity" label="Activity" sub="What happened in the journal, newest first" @pick="emit('read', 'activity:')" />
            <template v-if="data.branch">
                <Cell icon="branch" label="Branch" :sub="data.branch" still />
            </template>
            <Cell icon="clock" label="Running for" :sub="data.started ? span(Date.now() / 1000 - data.started) : 'Just started'" still />
        </CellGroup>
    </template>
    <template v-else-if="loaded">
        <CellGroup head="More about the agent">
            <Cell icon="agents" label="Assign a running agent" sub="A session that runs without an environment" @pick="emit('read', 'appoint:')" />
            <Cell icon="activity" label="Activity" sub="What happened in the journal, newest first" @pick="emit('read', 'activity:')" />
        </CellGroup>
    </template>
</template>
