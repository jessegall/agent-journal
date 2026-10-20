<script setup>
import {meta} from "../domain/tables.js";
import {store} from "../state/store.js";
import {computed, ref} from "vue";
import ChoiceCard from "../resource/ChoiceCard.vue";
import Attachments from "./Attachments.vue";
import TurnHeader from "./TurnHeader.vue";
import TurnQuote from "./TurnQuote.vue";
import TurnParent from "./TurnParent.vue";
import TurnFromMain from "./TurnFromMain.vue";
import TurnBriefMarker from "./TurnBriefMarker.vue";
import TurnText from "./TurnText.vue";
import TurnQuestion from "./TurnQuestion.vue";
import TurnActions from "./TurnActions.vue";
import TurnReactions from "./TurnReactions.vue";
import {useTurnLinks} from "./turnLinks.js";
import {useTurnText} from "./turnText.js";
import {useTurnShape} from "./turnShape.js";
import {quoted} from "../format/quote.js";
import {EARLIER, answered} from "../domain/thread.js";
import {pendingRow} from "../domain/placeholders.js";
import {focusTurn, laidOut} from "../platform/view.js";
import {optimistic} from "../sync/rows.js";
import {render} from "../text/index.js";

const props = defineProps({turn: Object});
const emit = defineEmits(["reply", "grew"]);
const picking = ref(false);
const bubble = ref(null);
const FOLD_AT = 420;

const {scope, env, open, openChip} = useTurnLinks();
const rowsOf = (table) => scope.rows(table);
const {words, html} = useTurnText(() => props.turn, env);

const sent = computed(() => Boolean(props.turn.data?.sent_to));
const received = computed(() => Boolean(props.turn.data?.peer || props.turn.data?.from_main));
const fromMain = computed(() => sent.value || received.value);
const opening = computed(() => Boolean(props.turn.data?.opening));
const mine = computed(() => props.turn.who === "user" || received.value);
const bubbled = computed(() => Boolean(words.value.text || quoteText.value || files.value.length || filed.value.length || resourceComment.value || props.turn.kind !== "message"));
const LONG_TEXT = 600;
const long = computed(() => props.turn.who === "agent" && words.value.text.length > LONG_TEXT);
const answers = computed(() => answered(props.turn));
const answer = computed(() => {
    if (words.value.quote || !answers.value) return "";
    const row = rowsOf("messages").find((m) => m.id === props.turn.reply_to);
    return row ? quoted(row.text).text : EARLIER;
});
const quoteText = computed(() => words.value.quote || answer.value);
const quoteHtml = computed(() => render(quoteText.value, {env: env.value}));
const commentParent = computed(() => {
    if (props.turn.kind !== "comment") return null;
    const [table, id] = props.turn.comments_on[0].split(":");
    return meta(table) ? {table, id: Number(id), label: `${meta(table).title.toLowerCase()} ${id}`} : null;
});
const resourceComment = computed(() => !!commentParent.value);

function openComment() {
    if (commentParent.value) open(commentParent.value.table, commentParent.value.id, props.turn.id);
}

function toQuoted() {
    if (answers.value && focusTurn(answers.value)) return;
    const head = quoteText.value.slice(0, 40);
    const hit = rowsOf("messages").find((m) => m.id !== props.turn.id && quoted(m.text).text.startsWith(head));
    if (hit) focusTurn(`messages:${hit.id}`);
}

// The tasks filed from this message, each a pill that opens it.
const filed = computed(() => (props.turn.filed || []).map((id) => ({id, word: `task ${id}`})));
const faces = computed(() => {
    const seen = {};
    for (const r of rowsOf("reactions").filter((r) => r.message_id === props.turn.id)) (seen[r.face] ||= []).push(r.author);
    return Object.entries(seen).map(([face, who]) => ({face, n: who.length, mine: who.includes("user"), title: who.join(", ")}));
});
const files = computed(() => props.turn.files || []);
useTurnShape(bubble, {sources: [html, laidOut], holdsCard: () => files.value.length > 0 || props.turn.kind === "question"});

async function react(face) {
    picking.value = false;
    const reacting = () => scope.api.act("messages", props.turn.id, "react", {face});
    await (scope.env ? reacting() : optimistic("reactions", pendingRow("reactions", {face, message_id: props.turn.id}, {author: "user"}), reacting));
}

async function drop() {
    await scope.api.act("messages", props.turn.id, "delete");
}
</script>

<template>
    <div
        :class="['thread-turn', {mine, ask: turn.kind === 'question', long, quoting: quoteText, lit: store.focus === turn.key, 'comment-origin': resourceComment}]"
        :data-ref="turn.key"
        @mouseleave="picking = false"
    >
        <template v-if="opening">
            <TurnBriefMarker :at="turn.at" />
        </template>
        <div v-show="bubbled && !opening" ref="bubble" class="thread-bubble md" data-figure-bubble :data-figure-mark="turn.key" @click="resourceComment && openComment()">
            <template v-if="fromMain">
                <TurnFromMain :at="turn.at" :data="turn.data" />
            </template>
            <template v-if="resourceComment">
                <TurnParent :label="commentParent.label" @open="openComment" />
            </template>
            <template v-if="filed.length || turn.kind === 'question'">
                <div :class="['thread-results', {live: turn.kind === 'question' && !turn.question.closedAt}]">
                    <template v-if="turn.kind === 'question'">
                        <p class="thread-ask-label">Question</p>
                    </template>
                    <template v-for="b in filed" :key="b.id">
                        <button type="button" class="thread-pill" title="filed from this message" @click.stop="open('tasks', b.id)">
                            {{ b.word }}
                        </button>
                    </template>
                </div>
            </template>
            <template v-if="quoteText">
                <TurnQuote :html="quoteHtml" @go="resourceComment ? openComment() : toQuoted()" />
            </template>
            <TurnText :html="html" :name="turn.key" :fold-at="FOLD_AT" :keep="320" @activate="openChip" />
            <template v-if="turn.kind === 'question'">
                <TurnQuestion :turn="turn" />
            </template>
            <template v-if="turn.kind === 'message'">
                <ChoiceCard :message="turn" />
            </template>
            <template v-if="files.length">
                <Attachments :message="turn" @grew="emit('grew')" />
            </template>
        </div>
        <TurnActions
            :turn="turn"
            :text="words.text"
            :picking="picking"
            @update:picking="picking = $event"
            @reply="emit('reply', $event)"
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
