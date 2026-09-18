<script setup>
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {create} from "../api.js";
import Icon from "../kit/Icon.vue";
import {route} from "../route.js";
import {reload, rows, withQuote} from "../store.js";
import Compose from "./Compose.vue";
import Turn from "./Turn.vue";

const IDLE = 10000;
const scroller = ref(null);
const quote = ref("");
const away = ref(false);
const reading = ref({inside: false, moved: 0});
const turns = computed(() =>
    [
        ...rows("message")
            .filter((m) => !m.deleted)
            .map((m) => ({...m, who: m.seen[0]})),
        ...rows("comment")
            .filter((c) => !c.deleted && c.refs.some((r) => r.startsWith("message:")))
            .map((c) => ({...c, who: c.seen[0]})),
    ].sort((a, b) => a.created - b.created)
);

function toBottom() {
    if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight;
    away.value = false;
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
    async () => {
        await nextTick();
        if (!stillReading()) toBottom();
    },
    {immediate: true}
);
</script>

<template>
    <div class="thread">
        <div class="thread-write">
            <template v-if="away">
                <button type="button" class="thread-down" title="Back to the newest" @click="toBottom">
                    <Icon name="down" />
                    Newest
                </button>
            </template>
            <Compose :send="post" :quote="quote" quote-label="Replying to" />
        </div>
        <div
            ref="scroller"
            class="thread-scroll"
            @scroll.passive="watchScroll"
            @mouseenter="reading.inside = true"
            @mouseleave="reading.inside = false"
            @mousemove="reading.moved = Date.now()"
        >
            <template v-if="!turns.length">
                <p class="thread-empty">Nothing has been said here yet.</p>
            </template>
            <template v-for="t in turns" :key="t.ref">
                <Turn :turn="t" @reply="quote = $event" @grew="settled" />
            </template>
        </div>
    </div>
</template>

<style scoped>
.thread {
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
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

.thread-empty {
    padding: 18px 2px;
    color: var(--text-3);
}
</style>
