<script setup>
import {ago} from "../format/time.js";
import {overlapping, tidy} from "../domain/tidy.js";
import {LOCK_RULE, LOCK_WHY, stayOn} from "../domain/workflowLocks.js";
import {markOf, pairs, statusOf} from "../domain/workflowPairs.js";
import {nodeRunWords, readWords} from "../domain/workflowRuns.js";
import {countWords, limitOf, readingLines, standingLines, waitingWords} from "../domain/workflowStanding.js";
import {usePoll} from "../composables/poll.js";
import {cardTitle, limitNote, messageShown} from "../domain/cardTitle.js";
import {computed, nextTick, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import DropList from "../kit/DropList.vue";
import EmptyState from "../kit/EmptyState.vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import PageBar from "../kit/PageBar.vue";
import Segmented from "../kit/Segmented.vue";
import Skeleton from "../kit/Skeleton.vue";
import SidePanel from "../kit/SidePanel.vue";
import ChartList from "./ChartList.vue";

const CARD = {width: 240, plain: 48, text: 84};
const PER_LINE = {title: 30, message: 32};
const PORT_AT = {then: 50, yes: 30, no: 70};
const WORD = {then: "Next", yes: "Yes", no: "No"};
const KIND = {trigger: "Trigger", check: "Check", action: "Action"};
const portWord = (node, port) => (node.key === "count_wait" && port === "no" ? "Waits here" : WORD[port]);
const fillers = ref([]);
const VIEWS = [
    {key: "canvas", label: "Chart"},
    {key: "list", label: "Steps"},
];
const LEAD =
    "The journal answers the agent with one workflow per state per event: pick what the agent is doing, then what happens, and the workflow for that pair shows. A state with a parent uses the parent's workflow where it has none of its own.";

const loaded = ref(false);
const workflows = ref([]);
const current = ref(0);
const standing = ref(null);
usePoll(
    "chart-standing",
    () => (current.value ? api.chartStanding(current.value) : Promise.resolve(null)),
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
const past = ref([]);
const busy = ref("");
const notice = ref("");
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
    lines.push(...standingLines(standing.value, node.id));
    if (node.kind === "check" && countWords(standing.value, node))
        lines.push({label: "Count now", words: countWords(standing.value, node)});
    if (node.kind === "check")
        lines.push(...readingLines(standing.value).filter((l) => (node.text || "").startsWith(l.label.split(",")[0])));
    if (node.locked) lines.push({label: "Locked", words: LOCK_WHY});
    if (stopsTheWalk(node)) lines.push({label: "No later workflows", words: STOPS_WHY});
    return lines;
});
const MAIN_LINES = ["Message", "Count now"];
const detailMain = computed(() => detailLines.value.find((l) => MAIN_LINES.includes(l.label)) || detailLines.value[0] || null);
const detailRest = computed(() => detailLines.value.filter((l) => l !== detailMain.value));
const messageText = ref("");
const messageBox = ref(null);
let fresh = 0;

const entries = computed(() => Object.fromEntries(catalogue.value.map((e) => [`${e.kind}:${e.key}`, e])));
const entryOf = (node) => entries.value[`${node.kind}:${node.key}`] || {title: node.key, about: "", takes_text: false, providers: []};
const byId = computed(() => Object.fromEntries(nodes.value.map((n) => [String(n.id), n])));
const trigger = computed(() => nodes.value.find((n) => n.kind === "trigger") || null);
const selectedNode = computed(() => (selected.value ? byId.value[String(selected.value)] || null : null));
const dirty = computed(() => past.value.length > 0);
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
    past.value = [];
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
    await pick(pickedEvent.value, current.value);
}
onMounted(load);
onMounted(() => window.addEventListener("resize", fit));
onUnmounted(() => window.removeEventListener("resize", fit));

// every change goes on the draft, kept apart from what the server holds until Save; Undo steps the draft back
function remember() {
    past.value = [...past.value.slice(-39), {nodes: nodes.value.map((n) => ({...n})), lines: lines.value.map((l) => ({...l}))}];
}

function change(work) {
    remember();
    work();
}

function undo() {
    const last = past.value.pop();
    if (!last) return;
    nodes.value = last.nodes;
    lines.value = last.lines;
}

function discard() {
    if (!past.value.length) return;
    const first = past.value[0];
    nodes.value = first.nodes;
    lines.value = first.lines;
    past.value = [];
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
const STOPS_WHY = "When this step runs, no later workflow of the event runs; the agent is not stopped by it";
const stopsTheWalk = (node) => node.kind === "action" && ["stop_here", "block_stop"].includes(node.key);
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
const lineOf = (node, port) => lines.value.find((l) => String(l.from) === String(node.id) && l.port === port);
const wires = computed(() =>
    lines.value
        .filter((l) => byId.value[String(l.from)] && byId.value[String(l.to)])
        .map((l) => ({line: l, d: path(portAt(byId.value[String(l.from)], l.port), inAt(byId.value[String(l.to)]))}))
);
const isHover = (node, port) => hovered.value && hovered.value.node === node.id && hovered.value.port === port;
const isDrawingFrom = (node, port) => drawing.value && String(drawing.value.from) === String(node.id) && drawing.value.port === port;

// the plane: panning by dragging the empty canvas, zooming with the wheel, cards dragged by their body, lines dragged from a port
function planePoint(event) {
    const box = plane.value.getBoundingClientRect();
    return {x: (event.clientX - box.left - camera.x) / camera.scale, y: (event.clientY - box.top - camera.y) / camera.scale};
}

function pan(event) {
    if (event.target !== plane.value && !event.target.classList.contains("chart-wires") && !event.target.classList.contains("chart-camera"))
        return;
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
    const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
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
    const stopped = ran.stopped_at ? ` It would run no later workflows after step ${ran.stopped_at}.` : "";
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
const dragging = ref(0);
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
    past.value = [];
    selected.value = null;
    unlocked.value = false;
    notice.value = "";
    lastWalk.value = {};
    lastFailure.value = {};
    lit.value = [];
    loaded.value = true;
}

function leaveAnyway() {
    past.value = [];
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
async function dropOn(target) {
    const from = dragging.value;
    dragging.value = 0;
    if (!from || from === target.id) return;
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

function insertFiller(filler) {
    const box = messageBox.value;
    const at = box ? box.selectionStart : messageText.value.length;
    const text = messageText.value;
    messageText.value = `${text.slice(0, at)}${filler.key}${text.slice(at)}`;
    if (box) nextTick(() => box.focus());
}

const placeholderOf = (node) => (node.kind === "check" ? "A number, or the name of a setting" : "Message to the agent");
</script>

<template>
    <section class="chart">
        <PageBar class="chart-bar">
            <Btn kind="ghost" small :busy="busy === 'runs'" title="The last ten runs across every workflow" @click="openRuns">
                Recent runs
            </Btn>
            <Btn kind="ghost" small @click="showLead = true">How it works</Btn>
            <span class="chart-grow" />
            <template v-if="unlocked">
                <span class="chart-warning">Saving changes this for every agent, from the next {{ eventTitle }}. {{ alsoWords }}</span>
                <span v-if="conflict" class="chart-unsaved">Save replaces {{ conflict.revised_by }}'s version</span>
                <span v-else-if="dirty" class="chart-unsaved">
                    {{ past.length }} unsaved {{ past.length === 1 ? "change" : "changes" }}
                </span>
                <Btn kind="ghost" small :disabled="!dirty" title="Undo last change" @click="undo">Undo</Btn>
                <Btn kind="ghost" small :disabled="!dirty" @click="discard">Discard changes</Btn>
                <Btn
                    kind="primary"
                    small
                    :busy="busy === 'save'"
                    :disabled="!dirty && !conflict"
                    title="Takes effect at the agent's next event"
                    @click="save"
                >
                    Save
                </Btn>
                <Btn kind="ghost" small @click="stopEditing">Done</Btn>
            </template>
            <Btn v-else kind="ghost" small :disabled="!current" title="Change what the journal does here" @click="unlock">Edit</Btn>
        </PageBar>
        <ul v-if="faults.length" class="chart-faults" role="alert">
            <li v-for="(fault, i) in faults" :key="i">
                <button type="button" class="chart-fault" :disabled="!fault.node" @click="selected = fault.node">
                    {{ faultWords(fault) }}
                </button>
            </li>
        </ul>

        <div :class="['chart-page', {folded: unlocked}]">
            <template v-if="unlocked">
                <div class="chart-crumbs">
                    <button type="button" class="chart-crumb" @click="stopEditing">{{ eventTitle }}</button>
                    <span class="chart-crumb-sep">›</span>
                    <button type="button" class="chart-crumb" @click="stopEditing">{{ pageTitle }}</button>
                </div>
            </template>
            <template v-else-if="!listsHidden">
                <aside class="chart-col chart-events" aria-label="Event">
                    <h2 class="chart-col-head">Event</h2>
                    <Skeleton v-if="!loaded" :count="8" label="Loading the events" />
                    <button
                        v-for="row in loaded ? eventRows : []"
                        :key="row.key"
                        type="button"
                        :class="['chart-row', 'chart-event', {on: row.key === pickedEvent, none: !row.count}]"
                        :aria-current="row.key === pickedEvent ? 'true' : null"
                        @click="pick(row.key)"
                    >
                        <span
                            :class="['chart-mark', row.failed ? 'failed' : row.off ? 'off' : row.count ? 'default' : 'none']"
                            aria-hidden="true"
                        />
                        <span class="chart-row-name">{{ row.title }}</span>
                        <span v-if="row.count" class="chart-row-words">{{ row.count }}</span>
                        <span v-else-if="row.claudeOnly" class="chart-row-words">Claude only</span>
                    </button>
                    <DropList
                        class="chart-add-event"
                        label="Add an event"
                        icon="plus"
                        :items="addableEvents"
                        :menu-width="300"
                        searchable
                        @pick="pick($event.key)"
                    />
                </aside>
                <aside class="chart-col chart-list" aria-label="Workflows, in the order they run">
                    <div class="chart-col-top">
                        <h2 class="chart-col-head">Run order</h2>
                        <DropList
                            :label="filterLabel"
                            :items="filterItems"
                            :picked="stateFilter"
                            :menu-width="220"
                            @pick="stateFilter = $event.key"
                        />
                    </div>
                    <Skeleton v-if="!loaded" :count="5" label="Loading the workflows" />
                    <p v-else-if="!listRows.length" class="chart-list-empty">Nothing answers {{ eventTitle.toLowerCase() }} yet.</p>
                    <button
                        v-for="row in loaded ? listRows : []"
                        :key="row.id"
                        type="button"
                        :class="[
                            'chart-row',
                            'chart-item',
                            row.mark,
                            {on: row.id === current, dragging: dragging === row.id, locked: row.locked},
                        ]"
                        :aria-current="row.id === current ? 'true' : null"
                        :draggable="!row.locked && !stateFilter"
                        :title="
                            row.locked
                                ? 'Locked: this one always runs here'
                                : stateFilter
                                  ? 'Pick Every state to drag the order'
                                  : 'Drag to change the order'
                        "
                        @dragstart="dragging = row.id"
                        @dragend="dragging = 0"
                        @dragover.prevent
                        @drop.prevent="dropOn(row)"
                        @click="pick(pickedEvent, row.id)"
                    >
                        <span class="chart-item-place">{{ row.place }}</span>
                        <Icon v-if="row.locked" name="lock" :size="11" class="chart-item-lock" :title="LOCK_WHY" />
                        <span class="chart-item-words">
                            <span class="chart-row-name">{{ row.title }}</span>
                            <span class="chart-row-sub">
                                {{ row.who }}
                                <template v-if="row.words">· {{ row.words }}</template>
                            </span>
                        </span>
                        <span :class="['chart-mark', row.mark]" aria-hidden="true" />
                    </button>
                    <DropList
                        class="chart-add-event"
                        label="New workflow"
                        icon="plus"
                        :items="newItems"
                        :menu-width="260"
                        @pick="start($event.key)"
                    />
                </aside>
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
                            <Btn
                                v-if="view === 'canvas'"
                                kind="ghost"
                                small
                                :disabled="!nodes.length"
                                title="Lay the cards out so none overlap"
                                @click.stop="tidyUp"
                            >
                                Tidy up
                            </Btn>
                        </template>
                        <template v-else>
                            <template v-if="currentWorkflow">
                                <Btn
                                    v-if="canTry"
                                    kind="ghost"
                                    small
                                    :busy="busy === 'try'"
                                    title="Walks the saved workflow against the agent's rows; nothing is sent"
                                    @click="test"
                                >
                                    Test run
                                </Btn>
                                <Btn v-if="currentWorkflow.off" kind="ghost" small :busy="busy === 'on'" @click="turnOn">Turn on</Btn>
                                <Btn
                                    v-else
                                    kind="ghost"
                                    small
                                    :disabled="Boolean(stayOn(currentWorkflow))"
                                    :title="stayOn(currentWorkflow) || null"
                                    @click="confirming = 'off'"
                                >
                                    Turn off
                                </Btn>
                                <Btn
                                    v-if="shipped && (currentWorkflow.edited || currentWorkflow.off)"
                                    kind="ghost"
                                    small
                                    @click="confirming = 'reset'"
                                >
                                    Reset to default
                                </Btn>
                                <Btn v-if="!shipped && !currentWorkflow.locked" kind="ghost" small @click="confirming = 'remove'">
                                    Delete
                                </Btn>
                            </template>
                        </template>
                        <Btn v-if="!unlocked" kind="ghost" small @click="listsHidden = !listsHidden">
                            {{ listsHidden ? "Show the lists" : "Hide the lists" }}
                        </Btn>
                        <Segmented :options="VIEWS" :value="view" @pick="view = $event" />
                    </div>
                </header>
                <p v-if="notice" class="chart-notice">{{ notice }}</p>
                <p v-if="failureWords" class="chart-notice">{{ failureWords }}</p>
                <p v-if="currentWorkflow && currentWorkflow.behind" class="chart-trace">
                    The shipped version of this workflow changed since you edited it. Reset to default takes the new one and drops your
                    changes.
                </p>
                <p v-if="trialWords" class="chart-trace">{{ trialWords }}</p>
                <p v-if="currentWorkflow && !unlocked && !entries[`trigger:${pickedEvent}`]?.tried" class="chart-trace">
                    Test run cannot stand in for {{ eventTitle.toLowerCase() }}: no trial of this event is possible from the rows.
                </p>
                <p v-if="stayOn(currentWorkflow)" class="chart-trace">{{ stayOn(currentWorkflow) }}</p>
                <p v-if="selectedLocked" class="chart-trace">{{ LOCK_WHY }} {{ LOCK_RULE }}</p>
                <p v-else-if="walkWords" class="chart-trace">{{ walkWords }}</p>

                <ChartList
                    v-if="view === 'list'"
                    :nodes="nodes"
                    :lines="lines"
                    :entry-of="entryOf"
                    :locked="!unlocked"
                    @text="setText"
                    @line="connect"
                    @unline="disconnect"
                    @remove="remove"
                />
                <div v-else ref="plane" class="chart-plane" @pointerdown="pan" @wheel="zoom">
                    <div class="chart-camera" :style="{transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`}">
                        <svg class="chart-wires" overflow="visible">
                            <g v-for="wire in wires" :key="`${wire.line.from}-${wire.line.port}-${wire.line.to}`">
                                <path :class="['chart-wire', wire.line.port, {lit: litWire(wire.line)}]" :d="wire.d" />
                                <path class="chart-wire-grip" :d="wire.d" @click.stop="cut(wire.line)">
                                    <title>Click to delete this connection</title>
                                </path>
                            </g>
                            <path v-if="drawing" class="chart-wire drafting" :d="drawingPath" />
                        </svg>
                        <div
                            v-for="node in nodes"
                            :key="node.id"
                            :data-node="node.id"
                            :class="[
                                'chart-node',
                                node.kind,
                                {
                                    selected: selected === node.id,
                                    target: drawing && drawing.target && drawing.target.id === node.id,
                                    lit: isLit(node.id),
                                    end: node.key === 'stop_here',
                                    locked: node.locked,
                                },
                            ]"
                            :style="{left: `${node.x}px`, top: `${node.y}px`, width: `${CARD.width}px`, height: `${heightOf(node)}px`}"
                            @pointerdown="dragNode(node, $event)"
                        >
                            <div class="chart-node-kind">
                                <span :class="['chart-glyph', node.kind]" />
                                <span>{{ KIND[node.kind] }}</span>
                                <Icon v-if="node.locked" name="lock" :size="11" class="chart-node-lock" :title="LOCK_WHY" />
                                <span v-if="stopsTheWalk(node)" class="chart-node-stops" :title="STOPS_WHY">no later workflows</span>
                                <span
                                    v-if="waitingWords(standing, node.id)"
                                    class="chart-node-waiting"
                                    title="An agent's last walk of this workflow stopped here"
                                >
                                    {{ waitingWords(standing, node.id) }}
                                </span>
                                <span v-if="node.kind === 'check' && countWords(standing, node)" class="chart-node-count">
                                    {{ countWords(standing, node) }}
                                </span>
                                <span v-if="isLit(node.id) && readWords(litRead, node.id)" class="chart-node-read">
                                    {{ readWords(litRead, node.id) }}
                                </span>
                                <button
                                    v-if="selected === node.id && !node.locked"
                                    type="button"
                                    class="chart-node-x"
                                    title="Delete node"
                                    @pointerdown.stop
                                    @click.stop="remove(node)"
                                >
                                    <Icon name="close" :size="12" />
                                </button>
                            </div>
                            <div class="chart-node-title" :title="entryOf(node).about">
                                {{ cardTitle(entryOf(node), node, limitOf(standing, node)) }}
                            </div>
                            <div v-if="limitNote(limitOf(standing, node))" class="chart-node-note">
                                {{ limitNote(limitOf(standing, node)) }}
                            </div>
                            <template v-if="entryOf(node).takes_text">
                                <button
                                    v-if="node.kind === 'action'"
                                    type="button"
                                    :class="['chart-node-text', {empty: !node.text}]"
                                    :disabled="node.locked"
                                    :title="node.locked ? LOCK_WHY : 'Click to write the message'"
                                    @pointerdown.stop
                                    @click.stop="openMessage(node)"
                                >
                                    {{ node.text ? messageShown(node.text) : placeholderOf(node) }}
                                </button>
                                <input
                                    v-else
                                    class="chart-node-text"
                                    :value="node.text"
                                    :placeholder="placeholderOf(node)"
                                    :disabled="node.locked"
                                    :title="node.locked ? LOCK_WHY : null"
                                    @pointerdown.stop
                                    @focus="selected = node.id"
                                    @input="setText(node, $event.target.value)"
                                />
                            </template>
                            <span
                                v-if="node.kind !== 'trigger'"
                                :class="['chart-in', {ready: drawing && drawing.target && drawing.target.id === node.id}]"
                            />
                            <template v-for="port in ports(node)" :key="port">
                                <span
                                    :class="[
                                        'chart-port',
                                        port,
                                        {
                                            on: hooked(node, port),
                                            hover: isHover(node, port) && !drawing,
                                            dragging: isDrawingFrom(node, port),
                                        },
                                    ]"
                                    :style="{left: `${PORT_AT[port]}%`}"
                                    :title="`Drag to connect the ${WORD[port]} output${hooked(node, port) ? '' : '. Not connected: the workflow ends here'}`"
                                    @pointerdown="dragLine(node, port, $event)"
                                    @pointerenter="hovered = {node: node.id, port}"
                                    @pointerleave="hovered = null"
                                >
                                    <Icon v-if="isHover(node, port) && !drawing && !hooked(node, port)" name="plus" :size="11" />
                                </span>
                                <span
                                    v-if="port !== 'then'"
                                    :class="['chart-port-word', port, {on: hooked(node, port) || isDrawingFrom(node, port)}]"
                                    :style="{left: `${PORT_AT[port]}%`}"
                                >
                                    {{ portWord(node, port) }}
                                </span>
                            </template>
                        </div>
                        <span
                            v-if="drawing && drawing.target"
                            class="chart-tip"
                            :style="{left: `${drawing.target.x + CARD.width + 14}px`, top: `${drawing.target.y + 10}px`}"
                        >
                            Release to connect
                            <b>{{ WORD[drawing.port] }}</b>
                            to {{ entryOf(drawing.target).title }}
                        </span>
                    </div>
                    <span v-if="markStyle" ref="dropMark" class="chart-drop-mark" :style="markStyle" />

                    <template v-if="loaded && !currentWorkflow">
                        <EmptyState class="chart-empty" title="Nothing is set up here">
                            No workflow answers {{ eventTitle.toLowerCase() }} yet.
                            <br />
                            <DropList
                                class="chart-empty-add"
                                label="New workflow"
                                icon="plus"
                                :items="newItems"
                                :menu-width="260"
                                @pick="start($event.key)"
                            />
                        </EmptyState>
                    </template>
                    <template v-else-if="loaded && !nodes.length">
                        <EmptyState class="chart-empty" title="This workflow is turned off">
                            Its steps are gone, so the journal does nothing here. {{ parentWords }}
                            <br />
                            <Btn class="chart-empty-add" :busy="busy === 'on'" @click.stop="turnOn">Turn on</Btn>
                        </EmptyState>
                    </template>
                    <template v-else-if="loaded && !trigger">
                        <EmptyState class="chart-empty" title="This workflow is turned off">
                            Its {{ nodes.length }} {{ nodes.length === 1 ? "step is" : "steps are" }} kept. Turn on brings
                            {{ nodes.length === 1 ? "it" : "them" }} back.
                            {{ parentWords }}
                            <br />
                            <Btn class="chart-empty-add" :busy="busy === 'on'" @click.stop="turnOn">Turn on</Btn>
                        </EmptyState>
                    </template>
                    <template v-else-if="loaded && nodes.length === 1 && trigger">
                        <div class="chart-hint">
                            <p class="chart-hint-title">Nothing follows the trigger yet</p>
                            <p class="chart-hint-text">Add step puts a check or an action below the selected step and connects it.</p>
                            <Btn v-if="unlocked" @click.stop="((selected = trigger.id), openAdd(null))">Add step</Btn>
                            <Btn v-else @click.stop="unlock">Edit</Btn>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <template v-if="runs">
            <SidePanel
                title="Recent runs"
                abstract="The last ten runs across every workflow, newest first. A run opens its workflow with the steps it took lit."
                @close="runs = null"
            >
                <p v-if="!runs.length" class="chart-runs-empty">No runs yet.</p>
                <ul v-else class="chart-runs">
                    <li v-for="run in runs" :key="run.at">
                        <button type="button" class="chart-run" @click="openRun(run)">
                            <span class="chart-run-when">
                                {{ ago(run.at) }}
                                <span v-if="run.failed" class="chart-row-bad">· Failed</span>
                            </span>
                            <span class="chart-run-title">{{ run.titles.join(" and ") }}</span>
                            <span v-if="run.change" class="chart-run-said">{{ run.change }}</span>
                            <span v-if="run.answer" class="chart-run-said">{{ run.answer }}</span>
                            <span v-if="run.counts" class="chart-run-said">Counts: {{ run.counts }}</span>
                        </button>
                    </li>
                </ul>
            </SidePanel>
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
                <TextInput
                    class="chart-search"
                    icon="search"
                    :value="search"
                    placeholder="Search nodes"
                    autofocus
                    @input="search = $event.target.value"
                />
                <p class="chart-landing">{{ landingWords }}</p>
                <MenuLabel>Triggers</MenuLabel>
                <p v-if="trigger" class="chart-menu-about">
                    A trigger for another event makes this workflow answer that event too, sharing its counts.
                </p>
                <template v-for="entry in offeredTriggers" :key="`trigger:${entry.key}`">
                    <MenuItem :description="described(entry)" @click="add(entry)">
                        <span class="chart-glyph trigger" />
                        {{ entry.title }}
                    </MenuItem>
                </template>
                <MenuLabel>
                    Checks
                    <span class="chart-label-note">— a yes or no question</span>
                </MenuLabel>
                <template v-for="entry in offeredChecks" :key="`check:${entry.key}`">
                    <MenuItem :description="described(entry)" @click="add(entry)">
                        <span class="chart-glyph check" />
                        {{ entry.title }}
                    </MenuItem>
                </template>
                <MenuLabel>
                    Actions
                    <span class="chart-label-note">— something the workflow does</span>
                </MenuLabel>
                <template v-for="entry in offeredActions" :key="`action:${entry.key}`">
                    <MenuItem :description="described(entry)" @click="add(entry)">
                        <span class="chart-glyph action" />
                        {{ entry.title }}
                    </MenuItem>
                </template>
            </MenuPanel>
        </template>

        <template v-if="details">
            <SidePanel :title="cardTitle(entryOf(details), details)" :abstract="KIND[details.kind]" @close="selected = null">
                <dl v-if="detailMain" class="chart-details">
                    <dt>{{ detailMain.label }}</dt>
                    <dd>{{ detailMain.words }}</dd>
                </dl>
                <details v-if="detailRest.length" class="chart-details-more">
                    <summary>More about this step</summary>
                    <dl class="chart-details">
                        <template v-for="line in detailRest" :key="line.label">
                            <dt>{{ line.label }}</dt>
                            <dd>{{ line.words }}</dd>
                        </template>
                    </dl>
                </details>
            </SidePanel>
        </template>
        <template v-if="editing">
            <SidePanel
                title="Message to the agent"
                :abstract="`${entryOf(editing).title}: what the journal says to the agent at this step`"
                @close="closeMessage"
            >
                <textarea
                    ref="messageBox"
                    class="chart-message"
                    :value="messageText"
                    rows="10"
                    placeholder="Message to the agent"
                    @input="messageText = $event.target.value"
                />
                <MenuLabel>Values you can insert</MenuLabel>
                <div class="chart-fillers">
                    <template v-for="filler in fillers" :key="filler.key">
                        <button type="button" class="chart-filler" @click="insertFiller(filler)">
                            <code>{{ filler.key }}</code>
                            <span>{{ filler.about }}</span>
                        </button>
                    </template>
                </div>
                <template #foot>
                    <span class="chart-grow" />
                    <Btn kind="primary" small @click="closeMessage">Done</Btn>
                </template>
            </SidePanel>
        </template>
        <template v-if="showLead">
            <Dialog title="How workflows work" fits @close="showLead = false">
                <p class="chart-dialog-text">{{ LEAD }}</p>
                <p class="chart-dialog-text">
                    A trigger is an event, such as the agent stopping. A check is a yes or no question the journal answers from what it
                    knows, and the flow goes on by the Yes or the No line. An action is what the journal does: send a message to the agent,
                    block its stop, block a tool, type into its terminal or start a sequence.
                </p>
                <p class="chart-dialog-text">
                    The page opens read-only; Edit switches editing on. Add step puts a step below the selected one and connects it. Drag
                    from a port onto another step to connect them, click a line to remove it, and drag a step to move it. Nothing changes
                    until you save. Turn off keeps a workflow's steps but stops it answering; Reset to default brings a default workflow
                    back; Delete removes one you made.
                </p>
                <template #foot>
                    <Btn kind="primary" @click="showLead = false">Close</Btn>
                </template>
            </Dialog>
        </template>
        <template v-if="confirming === 'reset'">
            <Dialog :title="`Reset ‘${title}’ to default?`" fits @close="confirming = ''">
                <p class="chart-dialog-text">Your changes to this workflow are lost. The other workflows stay as they are.</p>
                <template #foot>
                    <Btn @click="confirming = ''">Cancel</Btn>
                    <Btn kind="danger" :busy="busy === 'reset'" @click="reset">Reset to default</Btn>
                </template>
            </Dialog>
        </template>
        <template v-if="confirming === 'off'">
            <Dialog :title="`Turn ‘${title}’ off?`" fits @close="confirming = ''">
                <p class="chart-dialog-text">
                    The journal stops answering here; its steps are kept and Turn on brings them back. {{ parentWords }}
                </p>
                <template #foot>
                    <Btn @click="confirming = ''">Cancel</Btn>
                    <Btn kind="danger" :busy="busy === 'off'" @click="turnOff">Turn off</Btn>
                </template>
            </Dialog>
        </template>
        <template v-if="confirming === 'remove'">
            <Dialog :title="`Delete ‘${title}’?`" fits @close="confirming = ''">
                <p class="chart-dialog-text">The workflow and its steps are deleted. {{ parentWords || "Nothing is left here." }}</p>
                <template #foot>
                    <Btn @click="confirming = ''">Cancel</Btn>
                    <Btn kind="danger" :busy="busy === 'remove'" @click="removeWorkflow">Delete workflow</Btn>
                </template>
            </Dialog>
        </template>
        <template v-if="leaving">
            <Dialog title="Save your changes first?" fits @close="leaving = null">
                <p class="chart-dialog-text">You have {{ past.length }} unsaved {{ past.length === 1 ? "change" : "changes" }} here.</p>
                <template #foot>
                    <Btn @click="leaving = null">Keep editing</Btn>
                    <Btn kind="danger" @click="leaveAnyway">Leave without saving</Btn>
                    <Btn kind="primary" :busy="busy === 'save'" @click="save().then(() => !dirty && leaveAnyway())">Save</Btn>
                </template>
            </Dialog>
        </template>
        <template v-if="conflict && !unlocked">
            <Dialog title="Someone saved this workflow first" fits @close="conflict = null">
                <p class="chart-dialog-text">
                    {{ conflict.revised_by }} saved it {{ ago(conflict.revised_at) }}, so your changes were not saved.
                </p>
                <template #foot>
                    <Btn @click="conflict = null">Close</Btn>
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

.chart-grow {
    flex: 1;
}

.chart-unsaved {
    color: var(--text-3);
    font-size: 12px;
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
.chart-col {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 1px;
    padding: 12px 8px;
    overflow: auto;
    border-right: 1px solid var(--line);
}
.chart-list {
    width: 272px;
}
.chart-col-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding-right: 4px;
}
.chart-col-top .chart-col-head {
    margin: 0;
}
.chart-list-empty {
    margin: 8px 10px;
    color: var(--text-3);
    font-size: 12.5px;
}
.chart-item {
    align-items: center;
    gap: 10px;
    cursor: grab;
}
.chart-item[draggable="false"] {
    cursor: pointer;
}
.chart-item.dragging {
    opacity: 0.5;
}
.chart-item-lock,
.chart-node-waiting {
    position: absolute;
    top: -10px;
    right: 10px;
    padding: 1px 8px;
    border: 1px solid color-mix(in oklab, var(--accent) 50%, transparent);
    border-radius: 999px;
    color: var(--accent);
    background: var(--bg, #111215);
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
    white-space: nowrap;
}

.chart-node-count {
    min-width: 0;
    overflow: hidden;
    color: var(--text-2);
    font-size: 10.5px;
    letter-spacing: 0;
    text-transform: none;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.chart-node-lock {
    flex: none;
    color: var(--text-3);
}
.chart-node-stops {
    margin-left: 6px;
    padding: 0 5px;
    border-radius: 4px;
    background: color-mix(in srgb, var(--tone-warn) 16%, transparent);
    color: var(--tone-warn);
    font-size: 10px;
    line-height: 15px;
    text-transform: none;
    white-space: nowrap;
}
.chart-node-read {
    margin-left: auto;
    color: var(--accent);
    font-size: 10.5px;
    white-space: nowrap;
}
.chart-details {
    display: grid;
    grid-template-columns: 1fr;
    margin: 0;
    font-size: 13px;
}
.chart-details dt {
    color: var(--text-3);
    font-size: 12px;
    margin-bottom: 2px;
}
.chart-details dd {
    margin: 0 0 12px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
.chart-node.locked .chart-node-text:disabled {
    opacity: 0.8;
    cursor: not-allowed;
}
.chart-item-place {
    flex: none;
    width: 18px;
    color: var(--text-3);
    font-size: 11.5px;
    text-align: right;
}
.chart-item-words {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}
.chart-events {
    width: 268px;
    background: color-mix(in oklab, var(--bg-2) 60%, var(--bg));
}
.chart-col-head {
    margin: 0 0 8px;
    padding: 0 10px;
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}
.chart-row {
    display: flex;
    gap: 6px;
    width: 100%;
    padding: 8px 10px;
    border: 0;
    border-left: 2px solid transparent;
    border-radius: 7px;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}
.chart-row:hover {
    background: var(--hover);
}
.chart-row.on {
    border-left-color: var(--accent-text);
    background: var(--sel);
}
.chart-event {
    align-items: center;
    min-height: 32px;
    padding-top: 0;
    padding-bottom: 0;
}
.chart-event.none .chart-row-name {
    color: var(--text-3);
}
.chart-row-name {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 6px;
    min-width: 0;
    overflow: hidden;
    font-size: 13px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.chart-row-sub,
.chart-row-words {
    flex: none;
    color: var(--text-3);
    font-size: 11.5px;
}
.chart-row-bad {
    color: var(--danger-soft);
    font-size: 11.5px;
    font-weight: 400;
}
.chart-row-warn {
    color: var(--warn);
    font-size: 11.5px;
    font-weight: 400;
}
.chart-mark {
    position: relative;
    display: inline-block;
    flex: none;
    width: 10px;
    height: 10px;
}
.chart-mark::before,
.chart-mark::after {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
}
.chart-mark.default::before {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--text-2);
}
.chart-mark.yours::before {
    width: 6px;
    height: 6px;
    border-radius: 1px;
    background: var(--accent-text);
    transform: rotate(45deg);
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
.chart-add-event {
    margin-top: 8px;
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
.chart-warning {
    color: var(--warn);
    font-size: 12px;
}
.chart-faults {
    margin: 0;
    padding: 6px 16px;
    border-bottom: 1px solid var(--line);
    background: color-mix(in oklab, var(--danger) 8%, var(--bg));
    list-style: none;
}
.chart-fault {
    padding: 2px 0;
    border: 0;
    background: none;
    color: var(--danger-soft);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}
.chart-fault:disabled {
    cursor: default;
}
.chart-runs {
    margin: 0;
    padding: 0;
    list-style: none;
}
.chart-runs li + li {
    border-top: 1px solid var(--line);
}
.chart-run {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
    padding: 8px 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}
.chart-run:hover .chart-run-title {
    color: var(--accent-text);
}
.chart-run-when {
    color: var(--text-3);
    font-size: 11.5px;
}
.chart-run-title {
    font-size: 13px;
    font-weight: 500;
}
.chart-run-said {
    display: -webkit-box;
    overflow: hidden;
    color: var(--text-2);
    font-size: 12px;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
}
.chart-runs-empty {
    margin: 0;
    color: var(--text-3);
}
.chart-node.end {
    border-bottom-width: 3px;
    border-bottom-color: var(--text-3);
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

.chart-message {
    width: 100%;
    margin: 0 0 16px;
    padding: 10px 12px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg-2);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    line-height: 1.5;
    resize: vertical;
}

.chart-message:focus {
    border-color: var(--accent);
    outline: none;
}

.chart-fillers {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.chart-filler {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 8px;
    border: 1px solid transparent;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.chart-filler:hover {
    border-color: var(--border-2);
    background: var(--hover);
    color: var(--text);
}

.chart-filler code {
    flex: none;
    color: var(--accent-text);
    font-family: var(--mono);
    font-size: 12px;
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

.chart-node {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 7px 12px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    cursor: grab;
}

.chart-node.selected,
.chart-node.target {
    border-color: var(--border-3);
    background: var(--hover);
}

.chart-node-kind {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 14px;
    color: var(--text-3);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.chart-node-x {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin: -3px -6px 0 auto;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.chart-node-x:hover {
    background: var(--hover);
    color: var(--text);
}

.chart-node-title {
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
    line-height: 18px;
    overflow-wrap: anywhere;
}

.chart-details-more {
    margin-top: 12px;
}

.chart-details-more > summary {
    color: var(--text-2);
    font-size: 12.5px;
    cursor: pointer;
}

.chart-node-note {
    color: var(--text-3);
    font-size: 11px;
    line-height: 16px;
}

.chart-node-text {
    width: 100%;
    margin-top: 5px;
    padding: 5px 8px;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg-2);
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    line-height: 16px;
    outline: none;
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: text;
}

button.chart-node-text {
    white-space: normal;
}

.chart-node-text.empty {
    color: var(--text-4);
}

button.chart-node-text:hover {
    border-color: var(--border-3);
    color: var(--text);
}

.chart-node-text::placeholder {
    color: var(--text-4);
}

.chart-node-text:focus {
    border-color: var(--accent);
    color: var(--text);
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

.chart-in,
.chart-port {
    position: absolute;
    width: 12px;
    height: 12px;
    margin-left: -6px;
    border: 1.5px solid var(--border-3);
    border-radius: 50%;
    background: var(--bg-2);
}

.chart-in {
    top: -6.5px;
    left: 50%;
}

.chart-in.ready {
    top: -8.5px;
    width: 16px;
    height: 16px;
    margin-left: -8px;
    border-color: var(--accent-text);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent);
}

.chart-port {
    bottom: -6.5px;
    cursor: crosshair;
    --c: var(--text-3);
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

.chart-port.hover {
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: -9.5px;
    width: 18px;
    height: 18px;
    margin-left: -9px;
    border-color: var(--accent-text);
    background: var(--raised);
    color: var(--accent-text);
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

.chart-port-word {
    position: absolute;
    top: calc(100% + 6px);
    color: var(--text-4);
    font-size: 10.5px;
    line-height: 1;
    pointer-events: none;
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

.chart-empty {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.chart-empty-add {
    margin-top: 10px;
}

.chart-hint {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    top: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 24px;
    text-align: center;
    pointer-events: none;
}

.chart-hint :deep(.btn) {
    pointer-events: auto;
}

.chart-hint-title {
    margin: 0;
    color: var(--text-2);
    font-size: 14px;
    font-weight: 500;
}

.chart-hint-text {
    max-width: 300px;
    margin: 0 0 6px;
    color: var(--text-4);
    font-size: 12.5px;
    line-height: 1.5;
}

.chart-search {
    margin: 2px 2px 6px;
}

.chart-landing {
    margin: 0 2px 4px;
    padding: 6px 8px;
    border-radius: 6px;
    background: var(--bg-2);
    color: var(--text-3);
    font-size: 11.5px;
}

.chart-menu-about {
    margin: 0;
    padding: 0 8px 4px;
    color: var(--text-4);
    font-size: 11.5px;
}

.chart :deep(.menu-item) .chart-glyph {
    margin-right: 8px;
}

.chart-label-note {
    font-weight: 400;
    letter-spacing: 0;
    text-transform: none;
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
