<script setup>
import {computed, nextTick, onMounted, reactive, ref} from "vue";
import {api} from "../api/client.js";
import {route} from "../route.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";

const CARD = {width: 220, height: 92};
const KINDS = [
    {kind: "trigger", title: "Triggers", about: "An event that starts a path"},
    {kind: "check", title: "Checks", about: "A yes or no question about the rows"},
    {kind: "action", title: "Actions", about: "What the journal does"},
];
const AGENT_TRIGGERS = ["idle", "tool_starting", "tool_finished", "prompt_submitted", "session_started", "turn_written", "subagent_started", "subagent_ended", "compacting", "session_ended", "ticked"];

const loaded = ref(false);
const title = ref("");
const revision = ref(0);
const catalogue = ref([]);
const nodes = ref([]);
const lines = ref([]);
const past = ref([]);
const dirty = ref(false);
const busy = ref("");
const notice = ref("");
const selected = ref(null);
const search = ref("");
const camera = reactive({x: 40, y: 40, scale: 1});
const plane = ref(null);
const drawing = ref(null);
const trial = reactive({trigger: "idle", nodes: [], would: [], ran: false});
let fresh = 0;

const entries = computed(() => Object.fromEntries(catalogue.value.map((e) => [`${e.kind}:${e.key}`, e])));
const entryOf = (node) => entries.value[`${node.kind}:${node.key}`] || {title: node.key, about: "", takes_text: false, providers: []};
const byId = computed(() => Object.fromEntries(nodes.value.map((n) => [String(n.id), n])));
const offered = computed(() =>
    KINDS.map((group) => ({
        ...group,
        entries: catalogue.value.filter((e) => e.kind === group.kind && (!search.value || `${e.key} ${e.title} ${e.about}`.toLowerCase().includes(search.value.toLowerCase()))),
    }))
);

function take(got) {
    title.value = got.title;
    revision.value = got.revision;
    catalogue.value = got.catalogue;
    nodes.value = got.nodes.map((n) => ({...n}));
    lines.value = got.lines.map((l) => ({...l}));
    dirty.value = false;
    past.value = [];
    loaded.value = true;
}

// the whole chart in view at first, as large as the canvas allows
function fit() {
    if (!plane.value || !nodes.value.length) return;
    const left = Math.min(...nodes.value.map((n) => n.x)) - 40;
    const top = Math.min(...nodes.value.map((n) => n.y)) - 40;
    const right = Math.max(...nodes.value.map((n) => n.x + CARD.width)) + 40;
    const bottom = Math.max(...nodes.value.map((n) => n.y + CARD.height)) + 40;
    const scale = Math.min(1, plane.value.clientWidth / (right - left), plane.value.clientHeight / (bottom - top));
    camera.scale = Math.max(0.4, scale);
    camera.x = (plane.value.clientWidth - (right - left) * camera.scale) / 2 - left * camera.scale;
    camera.y = (plane.value.clientHeight - (bottom - top) * camera.scale) / 2 - top * camera.scale;
}

async function load() {
    take(await api.chart());
    await nextTick();
    fit();
}
onMounted(load);

// every change goes on the draft, kept apart from what the server holds until Save; Undo steps the draft back
function change(work) {
    past.value = [...past.value.slice(-19), {nodes: nodes.value.map((n) => ({...n})), lines: lines.value.map((l) => ({...l}))}];
    work();
    dirty.value = true;
}

function undo() {
    const last = past.value.pop();
    if (!last) return;
    nodes.value = last.nodes;
    lines.value = last.lines;
    dirty.value = past.value.length > 0 || true;
}

function add(entry) {
    change(() => {
        fresh += 1;
        const at = {x: Math.round((plane.value?.clientWidth / 2 - camera.x) / camera.scale) || 120, y: Math.round((plane.value?.clientHeight / 2 - camera.y) / camera.scale) || 120};
        const node = {id: `new-${fresh}`, kind: entry.kind, key: entry.key, text: "", x: at.x + ((fresh * 24) % 120), y: at.y + ((fresh * 24) % 120), shipped: false};
        nodes.value.push(node);
        selected.value = node.id;
    });
}

function remove(node) {
    change(() => {
        nodes.value = nodes.value.filter((n) => n.id !== node.id);
        lines.value = lines.value.filter((l) => String(l.from) !== String(node.id) && String(l.to) !== String(node.id));
        if (selected.value === node.id) selected.value = null;
    });
}

function cut(line) {
    change(() => {
        lines.value = lines.value.filter((l) => l !== line);
    });
}

function setText(node, text) {
    change(() => {
        node.text = text;
    });
}

const ports = (node) => (node.kind === "check" ? ["yes", "no"] : ["then"]);
const portAt = (node, port) => {
    const slots = ports(node);
    const i = slots.indexOf(port);
    return {x: node.x + CARD.width, y: node.y + (CARD.height * (i + 1)) / (slots.length + 1)};
};
const inAt = (node) => ({x: node.x, y: node.y + CARD.height / 2});
const path = (from, to) => {
    const bow = Math.max(40, Math.abs(to.x - from.x) / 2);
    return `M ${from.x} ${from.y} C ${from.x + bow} ${from.y}, ${to.x - bow} ${to.y}, ${to.x} ${to.y}`;
};
const wires = computed(() =>
    lines.value
        .filter((l) => byId.value[String(l.from)] && byId.value[String(l.to)])
        .map((l) => ({line: l, d: path(portAt(byId.value[String(l.from)], l.port), inAt(byId.value[String(l.to)]))}))
);

// the plane: panning by dragging the empty canvas, zooming with the wheel, nodes dragged by their head, lines dragged from a port
function planePoint(event) {
    const box = plane.value.getBoundingClientRect();
    return {x: (event.clientX - box.left - camera.x) / camera.scale, y: (event.clientY - box.top - camera.y) / camera.scale};
}

function pan(event) {
    if (event.target !== plane.value && !event.target.classList.contains("chart-wires")) return;
    const start = {x: event.clientX, y: event.clientY, cx: camera.x, cy: camera.y};
    const move = (e) => {
        camera.x = start.cx + e.clientX - start.x;
        camera.y = start.cy + e.clientY - start.y;
    };
    const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    selected.value = null;
}

function zoom(event) {
    event.preventDefault();
    const box = plane.value.getBoundingClientRect();
    const at = {x: event.clientX - box.left, y: event.clientY - box.top};
    const next = Math.min(2, Math.max(0.4, camera.scale * (event.deltaY < 0 ? 1.1 : 0.9)));
    camera.x = at.x - ((at.x - camera.x) * next) / camera.scale;
    camera.y = at.y - ((at.y - camera.y) * next) / camera.scale;
    camera.scale = next;
}

function dragNode(node, event) {
    event.stopPropagation();
    selected.value = node.id;
    const start = {x: event.clientX, y: event.clientY, nx: node.x, ny: node.y};
    let moved = false;
    const move = (e) => {
        if (!moved) {
            moved = true;
            past.value = [...past.value.slice(-19), {nodes: nodes.value.map((n) => ({...n})), lines: lines.value.map((l) => ({...l}))}];
        }
        node.x = Math.round(start.nx + (e.clientX - start.x) / camera.scale);
        node.y = Math.round(start.ny + (e.clientY - start.y) / camera.scale);
        dirty.value = true;
    };
    const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
}

function dragLine(node, port, event) {
    event.stopPropagation();
    drawing.value = {from: node.id, port, to: planePoint(event)};
    const move = (e) => {
        drawing.value = {...drawing.value, to: planePoint(e)};
    };
    const up = (e) => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        const card = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-node]");
        const target = card && byId.value[card.dataset.node];
        if (target && target.id !== node.id && target.kind !== "trigger") {
            change(() => {
                lines.value = lines.value.filter((l) => !(String(l.from) === String(node.id) && l.port === port && String(l.to) === String(target.id)));
                lines.value.push({from: node.id, to: target.id, port});
            });
        }
        drawing.value = null;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
}
const drawingPath = computed(() => (drawing.value ? path(portAt(byId.value[String(drawing.value.from)], drawing.value.port), drawing.value.to) : ""));

async function act(name, work) {
    busy.value = name;
    notice.value = "";
    try {
        await work();
    } catch (e) {
        notice.value = e.message;
    } finally {
        busy.value = "";
    }
}
const save = () => act("save", async () => take(await api.chartSave({revision: revision.value, nodes: nodes.value, lines: lines.value})));
const reset = () => act("reset", async () => take(await api.chartReset()));
const tryIt = () =>
    act("try", async () => {
        const ran = await api.chartTry(trial.trigger, route.value.env);
        trial.nodes = ran.nodes;
        trial.would = ran.would;
        trial.ran = true;
    });
const onPath = (node) => trial.ran && trial.nodes.includes(node.id);
</script>

<template>
    <section class="chart">
        <header class="chart-head">
            <div>
                <h1>Conduct</h1>
                <p class="chart-lead">
                    How the journal treats the agent, as a chart. A trigger is an event, a check a yes or no question, an action what the journal
                    does. Drag a line from a port to a box. Nothing changes until you save.
                </p>
            </div>
            <div class="chart-acts">
                <Btn kind="ghost" small :disabled="!past.length" @click="undo">Undo</Btn>
                <Btn kind="ghost" small :busy="busy === 'reset'" @click="reset">Back to the shipped chart</Btn>
                <Btn kind="primary" small :busy="busy === 'save'" :disabled="!dirty" @click="save">Save</Btn>
            </div>
        </header>
        <p v-if="notice" class="chart-notice">{{ notice }}</p>

        <div class="chart-body">
            <aside class="chart-palette">
                <input v-model="search" class="chart-search" type="search" placeholder="Find a trigger, check or action" />
                <div v-for="group in offered" :key="group.kind" class="chart-group">
                    <h3>{{ group.title }}</h3>
                    <p class="chart-group-about">{{ group.about }}</p>
                    <button v-for="entry in group.entries" :key="entry.key" type="button" :class="['chart-entry', entry.kind]" :title="entry.about" @click="add(entry)">
                        <span>{{ entry.title }}</span>
                        <small v-if="entry.providers.length === 1">{{ entry.providers[0] }} only</small>
                    </button>
                </div>
            </aside>

            <div ref="plane" class="chart-plane" @pointerdown="pan" @wheel="zoom">
                <div class="chart-camera" :style="{transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`}">
                    <svg class="chart-wires" overflow="visible">
                        <g v-for="wire in wires" :key="`${wire.line.from}-${wire.line.port}-${wire.line.to}`">
                            <path :class="['chart-wire', wire.line.port]" :d="wire.d" />
                            <path class="chart-wire-grip" :d="wire.d" @click.stop="cut(wire.line)">
                                <title>Click to take this line out</title>
                            </path>
                        </g>
                        <path v-if="drawing" class="chart-wire drafting" :d="drawingPath" />
                    </svg>
                    <div
                        v-for="node in nodes"
                        :key="node.id"
                        :data-node="node.id"
                        :class="['chart-node', node.kind, {selected: selected === node.id, lit: onPath(node), edited: !node.shipped}]"
                        :style="{left: `${node.x}px`, top: `${node.y}px`, width: `${CARD.width}px`, minHeight: `${CARD.height}px`}"
                        @pointerdown="dragNode(node, $event)"
                    >
                        <div class="chart-node-head">
                            <Icon :name="node.kind === 'trigger' ? 'bolt' : node.kind === 'check' ? 'question' : 'play'" :size="12" />
                            <span class="chart-node-title">{{ entryOf(node).title }}</span>
                            <button type="button" class="chart-node-x" title="Take this box out" @pointerdown.stop @click.stop="remove(node)">×</button>
                        </div>
                        <textarea
                            v-if="entryOf(node).takes_text"
                            class="chart-node-text"
                            :value="node.text"
                            :placeholder="node.kind === 'check' ? 'a number, or a setting\'s name' : 'the line, with {{next_task}} and the like'"
                            rows="2"
                            @pointerdown.stop
                            @input="setText(node, $event.target.value)"
                        />
                        <p v-else class="chart-node-about">{{ entryOf(node).about }}</p>
                        <span v-if="node.shipped" class="chart-node-shipped">shipped</span>
                        <span
                            v-for="port in ports(node)"
                            :key="port"
                            :class="['chart-port', port]"
                            :style="{top: `${(CARD.height * (ports(node).indexOf(port) + 1)) / (ports(node).length + 1)}px`}"
                            :title="`Drag a line from ${port}`"
                            @pointerdown="dragLine(node, port, $event)"
                        >{{ port }}</span>
                    </div>
                </div>
            </div>
        </div>

        <footer class="chart-try">
            <span class="chart-try-label">Try it dry</span>
            <select v-model="trial.trigger" class="chart-try-pick">
                <option v-for="key in AGENT_TRIGGERS" :key="key" :value="key">{{ entries[`trigger:${key}`]?.title || key }}</option>
            </select>
            <Btn kind="ghost" small :busy="busy === 'try'" @click="tryIt">Run</Btn>
            <span v-if="trial.ran" class="chart-try-out">
                <template v-if="trial.would.length">{{ trial.would.join(" · ") }}</template>
                <template v-else>nothing would happen</template>
            </span>
        </footer>
    </section>
</template>

<style scoped>
.chart {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    height: 100%;
    min-height: 0;
}

.chart-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
}

.chart-head h1 {
    margin: 0 0 6px;
    font-size: 20px;
}

.chart-lead {
    margin: 0;
    color: var(--text-dim, #9aa0a6);
    max-width: 640px;
}

.chart-acts {
    display: flex;
    gap: 8px;
    flex: none;
}

.chart-notice {
    margin: 0;
    color: var(--warn, #e0a848);
}

.chart-body {
    display: flex;
    gap: 16px;
    flex: 1;
    min-height: 0;
    height: calc(100vh - 330px);
}

.chart-palette {
    width: 240px;
    flex: none;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-right: 4px;
}

.chart-search {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--line, #2a2d33);
    border-radius: 6px;
    background: var(--panel, #16181c);
    color: inherit;
}

.chart-group h3 {
    margin: 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-dim, #9aa0a6);
}

.chart-group-about {
    margin: 2px 0 6px;
    font-size: 12px;
    color: var(--text-dim, #9aa0a6);
}

.chart-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 6px 8px;
    margin-bottom: 4px;
    border: 1px solid var(--line, #2a2d33);
    border-radius: 6px;
    background: var(--panel, #16181c);
    color: inherit;
    text-align: left;
    cursor: pointer;
}

.chart-entry small {
    color: var(--text-dim, #9aa0a6);
}

.chart-entry.trigger {
    border-left: 3px solid var(--accent, #7b86f5);
}

.chart-entry.check {
    border-left: 3px solid var(--warn, #e0a848);
}

.chart-entry.action {
    border-left: 3px solid var(--ok, #4cc38a);
}

.chart-plane {
    flex: 1;
    position: relative;
    overflow: hidden;
    border: 1px solid var(--line, #2a2d33);
    border-radius: 10px;
    background: var(--panel, #16181c);
    background-image: radial-gradient(var(--line, #2a2d33) 1px, transparent 1px);
    background-size: 24px 24px;
    cursor: grab;
}

.chart-camera {
    position: absolute;
    inset: 0;
    transform-origin: 0 0;
}

.chart-wires {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
}

.chart-wire {
    fill: none;
    stroke: var(--text-dim, #9aa0a6);
    stroke-width: 1.5;
}

.chart-wire.yes {
    stroke: var(--ok, #4cc38a);
}

.chart-wire.no {
    stroke: var(--warn, #e0a848);
}

.chart-wire.drafting {
    stroke: var(--accent, #7b86f5);
    stroke-dasharray: 4 4;
}

.chart-wire-grip {
    fill: none;
    stroke: transparent;
    stroke-width: 12;
    pointer-events: stroke;
    cursor: pointer;
}

.chart-node {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 10px;
    border: 1px solid var(--line, #2a2d33);
    border-radius: 8px;
    background: var(--bg, #0f1013);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    cursor: move;
    user-select: none;
}

.chart-node.trigger {
    border-top: 3px solid var(--accent, #7b86f5);
}

.chart-node.check {
    border-top: 3px solid var(--warn, #e0a848);
}

.chart-node.action {
    border-top: 3px solid var(--ok, #4cc38a);
}

.chart-node.selected {
    outline: 2px solid var(--accent, #7b86f5);
}

.chart-node.lit {
    box-shadow: 0 0 0 3px var(--accent, #7b86f5);
}

.chart-node-head {
    display: flex;
    align-items: center;
    gap: 6px;
}

.chart-node-title {
    flex: 1;
    font-weight: 600;
    font-size: 13px;
}

.chart-node-x {
    border: 0;
    background: none;
    color: var(--text-dim, #9aa0a6);
    cursor: pointer;
    font-size: 14px;
}

.chart-node-text {
    width: 100%;
    resize: vertical;
    font: inherit;
    font-size: 12px;
    padding: 4px 6px;
    border: 1px solid var(--line, #2a2d33);
    border-radius: 4px;
    background: var(--panel, #16181c);
    color: inherit;
    cursor: text;
    user-select: text;
}

.chart-node-about {
    margin: 0;
    font-size: 12px;
    color: var(--text-dim, #9aa0a6);
}

.chart-node-shipped {
    font-size: 10px;
    color: var(--text-dim, #9aa0a6);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.chart-port {
    position: absolute;
    right: -14px;
    transform: translateY(-50%);
    padding: 1px 6px;
    border-radius: 10px;
    font-size: 10px;
    background: var(--text-dim, #9aa0a6);
    color: var(--bg, #0f1013);
    cursor: crosshair;
}

.chart-port.yes {
    background: var(--ok, #4cc38a);
}

.chart-port.no {
    background: var(--warn, #e0a848);
}

.chart-try {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.chart-try-label {
    font-weight: 600;
}

.chart-try-pick {
    padding: 4px 8px;
    border: 1px solid var(--line, #2a2d33);
    border-radius: 6px;
    background: var(--panel, #16181c);
    color: inherit;
}

.chart-try-out {
    color: var(--text-dim, #9aa0a6);
}
</style>
