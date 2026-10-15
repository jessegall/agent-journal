<script setup>
import {computed, nextTick, onMounted, reactive, ref} from "vue";
import {api} from "../api/client.js";
import {route} from "../route.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import DropList from "../kit/DropList.vue";
import ChartList from "./ChartList.vue";

const CARD = {width: 208, height: 44, tall: 76};
const PORT_AT = {then: 50, yes: 30, no: 70};
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
const asList = ref(window.innerWidth < 720);
const paletteOpen = ref(window.innerWidth >= 720);
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
    const bottom = Math.max(...nodes.value.map((n) => n.y + heightOf(n))) + 40;
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

function connect(node, port, target) {
    change(() => {
        lines.value = lines.value.filter((l) => !(String(l.from) === String(node.id) && l.port === port));
        lines.value.push({from: node.id, to: target.id, port});
    });
}

function disconnect(node, port) {
    change(() => {
        lines.value = lines.value.filter((l) => !(String(l.from) === String(node.id) && l.port === port));
    });
}

function setText(node, text) {
    change(() => {
        node.text = text;
    });
}

// the flow reads down the page: a line leaves a box by its bottom edge and enters the next by its top; a check's yes and no sit side by side
const ports = (node) => (node.kind === "check" ? ["yes", "no"] : ["then"]);
const heightOf = (node) => (entryOf(node).takes_text ? CARD.tall : CARD.height);
const portAt = (node, port) => ({x: node.x + (CARD.width * PORT_AT[port]) / 100, y: node.y + heightOf(node)});
const inAt = (node) => ({x: node.x + CARD.width / 2, y: node.y});
const path = (from, to) => {
    const bow = Math.max(40, Math.abs(to.y - from.y) / 2);
    return `M ${from.x} ${from.y} C ${from.x} ${from.y + bow}, ${to.x} ${to.y - bow}, ${to.x} ${to.y}`;
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
const stepOf = (node) => trial.nodes.indexOf(node.id) + 1;
const triggerItems = computed(() => AGENT_TRIGGERS.map((key) => ({key, label: entries.value[`trigger:${key}`]?.title || key})));
</script>

<template>
    <section class="chart">
        <header class="chart-head">
            <div>
                <h1>Workflow</h1>
                <p class="chart-lead">
                    How the journal treats the agent, as a flowchart. A trigger is an event, a check a yes or no question, an action what the journal
                    does. Drag a line from a port to a box. Nothing changes until you save.
                </p>
            </div>
            <div class="chart-acts">
                <Btn kind="ghost" small class="chart-add" @click="paletteOpen = !paletteOpen">{{ paletteOpen ? "Hide the palette" : "Add a box" }}</Btn>
                <Btn kind="ghost" small @click="asList = !asList">{{ asList ? "As a drawing" : "As a list" }}</Btn>
                <Btn kind="ghost" small :disabled="!past.length" @click="undo">Undo</Btn>
                <Btn kind="ghost" small :busy="busy === 'reset'" @click="reset">Back to the shipped chart</Btn>
                <Btn kind="primary" small :busy="busy === 'save'" :disabled="!dirty" @click="save">Save</Btn>
            </div>
        </header>
        <p v-if="notice" class="chart-notice">{{ notice }}</p>

        <div class="chart-body">
            <aside v-if="paletteOpen" class="chart-palette">
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

            <ChartList v-if="asList" :nodes="nodes" :lines="lines" :entry-of="entryOf" @text="setText" @line="connect" @unline="disconnect" @remove="remove" />
            <div v-else ref="plane" class="chart-plane" @pointerdown="pan" @wheel="zoom">
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
                        :style="{left: `${node.x}px`, top: `${node.y}px`, width: `${CARD.width}px`, height: `${heightOf(node)}px`}"
                        :title="entryOf(node).about"
                        @pointerdown="dragNode(node, $event)"
                    >
                        <div class="chart-node-head">
                            <span v-if="onPath(node)" class="chart-node-step">{{ stepOf(node) }}</span>
                            <Icon v-else :name="node.kind === 'trigger' ? 'bolt' : node.kind === 'check' ? 'question' : 'play'" :size="12" />
                            <span class="chart-node-title">{{ entryOf(node).title }}</span>
                            <button type="button" class="chart-node-x" title="Take this box out" @pointerdown.stop @click.stop="remove(node)">×</button>
                        </div>
                        <input
                            v-if="entryOf(node).takes_text"
                            class="chart-node-text"
                            :value="node.text"
                            :placeholder="node.kind === 'check' ? 'a number, or a setting\'s name' : 'the line, with {{next_task}} and the like'"
                            @pointerdown.stop
                            @input="setText(node, $event.target.value)"
                        />
                        <span class="chart-in" />
                        <span
                            v-for="port in ports(node)"
                            :key="port"
                            :class="['chart-port', port]"
                            :style="{left: `${PORT_AT[port]}%`}"
                            :title="`Drag a line from ${port}`"
                            @pointerdown="dragLine(node, port, $event)"
                        >{{ port }}</span>
                    </div>
                </div>
                <aside v-if="trial.ran" class="chart-try-panel">
                    <div class="chart-try-panel-head">
                        <strong>What would happen</strong>
                        <button type="button" class="chart-node-x" title="Close" @click="trial.ran = false">×</button>
                    </div>
                    <ol v-if="trial.nodes.length" class="chart-try-steps">
                        <li v-for="(id, i) in trial.nodes" :key="`${id}-${i}`">
                            <span class="chart-node-step">{{ i + 1 }}</span>
                            <span>{{ byId[String(id)] ? entryOf(byId[String(id)]).title : id }}</span>
                        </li>
                    </ol>
                    <p v-else class="chart-try-none">No box starts on this event: nothing would happen.</p>
                    <p v-for="line in trial.would" :key="line" class="chart-try-would">{{ line }}</p>
                </aside>
            </div>
        </div>

        <footer class="chart-try">
            <span class="chart-try-label">Try it dry</span>
            <DropList :label="entries[`trigger:${trial.trigger}`]?.title || trial.trigger" :items="triggerItems" :picked="trial.trigger" :menu-width="240" @pick="trial.trigger = $event.key" />
            <Btn kind="ghost" small :busy="busy === 'try'" @click="tryIt">Run</Btn>
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
    color: var(--text-3);
    max-width: 640px;
}

.chart-acts {
    display: flex;
    gap: 8px;
    flex: none;
}

.chart-notice {
    margin: 0;
    color: var(--blocking);
}

.chart-body {
    display: flex;
    gap: 16px;
    flex: 1;
    min-height: 0;
    height: calc(100vh - 330px);
    position: relative;
}

.chart-body > .chart-list {
    flex: 1;
}

@media (max-width: 720px) {
    .chart {
        padding: 16px;
    }

    .chart-body {
        flex-direction: column;
        height: auto;
    }

    .chart-palette {
        width: auto;
        max-height: 240px;
    }

    .chart-try-panel {
        position: static;
        width: auto;
    }
}

@media (min-width: 721px) {
    .chart-add {
        display: none;
    }
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
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--raised);
    color: inherit;
}

.chart-group h3 {
    margin: 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-3);
}

.chart-group-about {
    margin: 2px 0 6px;
    font-size: 12px;
    color: var(--text-3);
}

.chart-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 6px 8px;
    margin-bottom: 4px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--raised);
    color: inherit;
    text-align: left;
    cursor: pointer;
}

.chart-entry small {
    color: var(--text-3);
}

.chart-entry.trigger {
    border-left: 3px solid var(--accent-text);
}

.chart-entry.check {
    border-left: 3px solid var(--blocking);
}

.chart-entry.action {
    border-left: 3px solid var(--tone-commit);
}

.chart-plane {
    flex: 1;
    position: relative;
    background-size: 16px 16px;
    overflow: hidden;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    background-image: radial-gradient(var(--line) 1px, transparent 1px);
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
    stroke: var(--text-3);
    stroke-width: 1.5;
}

.chart-wire.yes {
    stroke: var(--tone-good);
}

.chart-wire.no {
    stroke: var(--danger-soft);
}

.chart-wire.drafting {
    stroke: var(--accent);
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
    justify-content: center;
    gap: 6px;
    padding: 6px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--raised);
    cursor: move;
    user-select: none;
    box-sizing: border-box;
}

.chart-node.trigger {
    color: var(--accent-text);
}

.chart-node.check {
    color: var(--blocking);
}

.chart-node.action {
    color: var(--tone-commit);
}

.chart-node-step {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent);
    color: var(--bg-2);
    font-size: 10px;
    font-weight: 600;
    flex: none;
}

.chart-node.selected {
    outline: 2px solid var(--accent);
}

.chart-node.lit {
    border-color: var(--accent);
    background: var(--accent-dim);
}

.chart-node-head {
    display: flex;
    align-items: center;
    gap: 6px;
}

.chart-node-title {
    flex: 1;
    font-weight: 600;
    font-size: 12.5px;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.chart-node-x {
    border: 0;
    background: none;
    color: var(--text-3);
    cursor: pointer;
    font-size: 14px;
}

.chart-node-text {
    width: 100%;
    font: inherit;
    font-size: 12px;
    padding: 3px 6px;
    border: 1px solid var(--border-2);
    border-radius: 5px;
    background: var(--bg-2);
    color: var(--text-2);
    cursor: text;
    user-select: text;
    box-sizing: border-box;
}

.chart-in {
    position: absolute;
    top: -5px;
    left: 50%;
    width: 8px;
    height: 8px;
    transform: translateX(-50%);
    border-radius: 50%;
    background: var(--border-2);
    border: 1px solid var(--text-3);
}

.chart-node.trigger .chart-in {
    display: none;
}

.chart-port {
    position: absolute;
    bottom: -10px;
    transform: translateX(-50%);
    padding: 1px 6px;
    border-radius: 10px;
    font-size: 10px;
    background: var(--text-3);
    color: var(--bg-2);
    cursor: crosshair;
}

.chart-port.yes {
    background: var(--tone-good);
}

.chart-port.no {
    background: var(--danger-soft);
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

.chart-try-panel {
    position: absolute;
    top: 12px;
    right: 12px;
    bottom: 12px;
    width: 260px;
    overflow: auto;
    padding: 12px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--raised);
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12.5px;
}

.chart-try-panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.chart-try-steps {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.chart-try-steps li {
    display: flex;
    align-items: center;
    gap: 8px;
}

.chart-try-none,
.chart-try-would {
    margin: 0;
    color: var(--text-2);
}

.chart-try-would {
    padding: 6px 8px;
    border-radius: 5px;
    background: var(--bg-2);
}
</style>
