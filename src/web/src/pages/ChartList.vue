<script setup>
import Btn from "../kit/Btn.vue";
import DropList from "../kit/DropList.vue";

const props = defineProps({
    nodes: {type: Array, required: true},
    lines: {type: Array, required: true},
    entryOf: {type: Function, required: true},
});
const emit = defineEmits(["text", "line", "unline", "remove"]);

const KIND = {trigger: "Trigger", check: "Check", action: "Action"};
const HELP = "{{name}}";
const PORT = {then: "Next step", yes: "If yes, go to", no: "If no, go to"};
const END = "End here (nothing follows)";

const ports = (node) => (node.kind === "check" ? ["yes", "no"] : ["then"]);
const numberOf = (node) => props.nodes.indexOf(node) + 1;
const targetOf = (node, port) => props.lines.find((l) => String(l.from) === String(node.id) && l.port === port);
const named = (node) => `${numberOf(node)} · ${props.entryOf(node).title}`;
const choices = (node) => [{key: "", label: END}, ...props.nodes.filter((n) => n.id !== node.id && n.kind !== "trigger").map((n) => ({key: String(n.id), label: named(n)}))];
const picked = (node, port) => (targetOf(node, port) ? String(targetOf(node, port).to) : "");
const described = (node) => {
    const about = props.entryOf(node).about;
    return about ? about.charAt(0).toUpperCase() + about.slice(1) : "";
};
const label = (node, port) => {
    const line = targetOf(node, port);
    const target = line && props.nodes.find((n) => String(n.id) === String(line.to));
    return target ? named(target) : "End here";
};

function pick(node, port, key) {
    if (key === "") emit("unline", node, port);
    else emit("line", node, port, props.nodes.find((n) => String(n.id) === key));
}
</script>

<template>
    <ol class="chart-list">
        <li v-for="node in nodes" :key="node.id" class="chart-list-card">
            <div class="chart-list-head">
                <span class="chart-list-kind">{{ numberOf(node) }} · {{ KIND[node.kind] }}</span>
                <span class="chart-list-grow" />
                <Btn kind="ghost" small @click="emit('remove', node)">Delete node</Btn>
            </div>
            <strong class="chart-list-title">{{ entryOf(node).title }}</strong>
            <p v-if="entryOf(node).about" class="chart-list-about">{{ described(node) }}</p>
            <template v-if="entryOf(node).takes_text">
                <textarea
                    class="chart-list-text"
                    :value="node.text"
                    rows="2"
                    :placeholder="node.kind === 'check' ? 'A number, or a setting\'s name' : 'Message to the agent'"
                    @input="emit('text', node, $event.target.value)"
                />
                <span v-if="node.kind === 'action'" class="chart-list-help">Insert values with {{ HELP }}</span>
            </template>
            <div v-for="port in ports(node)" :key="port" class="chart-list-port">
                <span :class="['chart-list-dot', port, {on: targetOf(node, port)}]" />
                <span class="chart-list-port-name">{{ PORT[port] }}</span>
                <DropList :label="label(node, port)" :items="choices(node)" :picked="picked(node, port)" :menu-width="280" @pick="pick(node, port, $event.key)" />
            </div>
        </li>
    </ol>
</template>

<style scoped>
.chart-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0;
    padding: 0 0 24px;
    list-style: none;
    overflow: auto;
}

.chart-list-card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 14px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
}

.chart-list-head {
    display: flex;
    align-items: center;
    gap: 8px;
}

.chart-list-kind {
    color: var(--text-3);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.chart-list-grow {
    flex: 1;
}

.chart-list-title {
    font-size: 13px;
    font-weight: 500;
}

.chart-list-about {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.chart-list-text {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg-2);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    resize: vertical;
}

.chart-list-text:focus {
    border-color: var(--accent);
    outline: none;
}

.chart-list-help {
    color: var(--text-4);
    font-size: 11px;
}

.chart-list-port {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 30px;
}

.chart-list-dot {
    flex: none;
    width: 10px;
    height: 10px;
    border: 1.5px solid var(--border-3);
    border-radius: 50%;
    --c: var(--text-3);
}

.chart-list-dot.yes {
    --c: var(--tone-good);
}

.chart-list-dot.no {
    --c: var(--danger-soft);
}

.chart-list-dot.on {
    border-color: var(--c);
    background: var(--c);
}

.chart-list-port-name {
    width: 96px;
    color: var(--text-2);
    font-size: 12.5px;
}
</style>
