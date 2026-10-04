<script setup>
import TextDisplay from "../kit/TextDisplay.vue";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import Buttons from "../resource/Buttons.vue";
import OptionsPicker from "../resource/OptionsPicker.vue";
import Attachments from "./Attachments.vue";
import TurnHeader from "./TurnHeader.vue";
import TurnQuote from "./TurnQuote.vue";
import TurnParent from "./TurnParent.vue";
import TurnPeer from "./TurnPeer.vue";
import TurnText from "./TurnText.vue";
import TurnActions from "./TurnActions.vue";
import TurnReactions from "./TurnReactions.vue";
import {openUpdate} from "./updateView.js";
import {useTurnLinks} from "./turnLinks.js";
import {useTurnText} from "./turnText.js";
import {quoted} from "../format/quote.js";
import {EARLIER, answered} from "../domain/replies.js";
import {focusTurn, laidOut} from "../platform/view.js";
import {meta, store, types} from "../state/store.js";
import {optimistic} from "../sync/rows.js";
import {render} from "../text/index.js";

const props = defineProps({turn: Object});
const emit = defineEmits(["reply", "grew", "pin"]);
const picking = ref(false);
const bubble = ref(null);
const LONG = 6;
const FOLD_AT = 420;
const PEER_FOLD_AT = 140;
const PEER_KEEP = 96;

const {scope, env, open, openChip} = useTurnLinks();
const rowsOf = (type) => scope.rows(type);
const {words, split, html} = useTurnText(() => props.turn, env);

function chipOrUpdate(e) {
    const update = e.target.closest("[data-update]");
    if (!update) return openChip(e);
    e.preventDefault();
    e.stopPropagation();
    openUpdate(Number(update.dataset.update), update);
}

function shaped() {
    const el = bubble.value;
    const text = el && el.querySelector(".thread-text");
    if (!el || !text || files.value.length || props.turn.type === "question") return;
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

onMounted(() =>
    nextTick(() => {
        shaped();
    })
);
const mine = computed(() => props.turn.who === "user");
const subagentTask = (id) =>
    rowsOf("agent")
        .flatMap((agent) => agent.data.subagent_rows || [])
        .find((sub) => sub.task_id === id)?.task;
const called = (id) => subagentTask(id) ?? `agent ${id}`;
const between = computed(() =>
    props.turn.data?.peer
        ? `From ${called(props.turn.data.peer)}`
        : props.turn.data?.sent_to
          ? `Sent to ${called(props.turn.data.sent_to)}`
          : ""
);
const data = computed(() => props.turn.data);
const updates = computed(() => split.value.cards);
const bubbled = computed(
    () =>
        Boolean(split.value.text) ||
        !split.value.cards.length ||
        Boolean(quoteText.value || files.value.length || results.value.length || resourceComment.value || props.turn.type !== "message")
);
const LONG_TEXT = 600;
const long = computed(() => props.turn.who === "agent" && words.value.text.length > LONG_TEXT);
const answers = computed(() => answered(props.turn));
const answer = computed(() => {
    if (words.value.quote || !answers.value) return "";
    const [type, n] = answers.value.split(":");
    const row = rowsOf(type).find((r) => r.n === Number(n));
    return row ? quoted(row.brief || row.title).text : EARLIER;
});
const quoteText = computed(() => words.value.quote || answer.value);
const quoteHtml = computed(() => render(quoteText.value, {types: types.value, env: env.value}));
const commentParent = computed(() => {
    if (props.turn.type !== "comment") return null;
    const parent = props.turn.refs.find((ref) => {
        const [type] = ref.split(":");
        return type !== "comment" && meta(type);
    });
    if (!parent) return null;
    const [type, n] = parent.split(":");
    return {type, n: Number(n), label: `${meta(type).title.toLowerCase()} ${n}`};
});
const messageReply = computed(() => commentParent.value?.type === "message");
const resourceComment = computed(() => !!commentParent.value && !messageReply.value);

function openComment() {
    if (commentParent.value) open(commentParent.value.type, commentParent.value.n, props.turn.n);
}

function toQuoted() {
    const ref = props.turn.refs.find((r) => rowsOf(r.split(":")[0]).length && r !== props.turn.ref);
    if (ref && focusTurn(ref)) return;
    const head = quoteText.value.slice(0, 40);
    const hit = rowsOf("message").find((m) => m.n !== props.turn.n && quoted(m.brief || m.title).text.startsWith(head));
    if (hit) focusTurn(hit.ref);
}

function worded(ref, word) {
    return ref.type && meta(ref.type) ? `${meta(ref.type).title.toLowerCase()} ${ref.n}` : word;
}

const results = computed(() => {
    const declared = props.turn.sections
        .flatMap((s) => s.body.split(/,\s*/).map((word) => ({part: s.title, word: worded(refOf(word), word), ref: refOf(word)})))
        .filter((b) => b.ref.type);
    const named = new Set(declared.map((b) => `${b.ref.type}:${b.ref.n}`));
    const linked = props.turn.refs
        .filter((ref) => !named.has(ref) && refOf(ref).type)
        .map((ref) => ({part: "filed while this message was in hand", word: worded(refOf(ref), ref), ref: refOf(ref)}));
    const seen = new Set();
    const quotedMessage = (b) => quoteText.value && b.ref.type === "message" && props.turn.refs.includes(`message:${b.ref.n}`);
    return [...declared, ...linked]
        .filter((b) => b.ref.type !== "comment")
        .filter((b) => !quotedMessage(b))
        .filter((b) => !b.ref.type || (!seen.has(`${b.ref.type}:${b.ref.n}`) && seen.add(`${b.ref.type}:${b.ref.n}`)))
        .map((b) => ({...b, type: b.ref.type, n: b.ref.n}));
});
const faces = computed(() => {
    const seen = {};
    for (const r of rowsOf("reaction").filter((r) => r.refs.includes(props.turn.ref) && !r.deleted))
        (seen[r.data.face] ||= []).push(r.seen[0]);
    return Object.entries(seen).map(([face, who]) => ({face, n: who.length, mine: who.includes("user"), title: who.join(", ")}));
});
const files = computed(() => Object.keys(props.turn.data.files || {}));
watch([html, laidOut], () =>
    nextTick(() => {
        shaped();
    })
);

function refOf(word) {
    const m = word.trim().match(/^([\w-]+)[ :](\d+)$/);
    const type = m && (meta(m[1]) ? m[1] : types.value.find((t) => t.title.toLowerCase() === m[1].toLowerCase())?.name);
    return type ? {type, n: Number(m[2])} : {type: "", n: 0};
}

async function react(face) {
    picking.value = false;
    const pending = {
        ref: `reaction:pending-${Date.now()}`,
        type: "reaction",
        n: 0,
        refs: [props.turn.ref],
        seen: ["user"],
        data: {face},
        deleted: 0,
    };
    const reacting = () => scope.api.act(props.turn.type, props.turn.n, "react", {face});
    await (scope.env ? reacting() : optimistic("reaction", pending, reacting));
}

async function drop() {
    await scope.api.act(props.turn.type, props.turn.n, "delete", {why: "deleted from the viewer"});
}
</script>

<template>
    <div
        :class="[
            'thread-turn',
            {
                mine,
                peer: !!between,
                ask: turn.type === 'question',
                long,
                quoting: quoteText,
                lit: store.focus === turn.ref,
                'comment-origin': resourceComment,
                'has-update': updates.length > 0,
            },
        ]"
        :data-ref="turn.ref"
        @mouseleave="picking = false"
    >
        <template v-if="turn.who === 'system'">
            <span class="thread-from">journal</span>
        </template>
        <div v-show="bubbled" ref="bubble" class="thread-bubble md" @click="resourceComment && openComment()">
            <template v-if="resourceComment">
                <TurnParent :label="commentParent.label" @open="openComment" />
            </template>
            <template v-if="between">
                <TurnPeer :label="between" />
            </template>
            <template v-if="results.length || turn.type === 'question'">
                <div :class="['thread-results', {live: !turn.completed}]">
                    <template v-if="turn.type === 'question'">
                        <p class="thread-ask-label">Question</p>
                    </template>
                    <template v-for="b in results" :key="`${b.part}:${b.type}:${b.n}`">
                        <button type="button" class="thread-pill" :title="b.part" @click.stop="open(b.type, b.n)">
                            {{ b.word }}
                        </button>
                    </template>
                </div>
            </template>
            <template v-if="quoteText">
                <TurnQuote :html="quoteHtml" @go="resourceComment ? openComment() : toQuoted()" />
            </template>
            <template v-if="turn.type === 'question' && turn.title && turn.title !== words.text">
                <p class="thread-ask">{{ turn.title }}</p>
            </template>
            <TurnText :html="html" :fold-at="between ? PEER_FOLD_AT : FOLD_AT" :keep="between ? PEER_KEEP : 320" @activate="chipOrUpdate" />
            <template v-if="turn.type === 'question'">
                <template v-if="turn.abstract">
                    <TextDisplay class="thread-context" :text="turn.abstract" />
                </template>
                <OptionsPicker :resource="turn" />
            </template>
            <template v-if="turn.type === 'message'">
                <Buttons :resource="turn" />
            </template>
            <template v-if="files.length">
                <Attachments :resource="turn" @grew="emit('grew')" />
            </template>
        </div>
        <template v-for="(card, i) in split.cards" :key="`update-${i}`">
            <div class="thread-update" @click="chipOrUpdate" v-html="card" />
        </template>
        <TurnActions
            :turn="turn"
            :mine="mine"
            :text="words.text"
            :picking="picking"
            @update:picking="picking = $event"
            @reply="emit('reply', $event)"
            @pin="emit('pin', $event)"
            @delete="drop"
            @react="react"
        />
        <template v-if="faces.length">
            <TurnReactions :faces="faces" @react="react" />
        </template>
        <TurnHeader :turn="turn" />
    </div>
</template>

<style scoped>
.thread-turn.has-update {
    width: min(78%, calc(100% - var(--turn-gutter)));
}

.thread-update {
    align-self: stretch;
    width: 100%;
    margin: 2px 0;
}

.thread-turn.peer .thread-bubble {
    --pill-text: var(--text-4);
    --pill-border: var(--border);
    --pill-size: 0.92em;

    padding: 7px 10px;
    border-color: #1d1e22;
    background: none;
    color: var(--text-3);
    font-size: 12px;
    line-height: 1.5;
}

.thread-turn > .thread-from {
    margin: 0 0 3px 2px;
    color: var(--accent-text);
    font-size: 11px;
    font-weight: 500;
}

.thread-bubble {
    width: fit-content;
    max-width: 100%;
}

.thread-turn.ask {
    width: calc(100% - var(--turn-gutter));
    max-width: calc(100% - var(--turn-gutter));
}

.thread-bubble {
    padding: 9px 12px;
    border: 1px solid #232529;
    border-radius: 9px;
    background: #161719;
    overflow-wrap: anywhere;
    transition: opacity 0.12s ease;
}

.thread-turn.long {
    width: calc(100% - var(--turn-gutter));
    max-width: calc(100% - var(--turn-gutter));
}

.thread-turn.long .thread-bubble {
    width: 100%;
    padding: 14px 18px;
    border-color: var(--border);
    border-radius: 12px;
    background: var(--raised);
    line-height: 1.65;
}

.thread-turn.mine .thread-bubble {
    border-color: color-mix(in srgb, var(--accent) 45%, transparent);
    background: color-mix(in srgb, var(--accent) 14%, transparent);
}

.thread-turn.comment-origin .thread-bubble {
    border-color: color-mix(in srgb, var(--blocking) 45%, var(--border-2));
    background: color-mix(in srgb, var(--blocking) 9%, #161719);
    cursor: pointer;
}

.thread-turn.mine :deep(.thread-text) {
    padding-bottom: 4px;
}

.thread-turn.ask .thread-bubble {
    width: 100%;
    box-sizing: border-box;
    border-color: color-mix(in srgb, var(--blocking) 40%, transparent);
}

.thread-results {
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

.thread-results.live {
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
    margin: 0 auto 0 0;
    font-size: 10.5px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--blocking);
}

.thread-turn.quoting {
    min-width: min(280px, calc(100% - var(--turn-gutter)));
}

.thread-turn.quoting .thread-bubble {
    min-width: 100%;
    box-sizing: border-box;
}

.thread-ask {
    margin: 0 0 6px;
    font-size: 14.5px;
    font-weight: 600;
    color: var(--text);
}

.thread-context {
    margin: 4px 0 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.thread-turn:hover :deep(.thread-tools) {
    opacity: 1;
    transform: none;
    pointer-events: auto;
}

.thread-turn.mine :deep(.thread-faces) {
    justify-content: flex-end;
}

.thread-turn.lit .thread-bubble {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}
</style>
