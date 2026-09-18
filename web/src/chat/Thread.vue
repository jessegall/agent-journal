<script setup>
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {act, create} from "../api.js";
import Icon from "../kit/Icon.vue";
import {route} from "../route.js";
import {quoted, reload, rows, store, withQuote} from "../store.js";
import Compose from "./Compose.vue";
import Turn from "./Turn.vue";

const IDLE = 10000;
const scroller = ref(null);
const quote = ref("");
const editing = ref(null);
const mine = computed(() => rows("message").filter((m) => !m.deleted && m.seen[0] === "user" && !m.seen.includes("agent")));

function editLast() {
    const last = mine.value[mine.value.length - 1];
    if (last) editing.value = {n: last.n, text: quoted(last.brief).text};
}

function unedit() {
    editing.value = null;
}
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
const turns = computed(() =>
    [
        ...rows("message")
            .filter((m) => !m.deleted)
            .map((m) => ({...m, who: m.seen[0]})),
        ...rows("comment")
            .filter((c) => !c.deleted && c.refs.some((r) => r.startsWith("message:")))
            .map((c) => ({...c, who: c.seen[0]})),
        ...rows("question")
            .filter((q) => !q.deleted)
            .map((q) => ({...q, who: "agent"})),
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
        await reload();
        return;
    }
    const body = withQuote(quote.value, text);
    const title = body.split("\n").find((l) => l && !l.startsWith(">")) || body;
    const message = await create(route.value.env, "message", {title: title.replace(/:/g, " -").slice(0, 80), brief: body});
    quote.value = "";
    for (const f of files) await upload(message.n, f);
    await reload();
    await nextTick();
    toBottom();
}

async function upload(n, file) {
    const body = new FormData();
    body.append("file", file, file.name);
    const res = await fetch(`/api/${route.value.env}/message/${n}/upload`, {method: "POST", body});
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
}

watch(
    () => turns.value.length,
    async (n, before) => {
        await nextTick();
        if (!ready.value) {
            if (!n) return;
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
                :quote="quote"
                quote-label="Replying to"
                @unquote="quote = ''"
                :preset="editing ? editing.text : ''"
                :up="editLast"
                :down="unedit"
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
                <Turn v-for="t in turns" :key="t.ref" :turn="t" @reply="quote = $event" @edit="editing = $event" @grew="settled" />
            </TransitionGroup>
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
    order: 2;
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
