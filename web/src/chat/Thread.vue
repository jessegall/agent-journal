<script setup>
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {act, create} from "../api.js";
import Icon from "../kit/Icon.vue";
import {route} from "../route.js";
import {agent, meta, quoted, reload, rows, store, withQuote} from "../store.js";
import Compose from "./Compose.vue";
import Turn from "./Turn.vue";

const IDLE = 10000;
const scroller = ref(null);
const quote = ref({text: "", ref: ""});
const editing = ref(null);
const chatOnly = new URLSearchParams(location.search).has("chat");
const pageTools = chatOnly
    ? [
          {icon: "crosshair", title: "Point at an element on the page", go: () => point("point")},
          {icon: "camera", title: "Send a picture of an element on the page", go: () => point("shot")},
      ]
    : [];
const composeTools = [
    {icon: "pins", title: "Pin this text over the chat", text: true, consume: true, go: (text) => pin(text)},
    ...pageTools,
];

function point(kind) {
    window.postMessage({source: "journal-page", kind}, window.location.origin);
}
const mine = computed(() => rows("message").filter((m) => !m.deleted && m.seen[0] === "user" && !m.seen.includes("agent")));

function editLast() {
    const last = mine.value[mine.value.length - 1];
    if (last) editing.value = {n: last.n, text: quoted(last.brief).text};
}

function unedit() {
    editing.value = null;
}
const busy = computed(() => !!agent.value && ["working", "compacting"].includes(agent.value.data.status));
const away = ref(false);
const missed = ref(0);
const settledOnce = ref(false);
const ready = ref(false);
const SKELETON = [
    {key: "a", lines: 3},
    {key: "b", lines: 1},
    {key: "c", lines: 2},
    {key: "d", lines: 4},
    {key: "e", lines: 2},
];

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
const acknowledged = (m) =>
    rows("comment").some((c) => !c.deleted && c.refs.includes(m.ref) && c.seen[0] === "agent") ||
    rows("reaction").some((r) => !r.deleted && r.refs.includes(m.ref) && r.seen[0] === "agent");
const filed = (m) => m.refs.filter((r) => !r.startsWith("message:") && meta(r.split(":")[0]));
const receipt = (m) => ({
    ref: `receipt:${m.n}`,
    type: "receipt",
    n: m.n,
    who: "agent",
    created: m.updated + 0.001,
    seen: ["agent"],
    refs: filed(m),
    data: {},
    sections: [],
    title: filed(m).length
        ? `Filed ${filed(m)
              .map((r) => `${meta(r.split(":")[0]).title.toLowerCase()} ${r.split(":")[1]}`)
              .join(", ")} from your message.`
        : "Noted.",
    brief: "",
});
const turns = computed(() =>
    [
        ...rows("message")
            .filter((m) => !m.deleted && !pending.value.some((p) => promisedFor(p, m) && !delivered(p, m)))
            .map((m) => ({...m, who: m.seen[0]})),
        ...rows("message")
            .filter((m) => !m.deleted && m.seen[0] === "user" && m.completed && !acknowledged(m))
            .map(receipt),
        ...rows("comment")
            .filter((c) => !c.deleted && c.refs.some((r) => r.startsWith("message:")))
            .map((c) => ({...c, who: c.seen[0]})),
        ...rows("question")
            .filter((q) => !q.deleted)
            .map((q) => ({...q, who: "agent"})),
        ...pending.value.filter(
            (p) =>
                !rows("message").some(
                    (m) =>
                        !m.deleted &&
                        m.brief === p.brief &&
                        m.created >= p.created - 5 &&
                        Object.keys(m.data.files || {}).length >= Object.keys(p.data.files).length
                )
        ),
    ].sort((a, b) => a.created - b.created)
);

function toBottom() {
    if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight;
    away.value = false;
    missed.value = 0;
}

function settled() {
    if (!stillReading() && !away.value) toBottom();
}

onMounted(() => {
    const grew = new ResizeObserver(settled);
    for (const el of scroller.value.children) grew.observe(el);
    new MutationObserver(() => {
        for (const el of scroller.value.children) grew.observe(el);
    }).observe(scroller.value, {childList: true});
});

function watchScroll() {
    const s = scroller.value;
    away.value = s.scrollHeight - s.scrollTop - s.clientHeight > 40;
}

function stillReading() {
    return away.value && reading.value.inside && Date.now() - reading.value.moved < IDLE;
}

async function post(text, files) {
    if (editing.value) {
        await act(route.value.env, "message", editing.value.n, "edit", {text});
        editing.value = null;
        return;
    }
    const body = withQuote(quote.value.text, text);
    const about = quote.value.ref || undefined;
    quote.value = {text: "", ref: ""};
    const placeholder = await promised(body, files);
    await nextTick();
    toBottom();
    try {
        const message = await create(route.value.env, "message", {title: titled(body), brief: body, about});
        for (const f of files) await upload(message.n, f);
        await reload();
    } finally {
        pending.value = pending.value.filter((p) => p !== placeholder);
        Object.values(placeholder.data.previews).forEach(URL.revokeObjectURL);
    }
    await nextTick();
    toBottom();
}

const borrowed = new Map();

function promisedFor(p, m) {
    const yes = m.brief === p.brief && m.created >= p.created - 5;
    if (yes) borrowed.set(m.ref, p.ref);
    return yes;
}

function keyOf(t) {
    return borrowed.get(t.ref) || t.ref;
}

function delivered(p, m) {
    return Object.keys(m.data.files || {}).length >= Object.keys(p.data.files).length;
}

function measured(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve([img.naturalWidth, img.naturalHeight]);
        img.onerror = () => resolve(null);
        img.src = url;
    });
}

const pending = ref([]);
let promises = 0;

async function promised(body, files) {
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
        title: titled(body),
        brief: body,
        abstract: "",
        refs: [],
        seen: ["user"],
        sections: [],
        data: {files: Object.fromEntries(files.map((f) => [f.name, ""])), previews, pictures},
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

function titled(text) {
    const line = text.split("\n").find((part) => part.trim() && !part.startsWith(">")) || text;
    return line.replace(/:/g, " -").replace(/\s+/g, " ").trim().slice(0, 80);
}

async function pin(text, about = "") {
    await create(route.value.env, "notice", {title: titled(text), about: about || undefined});
}

async function upload(n, file) {
    const body = new FormData();
    body.append("file", file, file.name);
    const res = await fetch(`/api/${route.value.env}/message/${n}/upload`, {method: "POST", body});
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
}

watch(busy, async () => {
    await nextTick();
    if (!stillReading()) toBottom();
});

watch(
    () => (store.booted ? turns.value.length : -1),
    async (n, before) => {
        await nextTick();
        if (!ready.value) {
            if (n < 0) return;
            await loaded();
            ready.value = true;
            await nextTick();
        }
        if (stillReading()) missed.value += Math.max(0, n - (before || 0));
        else toBottom();
        if (n && !settledOnce.value) setTimeout(() => (settledOnce.value = true), 300);
    },
    {immediate: true}
);
</script>

<template>
    <div class="thread">
        <div class="thread-write">
            <Transition name="rise">
                <button
                    v-if="away"
                    type="button"
                    class="thread-down"
                    :title="missed ? `${missed} arrived while you were reading` : 'Back to the newest'"
                    @click="toBottom"
                >
                    <Icon name="down" />
                    {{ missed ? `${missed} new` : "Newest" }}
                </button>
            </Transition>
            <template v-if="editing">
                <div class="thread-answering">
                    <span class="thread-answering-label">Editing</span>
                    <span class="thread-answering-text">{{ editing.text }}</span>
                    <button type="button" class="thread-answering-x" title="Leave it as it was" @click="unedit">×</button>
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
            />
        </div>
        <template v-if="!ready">
            <div class="thread-skeleton">
                <template v-for="(blank, i) in SKELETON" :key="blank.key">
                    <div :class="['thread-turn', 'waiting', {mine: i % 2}]">
                        <div class="thread-bubble">
                            <template v-for="k in blank.lines" :key="k">
                                <span class="thread-blank" />
                            </template>
                        </div>
                    </div>
                </template>
            </div>
        </template>
        <div
            ref="scroller"
            :class="['thread-scroll', {focusing: store.focus, loading: !ready}]"
            @scroll.passive="watchScroll"
            @mouseenter="reading.inside = true"
            @mouseleave="reading.inside = false"
            @mousemove="reading.moved = Date.now()"
        >
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
            <Transition name="rise">
                <div v-if="busy" class="thread-turn busy" aria-label="The agent is working">
                    <div class="thread-bubble">
                        <span class="thread-dot" />
                        <span class="thread-dot" />
                        <span class="thread-dot" />
                    </div>
                    <div class="thread-meta"><span>working</span></div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
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

.thread-skeleton {
    order: 1;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 7px;
    padding: 14px 8px 12px;
    overflow: hidden;
}

.thread-turn.waiting {
    display: flex;
    flex-direction: column;
    width: 60%;
    max-width: 88%;
}

.thread-turn.waiting.mine {
    align-self: flex-end;
}

.thread-turn.waiting .thread-bubble {
    display: flex;
    flex-direction: column;
    gap: 7px;
    width: 100%;
    padding: 12px;
    border: 1px solid transparent;
    border-radius: 9px;
    background: color-mix(in srgb, var(--raised) 55%, transparent);
    animation: thread-wait 1.6s ease-in-out infinite;
}

.thread-blank {
    display: block;
    width: 100%;
    height: 9px;
    border-radius: 99px;
    background: color-mix(in srgb, var(--text-3) 22%, transparent);
}

.thread-turn.waiting .thread-bubble .thread-blank:not(:only-child):last-child {
    width: 62%;
    opacity: 0.6;
}

@keyframes thread-wait {
    0%,
    100% {
        opacity: 0.45;
    }

    50% {
        opacity: 0.8;
    }
}

.thread-turn.busy {
    display: flex;
    flex-direction: column;
    gap: 3px;
    max-width: max-content;
}

.thread-turn.busy .thread-bubble {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 10px 12px;
    border: 1px solid #232529;
    border-radius: 9px;
    background: #161719;
}

.thread-turn.busy .thread-meta {
    padding: 0 3px;
    font-size: 11px;
    color: var(--text-3);
}

.thread-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--text-3);
    animation: thread-dot 1.3s ease-in-out infinite;
}

.thread-dot:nth-child(2) {
    animation-delay: 0.18s;
}

.thread-dot:nth-child(3) {
    animation-delay: 0.36s;
}

@keyframes thread-dot {
    0%,
    60%,
    100% {
        opacity: 0.35;
        transform: none;
    }

    30% {
        opacity: 1;
        transform: translateY(-2px);
    }
}

.thread-scroll.loading {
    position: absolute;
    visibility: hidden;
    inset: 0;
}

.thread-scroll {
    order: 1;
    flex: 1;
    min-height: 0;
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

.thread-write :deep(.compose-box) {
    margin-right: 2px;
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
