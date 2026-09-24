<script setup>
import Dot from "../kit/Dot.vue";
import RunningCommand from "./RunningCommand.vue";
import {keepingPlace, useSighted} from "../composables/scrollback.js";
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import {markSeen} from "../sync/seen.js";
import {sendMessage, token} from "./outbox.js";
import Icon from "../kit/Icon.vue";
import {route} from "../route.js";
import {quoted, withQuote} from "../format/quote.js";
import {chatOnly, laidOut} from "../platform/view.js";
import {threadTurns} from "../domain/thread.js";
import {agent, feedOn, store} from "../state/store.js";
import {cardPlan, waitsFor} from "../layout/statusline.js";
import {polled} from "../sync/polled.js";
import {earlier, paging, rows} from "../sync/rows.js";
import DumpWindow from "./DumpWindow.vue";
import TerminalWindow from "./TerminalWindow.vue";
import UpdateOverlay from "./UpdateOverlay.vue";
import {updateView} from "./updateView.js";
import FileFeed from "./FileFeed.vue";
import Compose from "./Compose.vue";
import Turn from "./Turn.vue";
import PlanCard from "./PlanCard.vue";
import ThreadSkeleton from "./ThreadSkeleton.vue";
import {usePoll} from "../poll.js";
import {tellExtension} from "../platform/extension.js";
import {flash} from "../platform/visibility.js";

usePoll(...polled.agents);

const IDLE = 30000;
const scroller = ref(null);
const props = defineProps({view: {type: String, default: ""}});
const pane = computed(() => props.view || store.pane);
const threadRoot = ref(null);
const dumpHere = computed(() => store.dumping && !props.view);
const terminalOpen = computed(() => pane.value === "terminal" && !dumpHere.value);
const chatOpen = computed(() => pane.value !== "terminal" && !dumpHere.value);
const feeding = computed(() => pane.value === "feed" && feedOn.value && Boolean(agent.value));
const feedKey = computed(() => (agent.value ? `${agent.value.n}:${agent.value.data.transcript}` : ""));
const quote = ref({text: "", ref: ""});
const editing = ref(null);
const pageTools = chatOnly
    ? [
          {icon: "crosshair", title: "Point at an element on the page", go: () => point("point")},
          {icon: "camera", title: "Send a picture of an element on the page", go: () => point("shot")},
      ]
    : [];
const dumps = computed(() => rows("dump").filter((d) => !d.deleted));
const dumpFiling = computed(() => dumps.value.filter((d) => !d.completed).sort((a, b) => a.n - b.n)[0] || null);

function openDump(n = 0) {
    store.pane = "chat";
    store.dumpShown = n;
    store.dumping = true;
}

const composeTools = pageTools;
const dumpIdle = computed(() => ({
    icon: "inbox",
    label: dumpFiling.value ? `Dump ${dumpFiling.value.n} · filing` : "Dump files",
    title: "Throw in a pile of files and notes: the agent sorts them by subject and files them into a collection",
    go: () => openDump(dumpFiling.value?.n || 0),
}));
const dumpOffer = {
    icon: "inbox",
    title: (n) => `${n} files. Dump them instead?`,
    text: "The dump reads them together and files each subject as its own document with a proper name, in a new collection you can remove in one step.",
    action: "Dump them",
    take: (files) => {
        store.dumpFiles = files;
        openDump(0);
    },
};

function point(kind) {
    tellExtension(kind);
}
const mine = computed(() => rows("message").filter((m) => !m.deleted && m.seen[0] === "user" && !m.seen.includes("agent")));

function editLast() {
    const last = mine.value[mine.value.length - 1];
    if (last) editing.value = {n: last.n, ...quoted(last.brief)};
}

function unedit() {
    editing.value = null;
}
const busy = computed(() => !!agent.value && ["working", "compacting"].includes(agent.value.data.status));
const waiting = computed(() => waitsFor(rows("work")));
const planCard = computed(() => cardPlan(rows("plan")));
const thought = computed(() => (agent.value && agent.value.data.thinking) || "");
const helping = computed(() => ((agent.value && agent.value.data.subagent_rows) || []).filter((sub) => sub.running).at(-1));
const activity = computed(() =>
    agent.value && agent.value.data.status === "compacting" ? "compacting" : helping.value ? `subagent: ${helping.value.task}` : "working"
);
const away = ref(false);
const planOpen = ref(true);
let lastTop = 0;
let planTimer = 0;
const PLAN_SETTLE = 180;
const PLAN_MOVE = 500;
const NEWEST_AFTER = 1000;
const NEWEST_AFTER_BOTTOM = 2000;
const newestShown = ref(false);
let newestTimer = 0;
let leftBottomAt = 0;
const short = ref(false);
const SHORT_CHAT = 420;
const sizeWatch = new ResizeObserver(([entry]) => (short.value = entry.contentRect.height < SHORT_CHAT));
const AT_BOTTOM = 2;
const FOLD_AT = 8;
const FOLDED_PLAN = 32;
const missed = ref(0);
const settledOnce = ref(false);
const ready = ref(false);
const unseen = computed(() =>
    rows("message")
        .filter((m) => !m.deleted && m.seen[0] === "agent" && !m.seen.includes("user"))
        .map((m) => m.n)
);

watch([unseen, ready], ([numbers, isReady]) => isReady && markSeen("message", numbers), {immediate: true});
const rendering = ref(false);
const topMark = ref(null);
const AHEAD = "200px 0px 0px 0px";
const scrolledUp = ref(false);
const NEAR_TOP = 200;
const GLIDE = 450;
let prepending = false;

async function older() {
    const s = scroller.value;
    if (!ready.value || !settledOnce.value || !scrolledUp.value || prepending || !s) return;
    prepending = true;
    try {
        await keepingPlace(scroller, () => earlier("message", "comment"));
    } finally {
        prepending = false;
    }
}
let frame = 0;

function pictured() {
    return [...(scroller.value ? scroller.value.querySelectorAll("img") : [])].filter((img) => !img.complete);
}

async function loaded() {
    const pending = pictured();
    if (!pending.length) return;
    await Promise.race([
        Promise.all(
            pending.map(
                (img) =>
                    new Promise(
                        (done) => img.addEventListener("load", done, {once: true}) || img.addEventListener("error", done, {once: true})
                    )
            )
        ),
        new Promise((done) => setTimeout(done, 4000)),
    ]);
}
const reading = ref({inside: false, moved: 0});
const pending = ref([]);
const linked = new Map();
const boardRequests = computed(
    () =>
        new Set(
            rows("message")
                .filter((m) => m.data.new_work)
                .map((m) => m.ref)
        )
);
const thread = computed(() => {
    const made = threadTurns(
        {
            message: rows("message").filter((m) => !boardRequests.value.has(m.ref)),
            comment: rows("comment").filter((c) => !c.refs.some((ref) => boardRequests.value.has(ref))),
            question: rows("question"),
            reaction: rows("reaction"),
            doc: rows("doc"),
            agent: store.agents,
        },
        pending.value,
        route.value.env,
        !!paging.more.message
    );
    made.keys.forEach((placeholder, ref) => linked.set(ref, placeholder));
    return made;
});
const turns = computed(() => thread.value.turns);
watch(turns, (list) => {
    const listed = new Set(list.map((t) => t.ref));
    const replaced = pending.value.filter((p) => !listed.has(p.ref));
    if (!replaced.length) return;
    replaced.forEach((p) => Object.values(p.data.previews).forEach(URL.revokeObjectURL));
    pending.value = pending.value.filter((p) => listed.has(p.ref));
});

let glidedAt = 0;

function toBottom(smooth = false) {
    const s = scroller.value;
    if (s && smooth) {
        glidedAt = Date.now();
        s.scrollTo({top: s.scrollHeight, behavior: "smooth"});
    } else if (s) {
        s.scrollTop = s.scrollHeight;
    }
    away.value = false;
    missed.value = 0;
}

watch(
    () => flash.at,
    () => nextTick(() => toBottom(settledOnce.value))
);

watch(
    () => dumpHere.value || pane.value === "terminal",
    (away) => {
        if (!away) nextTick(() => requestAnimationFrame(() => toBottom()));
    }
);

function settled() {
    if (!stillReading() && !away.value && !store.focus) toBottom(settledOnce.value);
}

let grew = null;
let added = null;

onMounted(() => {
    grew = new ResizeObserver(settled);
    const watchRows = () => {
        for (const el of scroller.value?.children || []) grew.observe(el);
    };
    watchRows();
    added = new MutationObserver(watchRows);
    if (scroller.value) added.observe(scroller.value, {childList: true});
    if (scroller.value) sizeWatch.observe(scroller.value);
    frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => (rendering.value = true));
    });
});

useSighted(topMark, older, {root: scroller, margin: AHEAD});

onUnmounted(() => {
    grew?.disconnect();
    added?.disconnect();
    sizeWatch.disconnect();
    clearTimeout(planTimer);
    clearTimeout(newestTimer);
    cancelAnimationFrame(frame);
    clearTimeout(idleTimer);
});

let scrolledAt = 0;
const BY_HAND = 600;

function scrolledByHand() {
    scrolledAt = Date.now();
}

function wheeled(e) {
    markActive();
    scrolledByHand();
    const s = scroller.value;
    if (e.deltaY > 0 && s && s.scrollHeight - s.scrollTop - s.clientHeight <= AT_BOTTOM) settlePlan(true);
}

function followPlan(s) {
    const gap = s.scrollHeight - s.scrollTop - s.clientHeight;
    const down = s.scrollTop > lastTop;
    lastTop = s.scrollTop;
    if (gap <= AT_BOTTOM && down) settlePlan(true);
    else if (gap > foldingRoom(s)) settlePlan(false);
    return gap;
}

function foldingRoom(s) {
    const dock = s.querySelector(".plan-dock");
    return planOpen.value && dock ? Math.max(FOLD_AT, dock.offsetHeight - FOLDED_PLAN) : FOLD_AT;
}

function settlePlan(open) {
    clearTimeout(planTimer);
    if (open) planOpen.value = true;
    else planTimer = setTimeout(() => (planOpen.value = false), PLAN_SETTLE);
}

watch(planOpen, (open) => open && holdBottom());

watch(away, (now) => {
    clearTimeout(newestTimer);
    if (!now) {
        newestShown.value = false;
        leftBottomAt = Date.now();
        return;
    }
    const wait = Date.now() - leftBottomAt < NEWEST_AFTER_BOTTOM ? NEWEST_AFTER_BOTTOM : NEWEST_AFTER;
    newestTimer = setTimeout(() => (newestShown.value = away.value), wait);
});

function holdBottom() {
    const s = scroller.value;
    const dock = s?.querySelector(".plan-dock");
    if (!dock) return;
    const pin = new ResizeObserver(() => planOpen.value && (s.scrollTop = s.scrollHeight));
    pin.observe(dock);
    setTimeout(() => pin.disconnect(), PLAN_MOVE);
}

function watchScroll() {
    const s = scroller.value;
    if (!s) return;
    const gap = followPlan(s);
    if (Date.now() - glidedAt < GLIDE) return;
    const far = gap > 40;
    if (far && !away.value && !store.focus && Date.now() - scrolledAt > BY_HAND) {
        toBottom();
        return;
    }
    away.value = far;
    if (settledOnce.value && away.value) scrolledUp.value = true;
    if (scrolledUp.value && s.scrollTop < NEAR_TOP) older();
}

function stillReading() {
    return away.value && reading.value.inside && Date.now() - reading.value.moved < IDLE;
}

let idleTimer = 0;
function markActive() {
    reading.value.moved = Date.now();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => away.value && reading.value.inside && toBottom(), IDLE);
}

async function post(text, files) {
    if (editing.value) {
        await api.act("message", editing.value.n, "edit", {text: withQuote(editing.value.quote, text)});
        editing.value = null;
        return;
    }
    const body = withQuote(quote.value.text, text);
    const about = quote.value.ref || undefined;
    quote.value = {text: "", ref: ""};
    const id = token();
    const placeholder = await promised(body, files, id);
    await nextTick();
    toBottom(true);
    try {
        await sendMessage(route.value.env, {brief: body, about}, files, id);
    } catch (e) {
        pending.value = pending.value.filter((p) => p.ref !== placeholder.ref);
        Object.values(placeholder.data.previews).forEach(URL.revokeObjectURL);
        throw e;
    }
    await nextTick();
    toBottom(true);
}

function keyOf(t) {
    return linked.get(t.ref) || t.ref;
}

function measured(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve([img.naturalWidth, img.naturalHeight]);
        img.onerror = () => resolve(null);
        img.src = url;
    });
}

let promises = 0;

async function promised(body, files, idempotency) {
    promises += 1;
    const previews = Object.fromEntries(files.map((f) => [f.name, URL.createObjectURL(f)]));
    const pictures = {};
    for (const f of files) {
        const size = f.type.startsWith("image/") ? await measured(previews[f.name]) : null;
        if (size) pictures[f.name] = size;
    }
    const turn = {
        ref: `pending:${promises}`,
        type: "message",
        n: 0,
        title: "",
        brief: body,
        abstract: "",
        refs: [],
        seen: ["user"],
        sections: [],
        data: {files: Object.fromEntries(files.map((f) => [f.name, ""])), previews, pictures, idempotency},
        created: Date.now() / 1000,
        updated: 0,
        deleted: 0,
        completed: 0,
        who: "user",
        pending: true,
    };
    pending.value = [...pending.value, turn];
    return turn;
}

async function pin(text, about = "") {
    await api.create("notice", {brief: text, about: about || undefined});
}

watch(busy, async () => {
    await nextTick();
    if (!stillReading()) toBottom(settledOnce.value);
});

watch(
    () => (store.booted && rendering.value ? turns.value.length : -1),
    async (n, before) => {
        await nextTick();
        if (!ready.value) {
            if (n < 0) return;
            await loaded();
            ready.value = true;
            await nextTick();
            laidOut.value += 1;
        }
        if (prepending) return;
        if (stillReading()) missed.value += Math.max(0, n - (before || 0));
        else toBottom(settledOnce.value);
        if (n && !settledOnce.value) setTimeout(() => (settledOnce.value = true), 300);
    },
    {immediate: true}
);
</script>

<template>
    <div ref="threadRoot" class="thread">
        <Transition name="dump">
            <DumpWindow v-if="dumpHere" />
        </Transition>
        <Transition name="terminal">
            <TerminalWindow v-if="terminalOpen" />
        </Transition>
        <template v-if="updateView.n && threadRoot?.contains(updateView.from)">
            <UpdateOverlay :key="updateView.n" />
        </template>
        <template v-if="chatOpen">
            <div :class="['thread-write', {hidden: feeding}]">
                <Transition name="rise">
                    <button
                        v-if="away && newestShown"
                        type="button"
                        :class="['thread-down', {'over-plan': planCard}]"
                        :title="missed ? `${missed} arrived while you were reading` : 'Back to the newest'"
                        @click="toBottom"
                    >
                        <Icon name="down" />
                        {{ missed ? `${missed} new` : "Newest" }}
                    </button>
                </Transition>
                <template v-if="editing">
                    <div class="thread-answering">
                        <span class="thread-answering-label">Editing message {{ editing.n }}</span>
                        <span class="thread-answering-text">{{ editing.text }}</span>
                        <button type="button" class="thread-answering-x" title="Leave it as it was (Esc)" @click="unedit">×</button>
                    </div>
                </template>
                <Compose
                    :send="post"
                    :quote="quote.text"
                    quote-label="Replying to"
                    @unquote="quote = {text: '', ref: ''}"
                    :preset="editing ? editing.text : ''"
                    :up="editLast"
                    :down="unedit"
                    :tools="composeTools"
                    :many="dumpOffer"
                    :idle="dumpIdle"
                />
            </div>
            <template v-if="!ready">
                <ThreadSkeleton />
            </template>
            <div class="thread-views">
                <div
                    ref="scroller"
                    :class="['thread-scroll', {focusing: store.focus, loading: !ready, hidden: feeding}]"
                    @scroll.passive="watchScroll"
                    @mouseenter="(reading.inside = true) && markActive()"
                    @mouseleave="reading.inside = false"
                    @mousemove="markActive"
                    @wheel.passive="wheeled"
                    @touchmove.passive="scrolledByHand"
                    @keydown="scrolledByHand"
                    @pointerdown="scrolledByHand"
                >
                    <template v-if="rendering">
                        <div ref="topMark" class="thread-top" />
                        <template v-if="!turns.length">
                            <p class="thread-empty">Nothing has been said here yet.</p>
                        </template>
                        <TransitionGroup :name="settledOnce ? 'turn' : ''">
                            <Turn
                                v-for="t in turns"
                                :key="keyOf(t)"
                                :turn="t"
                                @reply="quote = $event"
                                @edit="editing = $event"
                                @pin="pin($event.text, $event.ref)"
                                @grew="settled"
                            />
                        </TransitionGroup>
                        <Transition name="plancard">
                            <PlanCard v-if="planCard" :key="planCard.n" :plan="planCard" :folded="short || !planOpen" />
                        </Transition>
                        <Transition name="status">
                            <div
                                v-if="busy || waiting"
                                class="thread-turn busy"
                                :aria-label="waiting ? `The agent is waiting ${waiting}` : `The agent is ${activity}`"
                            >
                                <div class="thread-meta">
                                    <Dot kind="started" solid :size="6" />
                                    <template v-if="waiting">
                                        <span>Waiting {{ waiting }}</span>
                                    </template>
                                    <template v-else-if="thought">
                                        <span>thinking</span>
                                        <span class="thread-meta-on thought">{{ thought }}</span>
                                    </template>
                                    <template v-else>
                                        <RunningCommand :idle="activity" />
                                    </template>
                                </div>
                            </div>
                        </Transition>
                    </template>
                </div>
                <Transition name="pane">
                    <template v-if="feeding">
                        <FileFeed :key="feedKey" :agent="agent.n" />
                    </template>
                </Transition>
            </div>
        </template>
    </div>
</template>

<style scoped>
.terminal-enter-active,
.terminal-leave-active {
    transition:
        transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 0.18s ease;
}

.terminal-leave-active {
    position: absolute;
    inset: 0;
}

.terminal-enter-from,
.terminal-leave-to {
    opacity: 0;
    transform: translateY(14px);
}

.turn-enter-active {
    transition:
        opacity 0.26s ease-out,
        transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.turn-enter-from {
    opacity: 0;
    transform: translateY(9px);
}

.turn-leave-active {
    position: absolute;
    transition: opacity 0.16s ease-in;
}

.turn-leave-to {
    opacity: 0;
}

.turn-move {
    transition: transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.thread {
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.thread-turn.busy {
    display: flex;
    flex-direction: column;
    gap: 3px;
    align-self: stretch;
    width: 100%;
}

.thread-turn.busy .thread-bubble {
    display: flex;
    align-self: flex-start;
    align-items: center;
    gap: 4px;
    padding: 10px 12px;
    border: 1px solid #232529;
    border-radius: 9px;
    background: #161719;
}

.thread-turn.busy {
    --tone: var(--accent);
    translate: 0 6px;
}

.thread-turn.busy .thread-meta {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
    white-space: nowrap;
    padding: 0 3px;
    font-size: 11px;
    color: var(--text-3);
}

.thread-meta-on.thought {
    font-family: inherit;
    font-style: italic;
}

.thread-meta-on {
    min-width: 0;
    overflow: hidden;
    margin-left: 6px;
    color: var(--text-4);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 10.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.thread-scroll.loading {
    position: absolute;
    visibility: hidden;
    inset: 0;
}

.thread-views {
    position: relative;
    order: 1;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.thread-scroll {
    order: 1;
    flex: 1;
    min-height: 0;
    transition:
        opacity 0.18s,
        visibility 0s;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 7px;
    padding: 14px 8px 12px;
}

.thread-scroll:has(.thread-turn:hover) :deep(.thread-turn:not(:hover) .thread-bubble) {
    opacity: 0.82;
}

.thread-scroll.focusing :deep(.thread-turn:not(.lit)) {
    opacity: 0.35;
    filter: blur(0.6px);
    transition:
        opacity 0.25s ease,
        filter 0.25s ease;
}

.thread-scroll.hidden {
    visibility: hidden;
    opacity: 0;
    transition:
        opacity 0.18s,
        visibility 0s 0.18s;
}

.pane-enter-active,
.pane-leave-active {
    transition: opacity 0.18s;
}

.pane-enter-from,
.pane-leave-to {
    opacity: 0;
}

.thread-write {
    order: 3;
    position: relative;
    flex: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0 calc(-1 * var(--home-gutter));
    padding: 8px var(--home-gutter) 12px;
}

.thread-write.hidden {
    display: none;
}

.thread-write :deep(.compose-box) {
    margin-right: 2px;
}

.status-enter-active {
    transition:
        opacity 0.22s ease-out,
        transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.status-leave-active {
    transition:
        opacity 0.16s ease-in,
        transform 0.16s ease-in;
}

.status-enter-from,
.status-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

.rise-enter-active {
    transition:
        opacity 0.22s ease-out,
        transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.rise-leave-active {
    transition:
        opacity 0.16s ease-in,
        transform 0.16s ease-in;
}

.rise-enter-from,
.rise-leave-to {
    opacity: 0;
    transform: translate(-50%, 8px);
}

.thread-down {
    position: absolute;
    bottom: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 11px;
    border: 1px solid var(--text);
    border-radius: 99px;
    background: var(--text);
    color: #0d0e10;
    font-size: 11.5px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
}

.thread-down.over-plan {
    bottom: calc(100% + 62px);
}

.thread-down:hover {
    background: #fff;
    border-color: #fff;
    color: #000;
}

.thread-down .ico {
    width: 13px;
    height: 13px;
    stroke-width: 2.1;
    color: inherit;
}

.thread-answering {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
    font-size: 12px;
}

.thread-answering-label {
    flex: none;
    color: var(--accent-text);
}

.thread-answering-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-3);
}

.thread-answering-x {
    border: 0;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.thread-empty {
    padding: 18px 2px;
    color: var(--text-3);
}
</style>
