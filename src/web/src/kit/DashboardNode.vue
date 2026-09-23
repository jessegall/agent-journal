<script setup>
import BarList from "./BarList.vue";
import DataTable from "./DataTable.vue";
import StatTile from "./StatTile.vue";
import SwitchCase from "./SwitchCase.vue";
import TextDisplay from "./TextDisplay.vue";

defineOptions({name: "DashboardNode"});
defineProps({node: {type: Object, required: true}});
const emit = defineEmits(["open", "file"]);
const open = (page) => emit("open", page);
</script>

<template>
    <SwitchCase :value="node.type">
        <template #stack>
            <div class="stack" :style="{gap: `${node.gap || 14}px`}">
                <template v-for="(child, at) in node.children || []" :key="at">
                    <DashboardNode :node="child" @open="open" @file="emit('file', $event)" />
                </template>
            </div>
        </template>
        <template #row>
            <div :class="['row', {wrap: node.wrap !== false}]" :style="{gap: `${node.gap || 12}px`}">
                <template v-for="(child, at) in node.children || []" :key="at">
                    <DashboardNode :node="child" @open="open" @file="emit('file', $event)" />
                </template>
            </div>
        </template>
        <template #grid>
            <div class="grid" :style="{gap: `${node.gap || 12}px`, gridTemplateColumns: `repeat(${node.columns || 2}, minmax(0, 1fr))`}">
                <template v-for="(child, at) in node.children || []" :key="at">
                    <DashboardNode :node="child" @open="open" @file="emit('file', $event)" />
                </template>
            </div>
        </template>
        <template #card>
            <section :class="['card', {opens: node.open}]" @click="node.open && open(node.open)">
                <template v-if="node.title">
                    <header class="card-head">
                        <span class="card-title">{{ node.title }}</span>
                        <template v-if="node.note">
                            <span class="card-note">{{ node.note }}</span>
                        </template>
                    </header>
                </template>
                <template v-for="(child, at) in node.children || []" :key="at">
                    <DashboardNode :node="child" @open="open" @file="emit('file', $event)" />
                </template>
            </section>
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
            <div class="block">
                <template v-if="node.title">
                    <span class="block-title">{{ node.title }}</span>
                </template>
                <BarList :items="node.items" :unit="node.unit || ''" @open="open" />
            </div>
        </template>
        <template #table>
            <DataTable :columns="node.columns" :rows="node.rows" @open="open" />
        </template>
        <template #list>
            <div class="list">
                <template v-for="(item, at) in node.items" :key="at">
                    <component
                        :is="item.open ? 'button' : 'div'"
                        :type="item.open ? 'button' : undefined"
                        :class="['list-item', item.tone, {opens: item.open}]"
                        @click="item.open && open(item.open)"
                    >
                        <span class="list-label">{{ item.label }}</span>
                        <template v-if="item.badge">
                            <span class="badge">{{ item.badge }}</span>
                        </template>
                        <template v-if="item.note">
                            <span class="list-note">{{ item.note }}</span>
                        </template>
                    </component>
                </template>
            </div>
        </template>
        <template #text>
            <TextDisplay class="text" :text="node.body" />
        </template>
        <template #fact>
            <div class="fact">
                <span class="fact-label">{{ node.label }}</span>
                <TextDisplay class="fact-body" :text="node.body" />
            </div>
        </template>
        <template #badge>
            <span :class="['badge', node.tone]">{{ node.text }}</span>
        </template>
        <template #code>
            <pre class="code"><code>{{ node.text }}</code></pre>
        </template>
        <template #file>
            <button type="button" class="file" @click="emit('file', node)">
                {{ node.label || (node.line ? `${node.path}:${node.line}` : node.path) }}
            </button>
        </template>
    </SwitchCase>
</template>

<style scoped>
.stack {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
    align-items: stretch;
}

.row.wrap {
    flex-wrap: wrap;
}

.grid {
    display: grid;
}

.card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--raised);
}

.card.opens {
    cursor: pointer;
}

.card.opens:hover {
    border-color: var(--border-2);
}

.card-head {
    display: flex;
    align-items: baseline;
    gap: 10px;
}

.card-title,
.block-title {
    color: var(--text);
    font-size: 13.5px;
    font-weight: 600;
}

.card-note {
    color: var(--text-3);
    font-size: 12px;
}

.block {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

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

.list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.list-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    text-align: left;
}

.list-item.opens {
    cursor: pointer;
}

.list-item.opens:hover {
    background: var(--hover);
}

.list-label {
    flex: 1;
    min-width: 0;
}

.list-note {
    color: var(--text-3);
    font-size: 12px;
}

.fact {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.fact-label {
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.fact-body {
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.55;
}

.badge {
    padding: 1px 7px;
    border: 1px solid var(--border-2);
    border-radius: 999px;
    color: var(--text-2);
    font-size: 11px;
}

.badge.danger,
.list-item.danger .badge {
    border-color: var(--tone-danger);
    color: var(--tone-danger);
}

.badge.warn,
.list-item.warn .badge {
    border-color: var(--tone-warn);
    color: var(--tone-warn);
}

.badge.good {
    border-color: var(--tone-good, var(--green));
    color: var(--tone-good, var(--green));
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
