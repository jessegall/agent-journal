<script setup>
import {keepingPlace, useSighted} from "../composables/scrollback.js";
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import {sendMessage} from "./outbox.js";
import Icon from "../kit/Icon.vue";
import {route} from "../route.js";
import {quoted, withQuote} from "../format/quote.js";
import {chatOnly, laidOut} from "../platform/view.js";
import {threadTurns} from "../domain/thread.js";
import {agent, store} from "../state/store.js";
import {waitsFor} from "../layout/statusline.js";
import {polled} from "../sync/polled.js";
import {earlier, rows} from "../sync/rows.js";
import Compose from "./Compose.vue";
import Turn from "./Turn.vue";
import ThreadSkeleton from "./ThreadSkeleton.vue";
import {usePoll} from "../poll.js";
import {tellExtension} from "../platform/extension.js";

usePoll(...polled.agents);

const IDLE = 10000;
const scroller = ref(null);
const quote = ref({text: "", ref: ""});
const editing = ref(null);
const pageTools = chatOnly
    ? [
          {icon: "crosshair", title: "Point at an element on the page", go: () => point("point")},
          {icon: "camera", title: "Send a picture of an element on the page", go: () => point("shot")},
      ]
    : [];
const composeTools = pageTools;

function point(kind) {
    tellExtension(kind);
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
const waiting = computed(() => waitsFor(agent.value));
const thought = computed(() => (agent.value && agent.value.data.thinking) || "");
const away = ref(false);
const missed = ref(0);
const settledOnce = ref(false);
const ready = ref(false);
const unseen = computed(() =>
    rows("message")
        .filter((m) => !m.deleted && m.seen[0] === "agent" && !m.seen.includes("user"))
        .map((m) => m.n)
);
let marking = false;

async function markSeen(numbers) {
    if (marking || !numbers.length || !ready.value) return;
    marking = true;
    try {
        await api.readAll("message", numbers);
    } finally {
        marking = false;
    }
}

watch([unseen, ready], ([numbers]) => markSeen(numbers), {immediate: true});
const rendering = ref(false);
const topMark = ref(null);
const AHEAD = "200px 0px 0px 0px";
const scrolledUp = ref(false);
const NEAR_TOP = 200;
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
const thread = computed(() => {
    const made = threadTurns(
        {message: rows("message"), comment: rows("comment"), question: rows("question"), reaction: rows("reaction"), agent: store.agents},
        pending.value
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
    frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => (rendering.value = true));
    });
});

useSighted(topMark, older, {root: scroller, margin: AHEAD});

onUnmounted(() => {
    cancelAnimationFrame(frame);
});

function watchScroll() {
    const s = scroller.value;
    if (!s) return;
    away.value = s.scrollHeight - s.scrollTop - s.clientHeight > 40;
    if (settledOnce.value && away.value) scrolledUp.value = true;
    if (scrolledUp.value && s.scrollTop < NEAR_TOP) older();
}

function stillReading() {
    return away.value && reading.value.inside && Date.now() - reading.value.moved < IDLE;
}

async function post(text, files) {
    if (editing.value) {
        await api.act("message", editing.value.n, "edit", {text});
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
        await sendMessage(route.value.env, {brief: body, about}, files);
    } catch (e) {
        pending.value = pending.value.filter((p) => p.ref !== placeholder.ref);
        Object.values(placeholder.data.previews).forEach(URL.revokeObjectURL);
        throw e;
    }
    await nextTick();
    toBottom();
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
        title: "",
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

async function pin(text, about = "") {
    await api.create("notice", {brief: text, about: about || undefined});
}

watch(busy, async () => {
    await nextTick();
    if (!stillReading()) toBottom();
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
            <ThreadSkeleton />
        </template>
        <div
            ref="scroller"
            :class="['thread-scroll', {focusing: store.focus, loading: !ready}]"
            @scroll.passive="watchScroll"
            @mouseenter="reading.inside = true"
            @mouseleave="reading.inside = false"
            @mousemove="reading.moved = Date.now()"
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
                <Transition name="rise">
                    <div
                        v-if="busy"
                        class="thread-turn busy"
                        :aria-label="waiting ? `The agent is waiting ${waiting}` : 'The agent is working'"
                    >
                        <template v-if="waiting">
                            <div class="thread-bubble waiting">Waiting {{ waiting }}</div>
                        </template>
                        <template v-else-if="thought">
                            <div class="thread-bubble thought">
                                <span class="thought-label">thinking</span>
                                <span class="thought-text">{{ thought }}</span>
                            </div>
                        </template>
                        <template v-else>
                            <div class="thread-bubble">
                                <span class="thread-dot" />
                                <span class="thread-dot" />
                                <span class="thread-dot" />
                            </div>
                            <div class="thread-meta"><span>working</span></div>
                        </template>
                    </div>
                </Transition>
            </template>
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

.thread-turn.busy .thread-bubble.thought {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    max-width: 520px;
}

.thought-label {
    font-size: 10.5px;
    color: var(--text-3);
    letter-spacing: 0.02em;
}

.thought-text {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    color: var(--text-3);
    font-size: 11px;
    font-style: italic;
    line-height: 1.45;
}

.thread-turn.busy .thread-bubble.waiting {
    font-size: 12.5px;
    color: var(--text-2);
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
