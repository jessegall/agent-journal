<script setup>
import MarkIcon from "../kit/MarkIcon.vue";
import {turnFold} from "../domain/turnFolds.js";
import {meta} from "../domain/tables.js";
import {store} from "../state/store.js";
import {computed, ref} from "vue";
import ChoiceCard from "../resource/ChoiceCard.vue";
import Attachments from "./Attachments.vue";
import MessageButtons from "./MessageButtons.vue";
import TurnHeader from "./TurnHeader.vue";
import TurnQuote from "./TurnQuote.vue";
import TurnParent from "./TurnParent.vue";
import TurnFromMain from "./TurnFromMain.vue";
import ReportCard from "./ReportCard.vue";
import TurnBriefMarker from "./TurnBriefMarker.vue";
import TurnText from "./TurnText.vue";
import TurnQuestion from "./TurnQuestion.vue";
import TaskLine from "./TaskLine.vue";
import GrowIn from "../kit/GrowIn.vue";
import TurnActions from "./TurnActions.vue";
import TurnReactions from "./TurnReactions.vue";
import {useTurnLinks} from "./turnLinks.js";
import {useTurnText} from "./turnText.js";
import {useTurnShape} from "./turnShape.js";
import {quoted} from "../format/quote.js";
import {reportOf} from "../domain/report.js";
import {EARLIER, answered} from "../domain/thread.js";
import {pendingRow} from "../domain/placeholders.js";
import {focusTurn, laidOut} from "../platform/view.js";
import {optimistic} from "../sync/rows.js";
import {growHeight} from "./arrival.js";
import {render} from "../text/index.js";

const props = defineProps({turn: Object});
const emit = defineEmits(["reply", "grew"]);
const picking = ref(false);
const bubble = ref(null);
const fold = computed(() => turnFold(props.turn));

const {scope, env, open, openChip} = useTurnLinks();
const rowsOf = (table) => scope.rows(table);
const report = computed(() => reportOf(props.turn));
const reportedTask = computed(() =>
    report.value && report.value.workerId ? rowsOf("tasks").find((t) => t.worker_id === report.value.workerId) || null : null
);
const {words, html} = useTurnText(() => (report.value ? {...props.turn, text: report.value.text} : props.turn), env);

const sent = computed(() => Boolean(props.turn.data?.sent_to));
const received = computed(() => Boolean(props.turn.data?.peer || props.turn.data?.from_main));
const fromMain = computed(() => sent.value || received.value);
const fromMainQuote = computed(
    () =>
        `Message ${props.turn.id} ${props.turn.data.sent_to ? `to ${props.turn.data.sent_to}` : `from ${props.turn.data.peer || "the main agent"}`}`
);
const opening = computed(() => Boolean(props.turn.data?.opening));
const mine = computed(() => props.turn.who === "user");
const reactions = computed(() => {
    const seen = {};
    for (const r of rowsOf("reactions").filter((r) => r.message_id === props.turn.id)) (seen[r.emoji] ||= []).push(r.author);
    return Object.entries(seen).map(([emoji, who]) => ({emoji, n: who.length, mine: who.includes("user"), title: who.join(", ")}));
});

const bubbled = computed(() =>
    Boolean(words.value.text || quoteText.value || files.value.length || resourceComment.value || props.turn.kind !== "message")
);
const LONG_TEXT = 600;
const long = computed(() => props.turn.who === "agent" && words.value.text.length > LONG_TEXT);
const answers = computed(() => answered(props.turn));
const answer = computed(() => {
    if (words.value.quote || !answers.value) return "";
    const row = rowsOf("messages").find((m) => m.id === props.turn.reply_target);
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

const files = computed(() => props.turn.files || []);
useTurnShape(bubble, {sources: [html, laidOut], holdsCard: () => files.value.length > 0 || props.turn.kind === "question"});

async function react(emoji) {
    picking.value = false;
    const reacting = () => scope.api.act("messages", props.turn.id, "react", {emoji});
    await (scope.env
        ? reacting()
        : optimistic("reactions", pendingRow("reactions", {emoji, message_id: props.turn.id}, {author: "user"}), reacting));
}

async function drop() {
    await scope.api.act("messages", props.turn.id, "delete");
}
</script>

<template>
    <div
        :class="[
            'thread-turn',
            {
                mine,
                incoming: received && !sent,
                report,
                ask: turn.kind === 'question',
                long,
                quoting: quoteText,
                lit: store.focus === turn.key,
                'comment-origin': resourceComment,
            },
        ]"
        :data-ref="turn.key"
        :data-figure-agent="turn.who === 'agent' ? '' : null"
        @mouseleave="picking = false"
    >
        <template v-if="opening">
            <TurnBriefMarker :time="turn.time" />
        </template>
        <template v-if="fromMain">
            <div class="from-main-card">
                <TurnFromMain :data="turn.data" :text="turn.text" />
                <TurnActions
                    :turn="turn"
                    :text="turn.text"
                    :picking="picking"
                    reply-label="Comment"
                    :quote="fromMainQuote"
                    @update:picking="picking = $event"
                    @reply="emit('reply', $event)"
                    @react="react"
                />
            </div>
        </template>
        <template v-if="report">
            <ReportCard
                :worker="report.worker"
                :worker-id="report.workerId"
                :message-id="turn.id"
                :task-id="turn.data.task || reportedTask?.id || 0"
                :text="report.text"
            />
        </template>
        <div
            v-show="bubbled && !opening && !report && !fromMain"
            ref="bubble"
            class="thread-bubble md"
            data-figure-bubble
            :data-figure-mark="turn.key"
            @click="resourceComment && openComment()"
        >
            <template v-if="resourceComment">
                <TurnParent :label="commentParent.label" @open="openComment" />
            </template>
            <Transition :css="false" @enter="growHeight">
                <div v-if="turn.kind === 'question'" :class="['thread-results', {live: !turn.question.closedAt}]">
                    <MarkIcon name="question" />
                    <p class="thread-ask-label">Question {{ turn.question.id }} · {{ turn.question.closedAt ? "you answered" : "the agent waits for your answer" }}</p>
                </div>
            </Transition>
            <template v-if="quoteText">
                <TurnQuote :html="quoteHtml" @go="resourceComment ? openComment() : toQuoted()" />
            </template>
            <TurnText :html="html" :name="turn.key" :fold-at="fold.at" :keep="fold.keep" @activate="openChip" />
            <template v-if="turn.kind === 'question'">
                <TurnQuestion :turn="turn" />
            </template>
            <template v-if="turn.kind === 'message'">
                <ChoiceCard :message="turn" />
            </template>
            <template v-if="turn.data?.buttons?.length">
                <MessageButtons :message="turn" />
            </template>
            <template v-if="files.length">
                <Attachments :message="turn" @grew="emit('grew')" />
            </template>
            <TurnActions
                :turn="turn"
                :text="words.text"
                :picking="picking"
                @update:picking="picking = $event"
                @reply="emit('reply', $event)"
                @delete="drop"
                @react="react"
            />
        </div>
        <template v-if="reactions.length">
            <TurnReactions :reactions="reactions" @react="react" />
        </template>
        <TurnHeader :turn="turn" />
        <GrowIn :shown="Boolean(turn.receipt)">
            <TaskLine :receipt="turn.receipt" />
        </GrowIn>
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

/* the bubble holds its hover buttons, so they sit on its own corner however wide the turn around it is */
.thread-bubble {
    position: relative;
    width: fit-content;
    max-width: 100%;
}

.thread-turn.ask {
    width: calc(100% - var(--turn-gutter));
    max-width: calc(100% - var(--turn-gutter));
}

/* a box means words: a message is a soft filled box with no edge, which no mark the journal records has */
.thread-bubble {
    padding: 9px 12px;
    border: 1px solid transparent;
    border-radius: 10px;
    background: var(--bubble);
    line-height: 1.5;
    overflow-wrap: anywhere;
    transition: opacity 0.12s ease;
}

.thread-turn.long {
    width: calc(100% - var(--turn-gutter));
    max-width: calc(100% - var(--turn-gutter));
}

.thread-turn.long .thread-bubble {
    width: 100%;
    padding: 13px 17px;
    line-height: 1.62;
}

.thread-turn.mine .thread-bubble {
    background: color-mix(in srgb, var(--accent) 17%, var(--bg));
}

.thread-turn.report .thread-bubble {
    border-left: 3px solid color-mix(in srgb, var(--tone-work) 55%, transparent);
    background: color-mix(in srgb, var(--tone-work) 6%, var(--bubble));
}

.thread-turn.comment-origin .thread-bubble {
    background: color-mix(in srgb, var(--blocking) 9%, var(--bubble));
    cursor: pointer;
}

/* a question waits on the user: a card with an amber edge until it is answered */
.thread-turn.ask .thread-bubble {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px 13px;
    border-color: color-mix(in srgb, var(--tone-warn) 40%, var(--border-2));
    border-radius: 12px;
}

.thread-turn.ask:has(.thread-results:not(.live)) .thread-bubble {
    border-color: var(--border);
}

.thread-results {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 0 5px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 500;
}

.thread-results.live {
    color: var(--tone-warn);
}

.thread-results :deep(svg) {
    width: 13px;
    height: 13px;
}

.thread-ask-label {
    margin: 0 auto 0 0;
}

.thread-turn.quoting {
    min-width: min(280px, calc(100% - var(--turn-gutter)));
}

.thread-turn.quoting .thread-bubble {
    min-width: 100%;
    box-sizing: border-box;
}

.from-main-card {
    position: relative;
    max-width: 560px;
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
