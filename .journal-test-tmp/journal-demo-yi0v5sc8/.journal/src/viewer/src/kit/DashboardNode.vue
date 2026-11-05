<script setup>
import DashboardBadge from "./DashboardBadge.vue";
import DashboardBars from "./DashboardBars.vue";
import DashboardCard from "./DashboardCard.vue";
import DashboardFact from "./DashboardFact.vue";
import DashboardGroup from "./DashboardGroup.vue";
import DashboardList from "./DashboardList.vue";
import DataTable from "./DataTable.vue";
import StatTile from "./StatTile.vue";
import SwitchCase from "./SwitchCase.vue";
import TextDisplay from "./TextDisplay.vue";

defineOptions({name: "DashboardNode"});
defineProps({node: {type: Object, required: true}});
const emit = defineEmits(["open", "file"]);
const open = (page) => emit("open", page);
const file = (node) => emit("file", node);
</script>

<template>
    <SwitchCase :value="node.type">
        <template #stack>
            <DashboardGroup :node="node" @open="open" @file="file" />
        </template>
        <template #row>
            <DashboardGroup :node="node" @open="open" @file="file" />
        </template>
        <template #grid>
            <DashboardGroup :node="node" @open="open" @file="file" />
        </template>
        <template #card>
            <DashboardCard :node="node" @open="open" @file="file" />
        </template>
        <template #heading>
            <h3 :class="['heading', `level-${node.level || 2}`]">{{ node.text }}</h3>
        </template>
        <template #divider>
            <hr class="divider" />
        </template>
        <template #stat>
            <StatTile
                :label="node.label"
                :value="node.value"
                :note="node.note || ''"
                :tone="node.tone || ''"
                :opens="!!node.open"
                @open="open(node.open)"
            />
        </template>
        <template #bars>
            <DashboardBars :node="node" @open="open" />
        </template>
        <template #table>
            <DataTable :columns="node.columns" :rows="node.rows" @open="open" />
        </template>
        <template #list>
            <DashboardList :items="node.items" @open="open" />
        </template>
        <template #text>
            <TextDisplay class="text" :text="node.body" />
        </template>
        <template #fact>
            <DashboardFact :label="node.label" :body="node.body" />
        </template>
        <template #badge>
            <DashboardBadge :text="node.text" :tone="node.tone || ''" />
        </template>
        <template #code>
            <pre class="code"><code>{{ node.text }}</code></pre>
        </template>
        <template #file>
            <button type="button" class="file" @click="file(node)">
                {{ node.label || (node.line ? `${node.path}:${node.line}` : node.path) }}
            </button>
        </template>
    </SwitchCase>
</template>

<style scoped>
.heading {
    margin: 4px 0 0;
    color: var(--text);
    font-weight: 600;
}

.level-1 {
    font-size: 20px;
}

.level-2 {
    font-size: 16px;
}

.level-3 {
    font-size: 14px;
}

.divider {
    width: 100%;
    margin: 4px 0;
    border: 0;
    border-top: 1px solid var(--line);
}

.text {
    color: var(--text-2);
    font-size: 13.5px;
    line-height: 1.55;
}

.code {
    margin: 0;
    padding: 10px 12px;
    border-radius: 8px;
    background: var(--sunk, rgba(0, 0, 0, 0.25));
    color: var(--text);
    font-size: 12.5px;
    overflow-x: auto;
}

.file {
    align-self: flex-start;
    padding: 2px 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: none;
    color: var(--accent-text);
    font-family: var(--mono, monospace);
    font-size: 12px;
    cursor: pointer;
}
</style>
