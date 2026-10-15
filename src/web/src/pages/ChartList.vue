<script setup>
import Btn from "../kit/Btn.vue";

const props = defineProps({
    nodes: {type: Array, required: true},
    lines: {type: Array, required: true},
    entryOf: {type: Function, required: true},
});
const emit = defineEmits(["text", "line", "unline", "remove"]);

const ports = (node) => (node.kind === "check" ? ["yes", "no"] : ["then"]);
const targetOf = (node, port) => props.lines.find((l) => String(l.from) === String(node.id) && l.port === port);
const targets = (node) => props.nodes.filter((n) => n.id !== node.id && n.kind !== "trigger");
const label = (node) => `${props.entryOf(node).title}${node.text ? ` · ${node.text.slice(0, 40)}` : ""}`;

function pick(node, port, value) {
    if (value === "") emit("unline", node, port);
    else emit("line", node, port, props.nodes.find((n) => String(n.id) === value));
}
</script>

<template>
    <ol class="chart-list">
        <li v-for="node in nodes" :key="node.id" :class="['chart-list-row', node.kind]">
            <div class="chart-list-head">
                <span class="chart-list-kind">{{ node.kind }}</span>
                <strong>{{ entryOf(node).title }}</strong>
                <span class="chart-list-grow" />
                <Btn kind="ghost" small @click="emit('remove', node)">Take out</Btn>
            </div>
            <p class="chart-list-about">{{ entryOf(node).about }}</p>
            <textarea
                v-if="entryOf(node).takes_text"
                class="chart-list-text"
                :value="node.text"
                rows="2"
                :placeholder="node.kind === 'check' ? 'a number, or a setting\'s name' : 'the line'"
                @input="emit('text', node, $event.target.value)"
            />
            <label v-for="port in ports(node)" :key="port" class="chart-list-port">
                <span :class="['chart-list-port-name', port]">{{ port }}</span>
                <select :value="targetOf(node, port) ? String(targetOf(node, port).to) : ''" class="chart-list-pick" @change="pick(node, port, $event.target.value)">
                    <option value="">the path ends</option>
                    <option v-for="t in targets(node)" :key="t.id" :value="String(t.id)">{{ label(t) }}</option>
                </select>
            </label>
        </li>
    </ol>
</template>

<style scoped>
.chart-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: auto;
}

.chart-list-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 12px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--raised);
}

.chart-list-row.trigger {
    border-left: 3px solid var(--accent-text);
}

.chart-list-row.check {
    border-left: 3px solid var(--blocking);
}

.chart-list-row.action {
    border-left: 3px solid var(--tone-commit);
}

.chart-list-head {
    display: flex;
    align-items: center;
    gap: 8px;
}

.chart-list-kind {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-3);
}

.chart-list-grow {
    flex: 1;
}

.chart-list-about {
    margin: 0;
    font-size: 12px;
    color: var(--text-3);
}

.chart-list-text {
    width: 100%;
    font: inherit;
    font-size: 13px;
    padding: 6px 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--bg-2);
    color: inherit;
}

.chart-list-port {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
}

.chart-list-port-name {
    min-width: 36px;
    padding: 1px 6px;
    border-radius: 10px;
    text-align: center;
    font-size: 11px;
    background: var(--text-3);
    color: var(--bg-2);
}

.chart-list-port-name.yes {
    background: var(--tone-good);
}

.chart-list-port-name.no {
    background: var(--danger-soft);
}

.chart-list-pick {
    flex: 1;
    padding: 4px 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--bg-2);
    color: inherit;
}
</style>
