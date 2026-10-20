<script setup>
import {useNamedAct} from "../composables/namedAct.js";
import {useDrawingHistory} from "../composables/drawingHistory.js";
import {ago} from "../format/time.js";
import {overlapping, tidy} from "../domain/tidy.js";
import {LOCK_RULE, LOCK_WHY, stayOn} from "../domain/workflowLocks.js";
import {markOf, pairs, statusOf} from "../domain/workflowPairs.js";
import {nodeRunWords, readWords} from "../domain/workflowRuns.js";
import {countWords, limitOf, standingLines, valueLines, valueWords, waitingWords} from "../domain/workflowStanding.js";
import {usePoll} from "../composables/poll.js";
import {cardTitle, limitNote, messageShown} from "../domain/cardTitle.js";
import {CARD, KIND, PORT_AT, placeholderOf, SETTERS, STOPS_WHY, stopsTheWalk, VALUE_KEYS, WORD} from "../domain/chartCard.js";
import {computed, nextTick, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {api} from "../api/client.js";
import {route} from "../route.js";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import EmptyState from "../kit/EmptyState.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import Segmented from "../kit/Segmented.vue";
import SidePanel from "../kit/SidePanel.vue";
import ChartAddList from "./ChartAddList.vue";
import ChartEventsColumn from "./ChartEventsColumn.vue";
import ChartEmptyCanvas from "./ChartEmptyCanvas.vue";
import ChartPageBar from "./ChartPageBar.vue";
import ChartFaults from "./ChartFaults.vue";
import ChartGuideDialog from "./ChartGuideDialog.vue";
import ChartWorkflowActions from "./ChartWorkflowActions.vue";
import ChartRunOrder from "./ChartRunOrder.vue";
import ChartMessagePanel from "./ChartMessagePanel.vue";
import ChartNodeCard from "./ChartNodeCard.vue";
import ChartRunsPanel from "./ChartRunsPanel.vue";
import ChartStepDetails from "./ChartStepDetails.vue";
import ChartList from "./ChartList.vue";

const PER_LINE = {title: 30, message: 32};
const fillers = ref([]);
const VIEWS = [
    {key: "canvas", label: "Chart"},
    {key: "list", label: "Steps"},
];

const loaded = ref(false);
const workflows = ref([]);
const current = ref(0);
const standing = ref(null);
// whose values the canvas shows: the environment in view unless another is picked
const valuesEnv = ref(route.value.env);
const environments = ref([]);
const environmentItems = computed(() => environments.value.map((e) => ({key: e.name, label: e.name})));
onMounted(async () => {
    environments.value = (await api.list("environments", {limit: 50}).catch(() => ({rows: []}))).rows || [];
});
// the standing is asked again at once when another workflow opens or another environment is picked, so no other workflow's values show meanwhile
async function standAgain() {
    standing.value = null;
    standing.value = current.value ? await api.in(valuesEnv.value).chartStanding(current.value).catch(() => null) : null;
}
watch([current, valuesEnv], standAgain);
// what the workflow keeps in the environment shown, in a line; nothing for a workflow that keeps no value
const valuesWords = computed(() => {
    const keeps = nodes.value.some((n) => VALUE_KEYS.includes(n.key));
    if (!keeps || !standing.value) return "";
    const values = standing.value.values || [];
    const agents = standing.value.agents || [];
    const none = agents.length ? "" : ` No agent works in ${valuesEnv.value} now.`;
    if (!values.length) return `No value is set yet in ${valuesEnv.value}.${none}`;
    return `Values in ${valuesEnv.value}: ${values.map(valueWords).join(", ")}.${none}`;
});
usePoll(
    "chart-standing",
    () => (current.value ? api.in(valuesEnv.value).chartStanding(current.value) : Promise.resolve(null)),
    5000,
    (got) => (standing.value = got),
    () => Boolean(current.value)
);
const shipped = ref(false);
const title = ref("");
const revision = ref(0);
const catalogue = ref([]);
const nodes = ref([]);
const lines = ref([]);
const {past, dirty, remember, undo, discard, forget} = useDrawingHistory(nodes, lines);
const notice = ref("");
const {busy, act} = useNamedAct(notice);
const lastWalk = ref({});
const lastFailure = ref({});
const walkWords = computed(() => {
    const walk = lastWalk.value;
    if (!walk.at) return "";
    const said = walk.said ? `, and said: ${walk.said}` : "";
    return `Last ran ${ago(walk.at)}${said}.`;
});
const failureWords = computed(() => {
    const failure = lastFailure.value;
    if (!failure.at || (lastWalk.value.at && failure.at < lastWalk.value.at)) return "";
    return `Step ${failure.node} (${failure.key}) failed ${ago(failure.at)}: ${failure.fault}.`;
});
const selected = ref(null);
const hovered = ref(null);
const camera = reactive({x: 40, y: 40, scale: 1});
const plane = ref(null);
const drawing = ref(null);
const view = ref(window.innerWidth < 720 ? "list" : "canvas");
const adding = ref(null);
const addButton = ref(null);
const dropMark = ref(null);
const search = ref("");
const naming = ref(null);
const confirming = ref("");
// the page opens read-only: editing is switched on by hand, after a word on what an edit does, and switches off when the workflow is saved or another is opened
const unlocked = ref(false);
function unlock() {
    unlocked.value = true;
    confirming.value = "";
}
const showLead = ref(false);
const editing = ref(null);
// the selected step's details while the page reads: the full text, what the step is, how often it ran
const details = computed(() => (unlocked.value ? null : selectedNode.value));
const detailLines = computed(() => {
    const node = details.value;
    if (!node) return [];
    const entry = entryOf(node);
    const lines = [{label: "What it does", words: described(entry)}];
    if (entry.takes_text) lines.push({label: node.kind === "action" ? "Message" : "Text", words: node.text || placeholderOf(node)});
    if (isLit(node.id) && readWords(litRead.value, node.id))
        lines.push({label: "On the run shown", words: readWords(litRead.value, node.id)});
    if (node.runs) lines.push({label: "Ran", words: `${nodeRunWords(node)}${node.last ? `, last ${ago(node.last)}` : ""}`});
    const startedBy = triggersOf(node);
    if (node.kind !== "trigger" && nodes.value.filter((n) => n.kind === "trigger").length > 1)
        lines.push({label: "Runs on", words: startedBy.length ? startedBy.map((t) => entryOf(t).title).join(" and ") : "no trigger: nothing leads here"});
    lines.push(...standingLines(standing.value, node.id));
    lines.push(...valueLines(standing.value, node));
    if (node.locked) lines.push({label: "Locked", words: LOCK_WHY});
    if (stopsTheWalk(node)) lines.push({label: "Stops the later workflows", words: STOPS_WHY});
    return lines;
});
const MAIN_LINES = ["Message", "Value now"];
const detailMain = computed(() => detailLines.value.find((l) => MAIN_LINES.includes(l.label)) || detailLines.value[0] || null);
const detailRest = computed(() => detailLines.value.filter((l) => l !== detailMain.value));
const messageText = ref("");
let fresh = 0;

const entries = computed(() => Object.fromEntries(catalogue.value.map((e) => [`${e.kind}:${e.key}`, e])));
const entryOf = (node) => entries.value[`${node.kind}:${node.key}`] || {title: node.key, about: "", takes_text: false, providers: []};
const byId = computed(() => Object.fromEntries(nodes.value.map((n) => [String(n.id), n])));
const trigger = computed(() => nodes.value.find((n) => n.kind === "trigger") || null);
// the names the workflow's own steps give its counts and times, for a value step to pick from
const valueNames = computed(() => [...new Set(nodes.value.filter((n) => SETTERS.includes(n.key) && n.text.trim()).map((n) => n.text.trim().split(/\s+/)[0]))]);
const selectedNode = computed(() => (selected.value ? byId.value[String(selected.value)] || null : null));
const matches = (e) => !search.value || `${e.key} ${e.title} ${e.about}`.toLowerCase().includes(search.value.toLowerCase());
const offeredChecks = computed(() => catalogue.value.filter((e) => e.kind === "check" && matches(e)));
const offeredActions = computed(() => catalogue.value.filter((e) => e.kind === "action" && matches(e)));
const heldTriggers = computed(() => new Set(nodes.value.filter((n) => n.kind === "trigger").map((n) => n.key)));
const offeredTriggers = computed(() => catalogue.value.filter((e) => e.kind === "trigger" && !heldTriggers.value.has(e.key) && matches(e)));

// where a node added from the menu lands: under the node a dragged line came from, else under the selected node, on its first free output
const landing = computed(() => {
    if (adding.value && adding.value.from) return adding.value.from;
    const node = selectedNode.value;
    if (!node) return null;
    const port = ports(node).find((p) => !hooked(node, p));
    return port ? {node, port} : null;
});
const landingWords = computed(() =>
    landing.value
        ? `Added below ${entryOf(landing.value.node).title} and connected to its ${WORD[landing.value.port]} output.`
        : "Added to the canvas, unconnected: drag a port onto it."
);

function take(got) {
    current.value = got.id;
    shipped.value = got.shipped;
    title.value = got.title;
    revision.value = got.revision;
    nodes.value = got.nodes.map((n) => ({...n}));
    lines.value = got.lines.map((l) => ({...l}));
    if (overlapping(nodes.value, sizing)) nodes.value = tidy(nodes.value, lines.value, sizing);
    forget();
    selected.value = null;
    loaded.value = true;
    unlocked.value = false;
    notice.value = got.warnings.join(" ");
    lastWalk.value = got.last_walk;
    lastFailure.value = got.last_failure;
    lit.value = got.last_walk.nodes || [];
    faults.value = [];
}

// the whole workflow in view at first, as large as the canvas allows and never larger than life
function fit() {
    if (!plane.value || !nodes.value.length) return;
    const left = Math.min(...nodes.value.map((n) => n.x)) - 40;
    const top = Math.min(...nodes.value.map((n) => n.y)) - 32;
    const right = Math.max(...nodes.value.map((n) => n.x + CARD.width)) + 40;
    const bottom = Math.max(...nodes.value.map((n) => n.y + heightOf(n))) + 64;
    const scale = Math.min(1, plane.value.clientWidth / (right - left), plane.value.clientHeight / (bottom - top));
    camera.scale = Math.max(0.25, scale);
    camera.x = (plane.value.clientWidth - (right - left) * camera.scale) / 2 - left * camera.scale;
    camera.y = 24 - top * camera.scale;
}

async function refreshList() {
    workflows.value = (await api.chart()).workflows;
}

async function open(id) {
    take(await api.chartOne(id));
    await nextTick();
    fit();
}

async function load() {
    const got = await api.chart();
    fillers.value = got.fillers;
    workflows.value = got.workflows;
    catalogue.value = got.catalogue;
    states.value = got.states;
    const asked = workflows.value.find((w) => w.id === route.value.n);
    if (asked) await pick(asked.event, asked.id);
    else await pick(pickedEvent.value, current.value);
}
onMounted(load);
onMounted(() => window.addEventListener("resize", fit));
onUnmounted(() => window.removeEventListener("resize", fit));

// every change goes on the draft, kept apart from what the server holds until Save; Undo steps the draft back

function change(work) {
    remember();
    work();
}

function openAdd(from) {
    if (!unlocked.value) return;
    search.value = "";
    adding.value = {from: from || null};
}

// a new node lands where the menu said: under the node it hangs from, connected, or at the point a line was dropped
function add(entry) {
    const from = landing.value;
    const at = adding.value && adding.value.at;
    adding.value = null;
    change(() => {
        fresh += 1;
        const below = from
            ? {x: from.node.x + (from.port === "no" ? 240 : from.port === "yes" ? -240 : 0), y: from.node.y + heightOf(from.node) + 44}
            : null;
        const middle = {
            x: Math.round((plane.value?.clientWidth / 2 - camera.x) / camera.scale - CARD.width / 2) || 120,
            y: Math.round((plane.value?.clientHeight / 2 - camera.y) / camera.scale) || 120,
        };
        const spot = at || below || middle;
        const node = {
            id: `new-${fresh}`,
            kind: entry.kind,
            key: entry.key,
            text: "",
            x: Math.round(spot.x),
            y: Math.round(spot.y),
            shipped: false,
        };
        nodes.value.push(node);
        if (from && node.kind !== "trigger") {
            lines.value = lines.value.filter((l) => !(String(l.from) === String(from.node.id) && l.port === from.port));
            lines.value.push({from: from.node.id, to: node.id, port: from.port});
        }
        selected.value = node.id;
    });
}

function remove(node) {
    if (node.locked) return;
    if (!unlocked.value) return;
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
    if (!unlocked.value) return;
    change(() => {
        lines.value = lines.value.filter((l) => !(String(l.from) === String(node.id) && l.port === port));
        lines.value.push({from: node.id, to: target.id, port});
    });
}

function disconnect(node, port) {
    if (!unlocked.value) return;
    change(() => {
        lines.value = lines.value.filter((l) => !(String(l.from) === String(node.id) && l.port === port));
    });
}

function setText(node, text) {
    if (node.locked) return;
    if (!unlocked.value) return;
    change(() => {
        node.text = text;
    });
}

// the flow reads down the page: a line leaves a card by its bottom edge and enters the next by its top; a check's Yes and No sit side by side
const ports = (node) => (node.key === "stop_here" ? [] : node.kind === "check" ? ["yes", "no"] : ["then"]);
const linesOf = (words, perLine) => Math.max(1, Math.ceil((words || "").length / perLine));
const heightOf = (node) => {
    const title = 30 + 18 * linesOf(cardTitle(entryOf(node), node, limitOf(standing.value, node)), PER_LINE.title);
    const note = limitNote(limitOf(standing.value, node)) ? 16 : 0;
    if (!entryOf(node).takes_text) return Math.max(CARD.plain, title + note);
    const text = node.kind === "action" ? 18 + 16 * linesOf(messageShown(node.text) || "x", PER_LINE.message) : 36;
    return Math.max(CARD.text, title + note + text);
};
const sizing = {width: CARD.width, heightOf: (node) => heightOf(node)};
// a card grows when the standing names its number, so the cards are laid out again while nothing is being edited
watch(standing, () => {
    if (!unlocked.value && overlapping(nodes.value, sizing)) nodes.value = tidy(nodes.value, lines.value, sizing);
});

// the cards laid out anew by the layout package: a draft change while editing, a view while reading
function tidyUp() {
    if (unlocked.value) remember();
    nodes.value = tidy(nodes.value, lines.value, sizing);
    nextTick(fit);
}
const portAt = (node, port) => ({x: node.x + (CARD.width * PORT_AT[port]) / 100, y: node.y + heightOf(node)});
const inAt = (node) => ({x: node.x + CARD.width / 2, y: node.y});
const path = (from, to) => {
    const bow = Math.max(40, Math.abs(to.y - from.y) / 2);
    return `M ${from.x} ${from.y} C ${from.x} ${from.y + bow}, ${to.x} ${to.y - bow}, ${to.x} ${to.y}`;
};
const hooked = (node, port) => lines.value.some((l) => String(l.from) === String(node.id) && l.port === port);
// the triggers a step hangs from: every trigger whose path leads to it, in a workflow that holds more than one
function triggersOf(node) {
    const seen = new Set([String(node.id)]);
    const queue = [String(node.id)];
    const found = [];
    while (queue.length) {
        const at = queue.shift();
        for (const line of lines.value.filter((l) => String(l.to) === at)) {
            const from = String(line.from);
            if (seen.has(from)) continue;
            seen.add(from);
            if (byId.value[from]?.kind === "trigger") found.push(byId.value[from]);
            queue.push(from);
        }
    }
    return found;
}
const lineOf = (node, port) => lines.value.find((l) => String(l.from) === String(node.id) && l.port === port);
const wires = computed(() =>
    lines.value
        .filter((l) => byId.value[String(l.from)] && byId.value[String(l.to)])
        .map((l) => ({line: l, d: path(portAt(byId.value[String(l.from)], l.port), inAt(byId.value[String(l.to)]))}))
);
// each port of a card with whether a line leaves it, the pointer is on it, or a line is being drawn from it
const portStates = (node) =>
    ports(node).map((port) => ({port, on: hooked(node, port), hover: isHover(node, port), dragging: isDrawingFrom(node, port)}));
const isHover = (node, port) => hovered.value && hovered.value.node === node.id && hovered.value.port === port;
const isDrawingFrom = (node, port) => drawing.value && String(drawing.value.from) === String(node.id) && drawing.value.port === port;

// the plane: panning by dragging the empty canvas, zooming with the wheel, cards dragged by their body, lines dragged from a port
function planePoint(event) {
    const box = plane.value.getBoundingClientRect();
    return {x: (event.clientX - box.left - camera.x) / camera.scale, y: (event.clientY - box.top - camera.y) / camera.scale};
}

// the pointer is followed until it is let go
function followPointer(move) {
    const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
}

function pan(event) {
    if (event.target !== plane.value && !event.target.classList.contains("chart-wires") && !event.target.classList.contains("chart-camera"))
        return;
    const start = {x: event.clientX, y: event.clientY, cx: camera.x, cy: camera.y};
    const move = (e) => {
        camera.x = start.cx + e.clientX - start.x;
        camera.y = start.cy + e.clientY - start.y;
    };
    followPointer(move);
    selected.value = null;
}

// a wheel or a pinch zooms by a little per unit scrolled, so a trackpad's long stream of small deltas is gentle and a mouse's notches are too
function zoom(event) {
    event.preventDefault();
    const box = plane.value.getBoundingClientRect();
    const at = {x: event.clientX - box.left, y: event.clientY - box.top};
    const delta = Math.max(-40, Math.min(40, event.deltaY));
    const next = Math.min(2, Math.max(0.25, camera.scale * Math.exp(-delta * (event.ctrlKey ? 0.01 : 0.0025))));
    camera.x = at.x - ((at.x - camera.x) * next) / camera.scale;
    camera.y = at.y - ((at.y - camera.y) * next) / camera.scale;
    camera.scale = next;
}

function dragNode(node, event) {
    event.stopPropagation();
    selected.value = node.id;
    if (!unlocked.value) return;
    const start = {x: event.clientX, y: event.clientY, nx: node.x, ny: node.y};
    let moved = false;
    const move = (e) => {
        if (!moved) {
            moved = true;
            remember();
        }
        node.x = Math.round(start.nx + (e.clientX - start.x) / camera.scale);
        node.y = Math.round(start.ny + (e.clientY - start.y) / camera.scale);
    };
    followPointer(move);
}

// a line dropped on a card connects to it; dropped on empty canvas, it offers a new node where it fell
function dragLine(node, port, event) {
    if (!unlocked.value) return;
    event.stopPropagation();
    hovered.value = null;
    drawing.value = {from: node.id, port, to: planePoint(event), target: null};
    const move = (e) => {
        const card = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-node]");
        const target = card && byId.value[card.dataset.node];
        drawing.value = {
            ...drawing.value,
            to: planePoint(e),
            target: target && target.id !== node.id && target.kind !== "trigger" ? target : null,
        };
    };
    const up = async (e) => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        const target = drawing.value.target;
        const at = drawing.value.to;
        drawing.value = null;
        if (target) {
            connect(node, port, target);
            return;
        }
        const card = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-node]");
        if (card || !plane.value.contains(e.target)) return;
        adding.value = {from: {node, port}, at: {x: at.x - CARD.width / 2, y: at.y}};
        search.value = "";
        await nextTick();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
}
const drawingPath = computed(() => {
    if (!drawing.value) return "";
    const from = portAt(byId.value[String(drawing.value.from)], drawing.value.port);
    return path(from, drawing.value.target ? inAt(drawing.value.target) : drawing.value.to);
});
const dropAnchor = computed(() => (adding.value && adding.value.at && dropMark.value) || addButton.value?.$el || addButton.value || null);
const markStyle = computed(() =>
    adding.value && adding.value.at
        ? {
              left: `${camera.x + (adding.value.at.x + CARD.width / 2) * camera.scale}px`,
              top: `${camera.y + adding.value.at.y * camera.scale}px`,
          }
        : null
);

// a refused save keeps the draft: its faults go under the bar, each a click away from its step; a stale one names who saved first
const save = () =>
    act("save", async () => {
        faults.value = [];
        const at = conflict.value ? conflict.value.revision : revision.value;
        try {
            take(await api.chartSave(current.value, {revision: at, nodes: nodes.value, lines: lines.value}));
        } catch (e) {
            if (e.details && e.details.faults) {
                faults.value = e.details.faults;
                return;
            }
            if (e.details && e.details.conflict) {
                conflict.value = e.details;
                return;
            }
            throw e;
        }
        conflict.value = null;
        await refreshList();
    });
const reset = () =>
    act("reset", async () => {
        confirming.value = "";
        take(await api.chartReset(current.value));
        await refreshList();
        await nextTick();
        fit();
    });
const removeWorkflow = () =>
    act("remove", async () => {
        confirming.value = "";
        await api.chartRemove(current.value);
        await refreshList();
        await pick(pickedEvent.value);
    });
const turnOff = () =>
    act("off", async () => {
        confirming.value = "";
        take(await api.chartOff(current.value));
        await refreshList();
    });
const turnOn = () =>
    act("on", async () => {
        take(await api.chartOn(current.value));
        await refreshList();
        await nextTick();
        fit();
    });
const start = (state) =>
    act("create", async () => {
        const made = await api.chartNew({title: "", trigger: pickedEvent.value, state});
        await refreshList();
        await open(made.id);
        unlocked.value = true;
    });
const openRuns = () =>
    act("runs", async () => {
        runs.value = (await api.chartRuns(10)).runs;
    });
// a run opens the first workflow it ran, with the steps it took lit
async function openRun(run) {
    const ran = run.workflows.map((n) => workflows.value.find((w) => w.id === n)).find(Boolean);
    runs.value = null;
    if (!ran) return;
    await pick(ran.event, ran.id);
    lit.value = run.nodes;
    litRead.value = run.read || {};
}
const test = () =>
    act("try", async () => {
        const ran = await api.chartTry({
            trigger: pickedEvent.value,
            environment: "",
            ...(currentWorkflow.value && currentWorkflow.value.state ? {state: currentWorkflow.value.state} : {}),
        });
        trial.value = ran;
        lit.value = ran.nodes;
        litRead.value = ran.read || {};
    });
const trialWords = computed(() => {
    const ran = trial.value;
    if (!ran) return "";
    const would = ran.would.length ? ran.would.join(" ") : "the journal would do nothing.";
    const order = ran.titles && ran.titles.length ? ` It would run ${ran.titles.join(", then ")}.` : "";
    const stopped = ran.stopped_at ? ` It would stop the later workflows after step ${ran.stopped_at}.` : "";
    return `Test run: ${would}${order}${stopped}${ran.assumed ? ` It assumed ${ran.assumed}.` : ""} Plugins are not asked in a test run.`;
});
const states = ref([]);
const pickedEvent = ref("idle");
const stateFilter = ref("");
const runs = ref(null);
const faults = ref([]);
const conflict = ref(null);
const lit = ref([]);
const litRead = ref({});
const trial = ref(null);
const leaving = ref(null);
const listsHidden = ref(false);
const pairing = computed(() => pairs(workflows.value, states.value, catalogue.value));
const titleOf = (key) => pairing.value.titleOf(key);
const eventRows = computed(() =>
    pairing.value.events().map((e) => {
        const answering = pairing.value.answering(e.key);
        return {
            key: e.key,
            title: e.title,
            count: answering.length,
            failed: answering.some((w) => w.failed),
            off: answering.length > 0 && answering.every((w) => w.off),
            claudeOnly: !e.providers.includes("codex"),
        };
    })
);
const addableEvents = computed(() => pairing.value.addable().map((e) => ({key: e.key, label: e.title, note: e.group})));
const listRows = computed(() =>
    pairing.value.listFor(pickedEvent.value, stateFilter.value).map((w) => ({
        id: w.id,
        place: pairing.value.answering(pickedEvent.value).findIndex((x) => x.id === w.id) + 1,
        title: w.title,
        who: pairing.value.whoOf(w),
        words: statusOf(w),
        mark: markOf(w),
        locked: Boolean(w.locked),
        warnings: w.warnings,
        also: pairing.value.alsoOn(w, pickedEvent.value),
    }))
);
const filterItems = computed(() => [{key: "", label: "Every state"}, ...states.value.map((s) => ({key: s.key, label: s.title}))]);
const filterLabel = computed(() => (stateFilter.value ? titleOf(stateFilter.value) : "Every state"));
const newItems = computed(() => [
    {key: "", label: "Always", note: "whatever the agent is doing"},
    ...states.value.map((s) => ({key: s.key, label: s.title, note: "only in this state"})),
]);
const currentWorkflow = computed(() => workflows.value.find((w) => w.id === current.value) || null);
const eventTitle = computed(() => entries.value[`trigger:${pickedEvent.value}`]?.title || pickedEvent.value);
const pageTitle = computed(() => (currentWorkflow.value ? currentWorkflow.value.title : eventTitle.value));
const statusWords = computed(() => {
    const workflow = currentWorkflow.value;
    if (!workflow) return "No workflow";
    return `${statusOf(workflow) || "Default"}, runs ${pairing.value.whoOf(workflow)}`;
});
const alsoWords = computed(() => {
    const workflow = currentWorkflow.value;
    if (!workflow || !workflow.state) return "";
    const children = states.value.filter((s) => s.parent === workflow.state).map((s) => s.title.toLowerCase());
    return children.length ? `Also used while the agent is ${children.join(" or ")}, unless that state has its own here.` : "";
});
const canTry = computed(
    () => Boolean(entries.value[`trigger:${pickedEvent.value}`]?.tried) && !unlocked.value && Boolean(currentWorkflow.value)
);
const parentWords = computed(() => {
    const workflow = currentWorkflow.value;
    const parent = workflow && workflow.state ? pairing.value.parentOf(workflow.state) : "";
    return parent ? `${titleOf(parent)}'s runs here again.` : "";
});

// what the canvas shows when it has no workflow to draw: none here, one whose steps are gone, one turned off, or a trigger alone
const canvasState = computed(() => {
    if (!loaded.value) return "";
    if (!currentWorkflow.value) return "none";
    if (!nodes.value.length) return "gone";
    if (!trigger.value) return "off";
    return nodes.value.length === 1 ? "lonely" : "";
});

// what the page says under its header: what went wrong first, then what the workflow and its last walk tell
const pageNotes = computed(() => {
    const workflow = currentWorkflow.value;
    const traces = [
        workflow && workflow.behind
            ? "The shipped version of this workflow changed since you edited it. Reset to default takes the new one and drops your changes."
            : "",
        trialWords.value,
        workflow && !unlocked.value && !entries.value[`trigger:${pickedEvent.value}`]?.tried
            ? `Test run cannot stand in for ${eventTitle.value.toLowerCase()}: no test run of this event is possible from what is on record.`
            : "",
        stayOn(workflow),
        selectedLocked.value ? `${LOCK_WHY} ${LOCK_RULE}` : walkWords.value,
    ];
    return [
        ...[notice.value, failureWords.value].filter(Boolean).map((text) => ({kind: "chart-notice", text})),
        ...traces.filter(Boolean).map((text) => ({kind: "chart-trace", text})),
    ];
});

// what each change asked from the workflow's menu says before it is done
const confirmation = computed(
    () =>
        ({
            reset: {
                title: `Reset ‘${title.value}’ to default?`,
                text: "Your changes to this workflow are lost. The other workflows stay as they are.",
                label: "Reset to default",
                run: reset,
            },
            off: {
                title: `Turn ‘${title.value}’ off?`,
                text: `The journal stops answering here; its steps are kept and Turn on brings them back. ${parentWords.value}`,
                label: "Turn off",
                run: turnOff,
            },
            remove: {
                title: `Delete ‘${title.value}’?`,
                text: `The workflow and its steps are deleted. ${parentWords.value || "Nothing is left here."}`,
                label: "Delete workflow",
                run: removeWorkflow,
            },
        })[confirming.value]
);

// the one question the page asks at a time: leave unsaved changes, confirm a change from the menu, or hear that someone saved first
const pageDialog = computed(() => {
    if (leaving.value) {
        const changes = `${past.value.length} unsaved ${past.value.length === 1 ? "change" : "changes"}`;
        return {
            title: "Save your changes first?",
            text: `You have ${changes} here.`,
            close: () => (leaving.value = null),
            buttons: [
                {label: "Keep editing", run: () => (leaving.value = null)},
                {label: "Leave without saving", kind: "danger", run: leaveAnyway},
                {label: "Save", kind: "primary", busy: busy.value === "save", run: () => save().then(() => !dirty.value && leaveAnyway())},
            ],
        };
    }
    if (confirmation.value) {
        const asked = confirmation.value;
        return {
            title: asked.title,
            text: asked.text,
            close: () => (confirming.value = ""),
            buttons: [
                {label: "Cancel", run: () => (confirming.value = "")},
                {label: asked.label, kind: "danger", busy: busy.value === confirming.value, run: asked.run},
            ],
        };
    }
    if (conflict.value && !unlocked.value) {
        return {
            title: "Someone saved this workflow first",
            text: `${conflict.value.revised_by} saved it ${ago(conflict.value.revised_at)}, so your changes were not saved.`,
            close: () => (conflict.value = null),
            buttons: [{label: "Close", run: () => (conflict.value = null)}],
        };
    }
    return null;
});

// picking an event opens the first workflow of its list; picking a row opens that workflow
async function pick(event, id = 0) {
    if (dirty.value) {
        leaving.value = {event, id};
        return;
    }
    pickedEvent.value = event;
    faults.value = [];
    conflict.value = null;
    trial.value = null;
    const first = id
        ? workflows.value.find((w) => w.id === id)
        : listRows.value[0] && workflows.value.find((w) => w.id === listRows.value[0].id);
    if (first) await open(first.id);
    else empty();
}

function empty() {
    current.value = 0;
    shipped.value = false;
    title.value = "";
    nodes.value = [];
    lines.value = [];
    forget();
    selected.value = null;
    unlocked.value = false;
    notice.value = "";
    lastWalk.value = {};
    lastFailure.value = {};
    lit.value = [];
    loaded.value = true;
}

function leaveAnyway() {
    forget();
    const to = leaving.value;
    leaving.value = null;
    pick(to.event, to.id);
}

function stopEditing() {
    if (dirty.value) {
        leaving.value = {event: pickedEvent.value, id: current.value};
        return;
    }
    unlocked.value = false;
}

// a row dragged over another takes its place: the whole list goes to the server in its new order, at the revisions read
async function dropOn(from, target) {
    const ids = pairing.value.answering(pickedEvent.value).map((w) => w.id);
    const moved = ids.splice(ids.indexOf(from), 1)[0];
    ids.splice(ids.indexOf(target.id), 0, moved);
    await reorder(ids);
}
const reorder = (ids) =>
    act("order", async () => {
        const revisions = Object.fromEntries(workflows.value.map((w) => [w.id, w.revision]));
        await api.chartOrder(
            pickedEvent.value,
            ids.map((id) => ({id, revision: revisions[id]}))
        );
        await refreshList();
    });
const moveBy = (id, by) => {
    const ids = pairing.value.answering(pickedEvent.value).map((w) => w.id);
    const at = ids.indexOf(id);
    const to = Math.min(Math.max(at + by, 0), ids.length - 1);
    if (to === at) return;
    ids.splice(at, 1);
    ids.splice(to, 0, id);
    return reorder(ids);
};
const selectedLocked = computed(() => Boolean(nodes.value.find((n) => n.id === selected.value && n.locked)));
const isLit = (id) => lit.value.map(String).includes(String(id));
const litWire = (line) =>
    isLit(line.from) &&
    isLit(line.to) &&
    lit.value.map(String).indexOf(String(line.to)) === lit.value.map(String).indexOf(String(line.from)) + 1;
const stepOf = (id) => nodes.value.findIndex((n) => String(n.id) === String(id)) + 1 || "";
const faultWords = (fault) =>
    fault.node
        ? fault.words.replace(new RegExp(`\b(node|check|action|trigger) ${fault.node}\b`), `step ${stepOf(fault.node)}`)
        : fault.words;
const described = (entry) => (entry.about ? entry.about.charAt(0).toUpperCase() + entry.about.slice(1) : "");
// the message is written in the side panel and lands on the card as one change when the panel closes
function openMessage(node) {
    selected.value = node.id;
    if (!unlocked.value) return;
    editing.value = node;
    messageText.value = node.text;
}

function closeMessage() {
    if (editing.value && messageText.value !== editing.value.text) setText(editing.value, messageText.value);
    editing.value = null;
}
</script>

<template>
    <section class="chart">
        <ChartPageBar
            :busy="busy"
            :unlocked="unlocked"
            :current="current"
            :values-env="valuesEnv"
            :environment-items="environmentItems"
            :event-title="eventTitle"
            :also-words="alsoWords"
            :unsaved="past.length"
            :replaces="conflict ? conflict.revised_by : ''"
            @runs="openRuns"
            @lead="showLead = true"
            @env="valuesEnv = $event"
            @undo="undo"
            @discard="discard"
            @save="save"
            @done="stopEditing"
            @unlock="unlock"
        />
        <template v-if="faults.length">
            <ChartFaults :faults="faults" :words-of="faultWords" @select="selected = $event" />
        </template>

        <div :class="['chart-page', {folded: unlocked}]">
            <template v-if="unlocked">
                <div class="chart-crumbs">
                    <button type="button" class="chart-crumb" @click="stopEditing">{{ eventTitle }}</button>
                    <span class="chart-crumb-sep">›</span>
                    <button type="button" class="chart-crumb" @click="stopEditing">{{ pageTitle }}</button>
                </div>
            </template>
            <template v-else-if="!listsHidden">
                <ChartEventsColumn :loaded="loaded" :rows="eventRows" :picked="pickedEvent" :addable="addableEvents" @pick="pick" />
                <ChartRunOrder
                    :loaded="loaded"
                    :rows="listRows"
                    :current="current"
                    :event-title="eventTitle"
                    :filter-label="filterLabel"
                    :filter-items="filterItems"
                    :state-filter="stateFilter"
                    :new-items="newItems"
                    @filter="stateFilter = $event"
                    @pick="(id) => pick(pickedEvent, id)"
                    @move="dropOn"
                    @start="start"
                />
            </template>

            <div class="chart-main">
                <header class="chart-head">
                    <div class="chart-head-words">
                        <h1>{{ pageTitle }}</h1>
                        <span :class="['chart-status', currentWorkflow ? markOf(currentWorkflow) : 'none']">{{ statusWords }}</span>
                    </div>
                    <div class="chart-acts">
                        <template v-if="unlocked">
                            <Btn ref="addButton" kind="ghost" small :class="{on: adding && !adding.at}" @click.stop="openAdd(null)">
                                Add step
                            </Btn>
                            <template v-if="view === 'canvas'">
                                <Btn
                                    kind="ghost"
                                    small
                                    :disabled="!nodes.length"
                                    title="Lay the cards out so none overlap"
                                    @click.stop="tidyUp"
                                >
                                    Tidy up
                                </Btn>
                            </template>
                        </template>
                        <template v-else>
                            <template v-if="currentWorkflow">
                                <ChartWorkflowActions
                                    :workflow="currentWorkflow"
                                    :can-try="canTry"
                                    :shipped="shipped"
                                    :busy="busy"
                                    @test="test"
                                    @turn-on="turnOn"
                                    @confirm="confirming = $event"
                                />
                            </template>
                        </template>
                        <template v-if="!unlocked">
                            <Btn kind="ghost" small @click="listsHidden = !listsHidden">
                                {{ listsHidden ? "Show the lists" : "Hide the lists" }}
                            </Btn>
                        </template>
                        <Segmented :options="VIEWS" :value="view" @pick="view = $event" />
                    </div>
                </header>
                <template v-for="note in pageNotes" :key="note.text">
                    <p :class="note.kind">{{ note.text }}</p>
                </template>
                <template v-if="valuesWords">
                    <p class="chart-trace chart-values">{{ valuesWords }}</p>
                </template>

                <template v-if="view === 'list'">
                    <ChartList
                        :nodes="nodes"
                        :lines="lines"
                        :entry-of="entryOf"
                        :locked="!unlocked"
                        @text="setText"
                        @line="connect"
                        @unline="disconnect"
                        @remove="remove"
                    />
                </template>
                <template v-else>
                    <div ref="plane" class="chart-plane" @pointerdown="pan" @wheel="zoom">
                        <div class="chart-camera" :style="{transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`}">
                            <svg class="chart-wires" overflow="visible">
                                <template v-for="wire in wires" :key="`${wire.line.from}-${wire.line.port}-${wire.line.to}`">
                                    <g>
                                        <path :class="['chart-wire', wire.line.port, {lit: litWire(wire.line)}]" :d="wire.d" />
                                        <path class="chart-wire-grip" :d="wire.d" @click.stop="cut(wire.line)">
                                            <title>Click to delete this connection</title>
                                        </path>
                                    </g>
                                </template>
                                <template v-if="drawing">
                                    <path class="chart-wire drafting" :d="drawingPath" />
                                </template>
                            </svg>
                            <template v-for="node in nodes" :key="node.id">
                                <ChartNodeCard
                                    :node="node"
                                    :entry="entryOf(node)"
                                    :title="cardTitle(entryOf(node), node, limitOf(standing, node))"
                                    :height="heightOf(node)"
                                    :ports="portStates(node)"
                                    :selected="selected === node.id"
                                    :target="Boolean(drawing && drawing.target && drawing.target.id === node.id)"
                                    :lit="isLit(node.id)"
                                    :drawing="Boolean(drawing)"
                                    :note="limitNote(limitOf(standing, node))"
                                    :waiting="waitingWords(standing, node.id)"
                                    :counted="countWords(standing, node)"
                                    :read="readWords(litRead, node.id)"
                                    :names="VALUE_KEYS.includes(node.key) ? valueNames : []"
                                    @drag="dragNode(node, $event)"
                                    @remove="remove(node)"
                                    @open-message="openMessage(node)"
                                    @select="selected = node.id"
                                    @text="setText(node, $event)"
                                    @port-down="(port, event) => dragLine(node, port, event)"
                                    @port-enter="(port) => (hovered = {node: node.id, port})"
                                    @port-leave="hovered = null"
                                />
                            </template>
                            <template v-if="drawing && drawing.target">
                                <span
                                    class="chart-tip"
                                    :style="{left: `${drawing.target.x + CARD.width + 14}px`, top: `${drawing.target.y + 10}px`}"
                                >
                                    Release to connect
                                    <b>{{ WORD[drawing.port] }}</b>
                                    to {{ entryOf(drawing.target).title }}
                                </span>
                            </template>
                        </div>
                        <template v-if="markStyle">
                            <span ref="dropMark" class="chart-drop-mark" :style="markStyle" />
                        </template>

                        <template v-if="canvasState">
                            <ChartEmptyCanvas
                                :state="canvasState"
                                :event-title="eventTitle"
                                :new-items="newItems"
                                :parent-words="parentWords"
                                :steps="nodes.length"
                                :busy="busy === 'on'"
                                :unlocked="unlocked"
                                @start="start"
                                @turn-on="turnOn"
                                @add="((selected = trigger.id), openAdd(null))"
                                @edit="unlock"
                            />
                        </template>
                    </div>
                </template>
            </div>
        </div>

        <template v-if="runs">
            <ChartRunsPanel :runs="runs" @close="runs = null" @open="openRun" />
        </template>

        <template v-if="adding">
            <MenuPanel
                :anchor="dropAnchor"
                align="right"
                :min-width="320"
                :max-width="340"
                :max-height="520"
                @click.stop
                @close="adding = null"
            >
                <ChartAddList
                    :search="search"
                    :landing="landingWords"
                    :triggers="offeredTriggers"
                    :checks="offeredChecks"
                    :actions="offeredActions"
                    :has-trigger="Boolean(trigger)"
                    :described="described"
                    @search="search = $event"
                    @add="add"
                />
            </MenuPanel>
        </template>

        <template v-if="details">
            <ChartStepDetails
                :title="cardTitle(entryOf(details), details)"
                :kind="KIND[details.kind]"
                :main="detailMain"
                :rest="detailRest"
                @close="selected = null"
            />
        </template>
        <template v-if="editing">
            <ChartMessagePanel
                :about="`${entryOf(editing).title}: what the journal says to the agent at this step`"
                :text="messageText"
                :fillers="fillers"
                @update="messageText = $event"
                @close="closeMessage"
            />
        </template>
        <template v-if="showLead">
            <ChartGuideDialog @close="showLead = false" />
        </template>
        <template v-if="pageDialog">
            <Dialog :title="pageDialog.title" fits @close="pageDialog.close">
                <p class="chart-dialog-text">{{ pageDialog.text }}</p>
                <template #foot>
                    <template v-for="button in pageDialog.buttons" :key="button.label">
                        <Btn :kind="button.kind" :busy="Boolean(button.busy)" @click="button.run">{{ button.label }}</Btn>
                    </template>
                </template>
            </Dialog>
        </template>
    </section>
</template>

<style scoped>
.chart {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.chart-bar :deep(.page-bar-inner),
.chart-bar {
    gap: 8px;
}

.chart-page {
    display: flex;
    flex: 1;
    min-height: 0;
}
.chart-page.folded {
    flex-direction: column;
}
.chart-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
    min-height: 0;
    padding: 12px 16px 16px;
}
.chart-item.dragging {
    opacity: 0.5;
}

.chart-node.locked .chart-node-text:disabled {
    opacity: 0.8;
    cursor: not-allowed;
}
.chart-row.on {
    border-left-color: var(--accent-text);
    background: var(--sel);
}
.chart-event.none .chart-row-name {
    color: var(--text-3);
}
.chart-row-warn {
    color: var(--warn);
    font-size: 11.5px;
    font-weight: 400;
}
.chart-mark.default::before {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--text-2);
}
.chart-mark.off::before {
    width: 8px;
    height: 8px;
    border: 1.5px solid var(--text-2);
    border-radius: 50%;
}
.chart-mark.off::after {
    width: 1.5px;
    height: 11px;
    background: var(--text-2);
    transform: rotate(45deg);
}
.chart-mark.failed::before {
    width: 8px;
    height: 8px;
    border: 2px solid var(--danger-soft);
    border-radius: 50%;
}
.chart-mark.none::before {
    width: 6px;
    height: 2px;
    border-radius: 1px;
    background: var(--text-3);
}
.chart-crumbs {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px 0;
}
.chart-crumb {
    padding: 3px 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
}
.chart-crumb:hover {
    background: var(--hover);
}
.chart-crumb-sep {
    color: var(--text-3);
}
.chart-status {
    color: var(--text-3);
    font-size: 12.5px;
}
.chart-status.yours {
    color: var(--accent-text);
}
.chart-status.failed {
    color: var(--danger-soft);
}
.chart-node.lit {
    border-color: var(--tone-good);
    box-shadow: 0 0 0 1px var(--tone-good);
}
.chart-wire.lit {
    stroke: var(--tone-good);
    stroke-width: 2.5;
}

.chart-head-words {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 12px;
}

.chart-help {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
}

.chart-help:hover {
    color: var(--text);
}

.chart-head {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.chart-head h1 {
    margin: 0;
    font-size: 18px;
}

.chart-acts {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}

.chart-notice {
    margin: -8px 0 0;
    color: var(--danger-soft);
    font-size: 12.5px;
}

.chart-trace {
    margin: -8px 0 0;
    color: var(--text-muted);
    font-size: 12.5px;
}

.chart-plane {
    position: relative;
    flex: 1;
    min-height: 320px;
    overflow: hidden;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background-color: var(--bg-2);
    background-image: radial-gradient(var(--line) 1px, transparent 1px);
    background-size: 16px 16px;
    cursor: grab;
    user-select: none;
}

.chart-camera {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0;
}

.chart-wires {
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 10px;
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
    stroke: var(--accent-text);
    stroke-dasharray: 4 4;
}

.chart-wire-grip {
    fill: none;
    stroke: transparent;
    stroke-width: 12;
    cursor: pointer;
}

.chart-wire-grip:hover + .chart-wire,
g:hover .chart-wire {
    stroke-width: 2.5;
}

.chart-node.selected,
.chart-node.target {
    border-color: var(--border-3);
    background: var(--hover);
}

.chart-node-text.empty {
    color: var(--text-4);
}

.chart-glyph {
    display: inline-block;
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--text-3);
}

.chart-glyph.check {
    width: 6px;
    height: 6px;
    margin: 0 0.5px;
    border-radius: 1px;
    transform: rotate(45deg);
}

.chart-glyph.action {
    width: 6px;
    height: 6px;
    margin: 0 0.5px;
    border-radius: 1.5px;
}

.chart-port.yes {
    --c: var(--tone-good);
}

.chart-port.no {
    --c: var(--danger-soft);
}

.chart-port.on {
    border-color: var(--c);
    background: var(--c);
}

.chart-port.hover.on {
    background: var(--c);
    border-color: var(--c);
}

.chart-port.dragging {
    border-color: var(--accent-text);
    background: var(--accent-text);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent);
}

.chart-port-word.yes {
    transform: translateX(calc(-100% - 10px));
}

.chart-port-word.no {
    transform: translateX(10px);
}

.chart-port-word.on.yes {
    color: var(--tone-good);
}

.chart-port-word.on.no {
    color: var(--danger-soft);
}

.chart-tip {
    position: absolute;
    z-index: 5;
    padding: 5px 9px;
    border: 1px solid var(--border-3);
    border-radius: 7px;
    background: var(--sel);
    box-shadow: var(--tip-shadow);
    color: var(--text);
    font-size: 12px;
    white-space: nowrap;
}

.chart-tip b {
    color: var(--danger-soft);
    font-weight: 500;
}

.chart-drop-mark {
    position: absolute;
    width: 1px;
    height: 1px;
}

.chart-dialog-text {
    margin: 0;
    color: var(--text-2);
}

@media (max-width: 720px) {
    .chart-main {
        padding: 12px;
    }

    .chart-col {
        display: none;
    }

    .chart-head {
        flex-direction: column;
    }
}
</style>
