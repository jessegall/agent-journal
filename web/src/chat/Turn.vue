<script setup>
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {act} from "../api.js";
import Icon from "../kit/Icon.vue";
import OptionsPicker from "../resource/OptionsPicker.vue";
import Attachments from "./Attachments.vue";
import {peek, route} from "../route.js";
import {clock, focusTurn, laidOut, meta, quoted, rows, store, types} from "../store.js";
import {render} from "../text/index.js";
import "../text/all.js";

const FACES = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠"];
const props = defineProps({turn: Object});
const emit = defineEmits(["reply", "edit", "grew", "pin"]);
const picking = ref(false);
const bubble = ref(null);
const LONG = 6;

function shaped() {
    const el = bubble.value;
    const text = el && el.querySelector(".thread-text");
    if (!el || !text || files.value.length) return;
    Object.assign(el.style, {width: "9999px", maxWidth: ""});
    const cap = el.getBoundingClientRect().width;
    const rows = () => Math.round(text.getBoundingClientRect().height / parseFloat(getComputedStyle(text).lineHeight));
    const lines = rows();
    el.style.width = "";
    if (lines < 2 || lines > LONG) return;
    let low = Math.ceil(cap / lines);
    let high = Math.ceil(cap);
    while (high - low > 4) {
        const mid = Math.floor((low + high) / 2);
        el.style.width = `${mid}px`;
        if (rows() > lines) low = mid;
        else high = mid;
    }
    el.style.width = `${high}px`;
}

onMounted(() => nextTick(shaped));
const mine = computed(() => props.turn.who === "user");
const words = computed(() => quoted(props.turn.brief || props.turn.title));
const html = computed(() => render(words.value.text, {types: types.value, env: route.value.env}));

function toQuoted() {
    const ref = props.turn.refs.find((r) => rows(r.split(":")[0]).length && r !== props.turn.ref);
    if (ref && focusTurn(ref)) return;
    const head = words.value.quote.slice(0, 40);
    const hit = rows("message").find((m) => m.n !== props.turn.n && quoted(m.brief || m.title).text.startsWith(head));
    if (hit) focusTurn(hit.ref);
}

function follow(e) {
    const pill = e.target.closest("[data-peek]");
    if (!pill) return;
    e.preventDefault();
    const [type, n] = pill.dataset.peek.split(":");
    peek(type, Number(n));
}
function worded(ref, word) {
    return ref.type && meta(ref.type) ? `${meta(ref.type).title.toLowerCase()} ${ref.n}` : word;
}

const became = computed(() => {
    const declared = props.turn.sections.flatMap((s) =>
        s.body.split(/,\s*/).map((word) => ({part: s.title, word: worded(refOf(word), word), ref: refOf(word)}))
    );
    const named = new Set(declared.map((b) => `${b.ref.type}:${b.ref.n}`));
    const linked = props.turn.refs
        .filter((ref) => !named.has(ref) && meta(ref.split(":")[0]))
        .map((ref) => ({part: "filed while this message was in hand", word: worded(refOf(ref), ref), ref: refOf(ref)}));
    const seen = new Set();
    return [...declared, ...linked]
        .filter((b) => !b.ref.type || (!seen.has(`${b.ref.type}:${b.ref.n}`) && seen.add(`${b.ref.type}:${b.ref.n}`)))
        .map((b) => ({...b, type: b.ref.type, n: b.ref.n}));
});
const faces = computed(() => {
    const seen = {};
    for (const r of rows("reaction").filter((r) => r.refs.includes(props.turn.ref) && !r.deleted))
        (seen[r.data.face] ||= []).push(r.seen[0]);
    return Object.entries(seen).map(([face, who]) => ({face, n: who.length, mine: who.includes("user"), title: who.join(", ")}));
});
const files = computed(() => Object.keys(props.turn.data.files || {}));
watch([html, laidOut], () => nextTick(shaped));

function refOf(word) {
    const m = word.trim().match(/^([\w-]+)[ :](\d+)$/);
    const type = m && (meta(m[1]) ? m[1] : types.value.find((t) => t.title.toLowerCase() === m[1].toLowerCase())?.name);
    return type ? {type, n: Number(m[2])} : {type: "", n: 0};
}

async function react(face) {
    picking.value = false;
    await act(route.value.env, props.turn.type, props.turn.n, "react", {face});
}

async function drop() {
    await act(route.value.env, "message", props.turn.n, "delete", {why: "deleted from the viewer"});
}
</script>

<template>
    <template v-if="turn.type === 'receipt'">
        <div class="thread-turn receipt" :data-ref="turn.ref">
            <div class="thread-receipt" @click="follow" v-html="html" />
        </div>
    </template>
    <template v-else>
        <div
            :class="['thread-turn', {mine, ask: turn.type === 'question', lit: store.focus === turn.ref}]"
            :data-ref="turn.ref"
            @mouseleave="picking = false"
        >
            <div ref="bubble" class="thread-bubble md">
                <template v-if="became.length">
                    <div :class="['thread-became', {live: !turn.completed}]">
                        <template v-for="(b, i) in became" :key="i">
                            <template v-if="b.type">
                                <button type="button" class="thread-pill" :title="b.part" @click="peek(b.type, b.n)">
                                    {{ b.word }}
                                </button>
                            </template>
                            <template v-else>
                                <span class="thread-pill" :title="b.part">{{ b.word }}</span>
                            </template>
                        </template>
                    </div>
                </template>
                <template v-if="turn.type === 'question'">
                    <p class="thread-ask-label">Question</p>
                </template>
                <template v-if="words.quote">
                    <p class="thread-quote" title="Go to what this answers" @click.stop="toQuoted">{{ words.quote }}</p>
                </template>
                <div class="thread-text" @click="follow" v-html="html" />
                <template v-if="turn.type === 'question'">
                    <template v-if="turn.abstract">
                        <p class="thread-context">{{ turn.abstract }}</p>
                    </template>
                    <OptionsPicker :resource="turn" />
                </template>
                <template v-if="files.length">
                    <Attachments :resource="turn" @grew="emit('grew')" />
                </template>
            </div>
            <div :class="['thread-tools', {picking}]">
                <template v-if="picking">
                    <div class="thread-face-row">
                        <template v-for="f in FACES" :key="f">
                            <button type="button" class="thread-face-pick" :title="`React ${f}`" @click.stop="react(f)">{{ f }}</button>
                        </template>
                    </div>
                    <button type="button" class="thread-tool" title="Never mind" @click.stop="picking = false">
                        <Icon name="close" />
                    </button>
                </template>
                <template v-else>
                    <button type="button" class="thread-tool" title="React to this" @click.stop="picking = true">React</button>
                    <button
                        type="button"
                        class="thread-tool"
                        title="Reply to this, quoting it"
                        @click.stop="emit('reply', {text: words.text, ref: turn.ref})"
                    >
                        Reply
                    </button>
                    <button
                        type="button"
                        class="thread-tool"
                        title="Pin this over the chat"
                        @click.stop="emit('pin', {text: words.text, ref: turn.ref})"
                    >
                        Pin
                    </button>
                    <template v-if="mine && !turn.completed">
                        <button
                            type="button"
                            class="thread-tool"
                            title="Delete it — it comes off the list and stays in the record"
                            @click.stop="drop"
                        >
                            Delete
                        </button>
                    </template>
                </template>
            </div>
            <template v-if="faces.length">
                <div class="thread-faces">
                    <template v-for="f in faces" :key="f.face">
                        <button type="button" :class="['thread-face', {mine: f.mine}]" :title="f.title" @click.stop="react(f.face)">
                            {{ f.face }}
                            <template v-if="f.n > 1">
                                <span class="thread-face-n">{{ f.n }}</span>
                            </template>
                        </button>
                    </template>
                </div>
            </template>
            <div class="thread-meta">
                <template v-if="turn.pending">
                    <span>sending</span>
                </template>
                <template v-else-if="mine || turn.type === 'question'">
                    <span class="thread-ref">{{ turn.type }} {{ turn.n }}</span>
                    <span class="thread-meta-dot" />
                </template>
                <template v-if="!turn.pending">
                    <span>{{ clock(turn.created) }}</span>
                </template>
                <template v-if="mine && !turn.pending">
                    <span
                        :class="['thread-ticks', turn.completed ? 'filed' : turn.seen.includes('agent') ? 'read' : 'sent']"
                        :title="turn.completed ? 'processed' : turn.seen.includes('agent') ? 'read' : 'sent'"
                    >
                        <svg
                            viewBox="0 0 19 12"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M1.5 6.6 4.4 9.5 10 2.8" />
                            <template v-if="turn.seen.includes('agent')">
                                <path d="M8 6.6 10.9 9.5 16.5 2.8" />
                            </template>
                        </svg>
                    </span>
                </template>
            </div>
        </div>
    </template>
</template>

<style scoped>
.thread-turn {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
    max-width: 78%;
}

.thread-turn.mine {
    align-items: flex-end;
}

.thread-turn.receipt {
    max-width: 100%;
}

.thread-receipt {
    padding: 0 2px;
    font-size: 12px;
    color: var(--text-3);
}

.thread-receipt :deep(p) {
    margin: 0;
}

.thread-receipt :deep(.row-pill) {
    padding: 0 4px;
    border: 1px solid var(--border-2);
    border-radius: 5px;
    color: var(--text-2);
    text-decoration: none;
}

.thread-turn > .thread-bubble {
    width: fit-content;
    max-width: 100%;
}

.thread-turn.mine {
    align-self: flex-end;
    align-items: flex-end;
}

.thread-turn.ask {
    max-width: 88%;
}

.thread-bubble {
    padding: 9px 12px;
    border: 1px solid #232529;
    border-radius: 9px;
    background: #161719;
    overflow-wrap: anywhere;
    transition: opacity 0.12s ease;
}

.thread-turn.mine .thread-bubble {
    border-color: color-mix(in srgb, var(--accent) 45%, transparent);
    background: color-mix(in srgb, var(--accent) 14%, transparent);
}

.thread-turn.ask .thread-bubble {
    border-color: color-mix(in srgb, var(--blocking) 40%, transparent);
}

.thread-became {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
    margin: -2px -12px 5px;
    padding: 0 12px 1px;
    font-size: 10.5px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-3);
}

.thread-became.live {
    color: var(--accent-text);
}

.thread-pill {
    padding: 0 6px;
    border: 1px solid color-mix(in srgb, var(--accent) 45%, var(--border-2));
    border-radius: 99px;
    background: color-mix(in srgb, var(--accent) 10%, transparent);
    color: var(--text-2);
    font-size: 10px;
    line-height: 1.6;
    letter-spacing: 0.03em;
    white-space: nowrap;
    text-transform: none;
}

button.thread-pill {
    cursor: pointer;
}

button.thread-pill:hover {
    border-color: var(--accent);
    color: var(--accent-text);
}

.thread-ask-label {
    margin: -2px 0 5px;
    font-size: 10.5px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--blocking);
}

.thread-quote {
    cursor: pointer;
    width: 0;
    min-width: 100%;
    box-sizing: border-box;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    margin: 0 0 6px;
    padding: 2px 0 2px 9px;
    border-left: 2px solid var(--accent);
    color: var(--text-3);
    font-size: 12px;
    white-space: pre-wrap;
}

.thread-quote:hover {
    color: var(--text-2);
}

.thread-text :deep(p) {
    margin: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    text-wrap: balance;
}

.thread-text :deep(p + p) {
    margin-top: 0.7em;
}

.thread-text :deep(code) {
    padding: 1px 5px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.06);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 0.92em;
}

.thread-text :deep(pre.chat-code) {
    margin: 6px 0;
    padding: 9px 11px;
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: #121316;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 12px;
    line-height: 1.5;
    white-space: pre;
}

.thread-text :deep(pre.chat-code code) {
    padding: 0;
    background: none;
    font-size: inherit;
}

.thread-text :deep(a) {
    color: var(--accent-text);
}

.thread-text :deep(.row-pill) {
    padding: 0 4px;
    border: 1px solid var(--border-2);
    border-radius: 5px;
    color: var(--text-2);
    text-decoration: none;
    white-space: nowrap;
}

.thread-text :deep(.row-pill:hover) {
    border-color: var(--accent);
    color: var(--accent-text);
}

.thread-text :deep(.file-pill) {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 12px;
}

.thread-text :deep(.file-pill .ico) {
    width: 11px;
    height: 11px;
}

.thread-text :deep(.console-card) {
    position: relative;
    margin: 0.5em 0 0.8em;
    padding: 10px 12px 9px;
    border: 1px solid #3a2a2a;
    border-radius: 8px;
    background: #121012;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
    line-height: 1.5;
    overflow-x: auto;
}

.thread-text :deep(.console-label) {
    position: absolute;
    bottom: 5px;
    right: 9px;
    font-size: 9.5px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #6b5c5c;
}

.thread-text :deep(.console-entry + .console-entry) {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #2a2222;
}

.thread-text :deep(.console-head) {
    color: #f0a0a0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.thread-text :deep(.console-frame) {
    padding-left: 1.6em;
    color: var(--text-3);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.thread-text :deep(.console-more) {
    margin-top: 6px;
}

.thread-text :deep(.console-more summary) {
    cursor: pointer;
    list-style: none;
    color: var(--accent-text);
    font-size: 11px;
}

.thread-text :deep(.console-more[open] summary) {
    display: none;
}

.thread-context {
    margin: 4px 0 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.thread-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 3px;
    font-size: 10.5px;
    color: var(--text-4);
}

.thread-meta-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--text-3);
    opacity: 0.7;
}

.thread-ref {
    font-size: 11px;
    opacity: 0.62;
}

.thread-ticks {
    display: inline-flex;
    margin-left: 1px;
    opacity: 0.45;
}

.thread-ticks svg {
    width: 16px;
    height: 10px;
}

.thread-ticks.read {
    opacity: 0.8;
}

.thread-ticks.filed {
    opacity: 1;
    color: var(--accent-text);
}

.thread-tools {
    position: absolute;
    top: -11px;
    right: -6px;
    display: flex;
    gap: 1px;
    padding: 1px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    background: var(--raised);
    opacity: 0;
    transform: translateY(3px);
    pointer-events: none;
    transition:
        opacity 0.16s ease-out,
        transform 0.16s ease-out;
}

.thread-turn:hover .thread-tools,
.thread-tools:focus-within {
    opacity: 1;
    transform: none;
    pointer-events: auto;
}

.thread-tools.picking {
    gap: 1px;
    padding: 1px 3px;
}

.thread-tool {
    padding: 1px 7px;
    border: 0;
    border-radius: 99px;
    background: none;
    color: var(--text-3);
    font-size: 10.5px;
    line-height: 1.5;
    cursor: pointer;
    white-space: nowrap;
}

.thread-tool:hover {
    background: var(--hover);
    color: var(--text);
}

.thread-tool .ico {
    width: 11px;
    height: 11px;
}

.thread-face-row {
    display: flex;
    gap: 1px;
    max-width: 144px;
    overflow-x: auto;
    overflow-y: hidden;
}

.thread-face-pick {
    flex: none;
    padding: 0 4px;
    border: 0;
    border-radius: 20px;
    background: transparent;
    font-size: 12px;
    line-height: 18px;
    cursor: pointer;
}

.thread-face-pick:hover {
    background: rgba(255, 255, 255, 0.08);
}

.thread-faces {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
}

.thread-turn.mine .thread-faces {
    justify-content: flex-end;
}

.thread-face {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 1px 6px;
    border: 1px solid var(--border);
    border-radius: 20px;
    background: var(--raised);
    font-size: 12px;
    line-height: 18px;
    cursor: pointer;
}

.thread-face:hover {
    border-color: var(--text-3);
}

.thread-face.mine {
    border-color: color-mix(in srgb, var(--accent) 60%, transparent);
    background: color-mix(in srgb, var(--accent) 16%, var(--raised));
}

.thread-face-n {
    font-size: 10.5px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}
.thread-turn.lit .thread-bubble {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}
</style>
