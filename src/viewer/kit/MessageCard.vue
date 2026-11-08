<script setup>
import FlowchartDialog from "../src/chat/FlowchartDialog.vue";
import GrowingCard from "../src/chat/GrowingCard.vue";
import MessageLinks from "./MessageLinks.vue";
import {computed, inject, ref} from "vue";
import {WINDOW_CONTEXT} from "./windowContextKey.js";
import Icon from "../src/kit/Icon.vue";
import ReadTicks from "../src/kit/ReadTicks.vue";
import {clock} from "../src/format/time.js";
import {useTextRender} from "../src/text/useTextRender.js";
import {peekChip, peekRef} from "../src/route.js";
import {meta, tableOfWord} from "../src/domain/tables.js";
import {foldOf} from "../src/domain/messageFold.js";
import Folded from "../src/kit/Folded.vue";
import {useFittedBubble} from "../src/chat/fittedBubble.js";
import {FACES, reactionGroups} from "../src/domain/reactionGroups.js";
import "../src/text/all.js";
import {useMessageLinkPages} from "../src/composables/messageLinkPages.js";
import MoreItems from "./MoreItems.vue";

// one message of the chat as version 4 drew it: a soft rounded card, the user's tinted and set to the right, the agent's to the left,
// the text read as markdown (inline code, lists, bold), and the time under the card; a worker's report is its card headed with the worker, which opens it,
// folded to two lines with Show more when it is longer
const props = defineProps({message: {type: Object, required: true}, quote: {type: String, default: ""}});
const emit = defineEmits(["reply", "comment", "delete", "react"]);
const copied = ref(false);
const bubble = ref(null);
const fromPerson = computed(() => ["user", "comment"].includes(props.message.type));
// a comment on a row names that row, as version 4's comment bubble did: a header that opens the row, and a tint of its own
const commentedRow = computed(() => {
    const [model, id] = (props.message.commented_row || ":").split(":");
    const table = tableOfWord(model);
    return table ? {ref: `${table}:${id}`, label: `${meta(table).title.toLowerCase()} ${id}`} : null;
});
const worker = computed(() => props.message.worker_id ?? null);
const folding = computed(() => foldOf(props.message));
const deletable = computed(() => fromPerson.value && !props.message.read_at && !props.message.local);
async function copy() {
    await navigator.clipboard?.writeText(props.message.text ?? "");
    copied.value = true;
    setTimeout(() => (copied.value = false), COPIED_MS);
}
const render = useTextRender();
const html = computed(() => render(props.message.text ?? ""));
const edges = computed(() => JSON.parse(props.message.flowchart_edges || "[]"));
const chartOpen = ref(false);
const quoteHtml = computed(() => render(props.quote || EARLIER));
function goToQuoted() {
    const shown = document.querySelector(`[data-ref="message:${props.message.parent_id}"]`);
    if (shown) shown.scrollIntoView({block: "center", behavior: "smooth"});
    else peekRef(`messages:${props.message.parent_id}`);
}
useFittedBubble(bubble, () => `${props.message.text} ${props.quote}`);
const COPIED_MS = 1500;
const EARLIER = "An earlier message";
const IMAGE = /\.(png|jpe?g|gif|webp|svg|bmp)$/i;
const addressOf = (name) => `/api/files/message/${props.message.id}/${encodeURIComponent(name)}`;
const captions = computed(() => JSON.parse(props.message.captions || "{}"));
const files = computed(() => (props.message.files ?? []).map((name) => ({name, address: addressOf(name), isImage: IMAGE.test(name), title: captions.value[name] || name})));
const time = computed(() => clock(new Date(props.message.created_at).getTime() / 1000 || props.message.created_at));

// the rows a person's message names, under it, as version 4's line of what it linked
const context = inject(WINDOW_CONTEXT, null);
const {links, total, more, loading, failure, sentTo, sentMore, sentLoading, sentFailure, loadMore, loadSent} =
    useMessageLinkPages(context, () => fromPerson.value && !props.message.local ? props.message.id : null, bubble);

const picking = ref(false);
const reactions = computed(() => reactionGroups(props.message.reactions));

function pick(face) {
    picking.value = false;
    emit("react", props.message, face);
}
</script>

<template>
    <template v-if="message.peer || message.recipient">
        <div class="message" data-message-between-agents :data-incoming="message.recipient ? null : ''" :data-ref="`message:${message.id}`">
            <GrowingCard :title="message.recipient ? `Message sent to ${message.recipient}` : `Message from ${message.peer}`" :text="message.text" :icon="message.recipient ? 'send' : 'reply'" :person="message.recipient || message.peer" :incoming="!message.recipient" commentable @comment="emit('comment', message)" />
        </div>
    </template>
    <template v-else>
        <article class="message" data-message data-figure-bubble :data-figure-mark="`message:${message.id}`" :data-figure-agent="fromPerson ? null : ''" :data-from="fromPerson ? 'user' : message.type" :data-ref="`message:${message.id}`">
            <div class="message-body">
                <div ref="bubble" :class="['message-card', 'md', {comment: commentedRow}]" @click="peekChip">
                    <template v-if="commentedRow">
                        <button type="button" class="message-comment-head" data-message-comment :title="`Open ${commentedRow.label}`" @click.stop="peekRef(commentedRow.ref)">
                            <Icon name="bubble" :size="12" />
                            <span>Comment on {{ commentedRow.label }}</span>
                        </button>
                    </template>
                    <template v-if="message.parent_id">
                        <div class="message-quote" data-message-reply title="Go to what this answers" @click.stop="goToQuoted" v-html="quoteHtml" />
                    </template>
                    <template v-if="worker !== null">
                        <button type="button" class="message-worker" data-message-worker :title="`Open worker ${worker}`" @click.stop="peekRef(`agents:${worker}`)">Worker {{ worker }}</button>
                    </template>
                    <Folded :at="folding.at" :keep="folding.keep" :name="`message:${message.id}`">
                        <div data-message-text v-html="html" />
                    </Folded>
                    <template v-if="edges.length">
                        <button type="button" class="message-flowchart" data-flowchart-open @click="chartOpen = true">Open the flowchart</button>
                        <template v-if="chartOpen">
                            <FlowchartDialog :title="message.text" :edges="edges" @close="chartOpen = false" />
                        </template>
                    </template>
                </div>
                <div :class="['message-tools', {picking}]" data-message-tools>
                    <template v-if="picking">
                        <div class="message-faces" data-message-faces>
                            <template v-for="face in FACES" :key="face">
                                <button type="button" class="message-face" :title="`React ${face}`" :data-face="face" @click="pick(face)">{{ face }}</button>
                            </template>
                        </div>
                        <button type="button" class="message-tool" data-message-action="cancel-react" title="Cancel" @click="picking = false"><Icon name="close" :size="11" /></button>
                    </template>
                    <template v-else>
                        <button type="button" class="message-tool" data-message-action="react" title="React to this" @click="picking = true">React</button>
                        <button type="button" class="message-tool" data-message-action="reply" @click="emit('reply', message)">Reply</button>
                        <button type="button" class="message-tool" data-message-action="copy" @click="copy">{{ copied ? "Copied" : "Copy" }}</button>
                        <template v-if="deletable">
                            <button type="button" class="message-tool" data-message-action="delete" title="Only while it is unread" @click="emit('delete', message)">Delete</button>
                        </template>
                    </template>
                </div>
            </div>
            <template v-if="reactions.length">
                <div class="message-reactions" data-message-reactions>
                    <template v-for="reaction in reactions" :key="reaction.emoji">
                        <button type="button" :class="['message-reaction', {mine: reaction.mine}]" :title="reaction.title" :data-reaction="reaction.emoji" @click="emit('react', message, reaction.emoji)">
                            {{ reaction.emoji }}
                            <template v-if="reaction.count > 1">
                                <span class="message-reaction-count">{{ reaction.count }}</span>
                            </template>
                        </button>
                    </template>
                </div>
            </template>
            <template v-if="files.length">
                <div class="message-files" data-message-files>
                    <template v-for="file in files" :key="file.name">
                        <template v-if="file.isImage">
                            <a :href="file.address" target="_blank" class="message-image" :title="file.title"><img :src="file.address" :alt="file.name" data-figure-picture></a>
                        </template>
                        <template v-else>
                            <a :href="file.address" target="_blank" class="message-file">{{ file.name }}</a>
                        </template>
                    </template>
                </div>
            </template>
            <template v-if="sentTo.length">
                <div class="message-sent-to" data-message-sent-to>
                    <Icon name="send" :size="12" />
                    <template v-for="target in sentTo" :key="target.id">
                        <button type="button" class="message-sent-worker" :disabled="target.unavailable || !target.open_ref" :data-sent-worker="target.id" :title="`Open worker ${target.id}`" @click.stop="target.open_ref && peekRef(target.open_ref)">Also sent to worker {{ target.id }}<template v-if="target.unavailable"> (unavailable)</template></button>
                    </template>
                </div>
            </template>
            <MoreItems :more="sentMore" :loading="sentLoading" :failure="sentFailure" label="More recipients" @more="loadSent" />
            <div class="message-foot">
                <time class="message-time">{{ time }}</time>
                <template v-if="Number.isInteger(message.id)">
                    <span class="message-dot" aria-hidden="true">•</span>
                    <span class="message-id" data-message-id>message {{ message.id }}</span>
                </template>
                <template v-if="fromPerson">
                    <ReadTicks :message="message" />
                </template>
            </div>
            <template v-if="links.length || failure">
                <MessageLinks :links="links" :total="total" :more="more" :loading="loading" :failure="failure" @more="loadMore" />
            </template>
        </article>
    </template>
</template>

<style scoped>
.message-faces {
    display: flex;
    gap: 1px;
    max-width: 144px;
    overflow-x: auto;
    overflow-y: hidden;
}

.message-face {
    flex: none;
    padding: 0 4px;
    border: 0;
    border-radius: 20px;
    background: none;
    font-size: 12px;
    line-height: 18px;
    cursor: pointer;
}

.message-face:hover {
    background: var(--hover);
}

.message-sent-to {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
    padding: 2px 6px;
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 1.45;
}

.message-sent-worker {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
}

.message-sent-worker:hover {
    color: var(--text);
}

.message-reactions {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 2px;
}

.message-reaction {
    display: inline-flex;
    gap: 3px;
    align-items: center;
    padding: 1px 6px;
    border: 1px solid transparent;
    border-radius: 20px;
    background: transparent;
    font-size: 12px;
    line-height: 18px;
    cursor: pointer;
    transition:
        background 0.15s,
        border-color 0.15s;
}

.message-reaction:hover {
    background: var(--hover);
}

.message-reaction.mine {
    border-color: color-mix(in srgb, var(--accent) 60%, transparent);
    background: color-mix(in srgb, var(--accent) 16%, var(--raised));
}

.message-reaction-count {
    color: var(--text-3);
    font-size: 10.5px;
    font-variant-numeric: tabular-nums;
}

.message {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
    max-width: min(78%, calc(100% - 48px));
}

.message[data-from="user"],
.message[data-incoming] {
    align-items: flex-end;
    margin-left: auto;
}

.message-body {
    position: relative;
    min-width: 0;
    max-width: 100%;
}

.message-tools {
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
    pointer-events: none;
    transition: opacity 0.12s ease;
}

.message-body:hover .message-tools,
.message-tools.picking,
.message-tools:focus-within {
    opacity: 1;
    pointer-events: auto;
}

.message-tool {
    padding: 1px 8px;
    border: 0;
    border-radius: 99px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 11.5px;
    cursor: pointer;
}

.message-tool:hover {
    background: var(--hover);
    color: var(--text);
}

.message-worker {
    display: block;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11.5px;
    cursor: pointer;
}

.message-worker {
    margin-bottom: 3px;
}

.message-worker:hover {
    color: var(--text);
}

.message-card:has(.message-quote) {
    min-width: 180px;
}

.message-quote {
    display: -webkit-box;
    overflow: hidden;
    box-sizing: border-box;
    width: 0;
    min-width: 100%;
    margin: 0 0 6px;
    padding: 2px 0 2px 9px;
    border-left: 2px solid var(--accent);
    color: var(--text-3);
    font-size: 12px;
    white-space: pre-wrap;
    cursor: pointer;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.message-quote :deep(p) {
    margin: 0;
}

.message-quote:hover {
    color: var(--text-2);
}

.message-card :deep(pre) {
    overflow-x: auto;
    max-width: 100%;
}

.message-card :deep(code) {
    overflow-wrap: anywhere;
}

.message-card {
    min-width: 0;
    max-width: 100%;
    padding: 9px 12px;
    border: 1px solid transparent;
    border-radius: 10px;
    background: var(--bubble);
    line-height: 1.5;
    overflow-wrap: anywhere;
}

.message[data-from="user"] .message-card {
    background: color-mix(in srgb, var(--accent) 17%, var(--bg));
}

.message[data-from="user"] .message-card.comment {
    background: color-mix(in srgb, var(--blocking) 9%, var(--bubble));
}

.message-comment-head {
    display: flex;
    gap: 5px;
    align-items: center;
    margin: 0 0 6px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--blocking);
    font: inherit;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
}

.message-card :deep(pre) {
    max-width: 100%;
    padding: 8px 10px;
    border-radius: 8px;
    background: var(--code-bg);
    white-space: pre;
    overflow-wrap: normal;
}

.message-card :deep(pre code) {
    white-space: pre;
    overflow-wrap: normal;
}

.message-card :deep(p) {
    margin: 0;
    white-space: pre-wrap;
}

.message-card :deep(p + p),
.message-card :deep(ul),
.message-card :deep(ol) {
    margin-top: 6px;
}

.message-card :deep(ul),
.message-card :deep(ol) {
    margin-bottom: 0;
    padding-left: 20px;
}

.message-card :deep(code) {
    padding: 0.05em 0.42em;
    border-radius: 4px;
    background: var(--code-bg);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 0.9em;
    white-space: nowrap;
}

.message-card :deep(pre code) {
    padding: 0;
    background: none;
    white-space: inherit;
}

.message-files {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.message-image img {
    display: block;
    max-width: 260px;
    max-height: 200px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
}

.message-file {
    padding: 3px 10px;
    border: 1px solid var(--border-2);
    border-radius: 999px;
    color: var(--text-2);
    font-size: 12px;
}

.message-foot {
    display: flex;
    gap: 6px;
    align-items: center;
    margin: 0 2px;
}

.message-time {
    color: var(--text-3);
    font-size: 11px;
}

.message-id,
.message-dot {
    color: var(--text-4);
    font-size: 11px;
}

.message[data-from="user"] .message-dot {
    order: -1;
}

.message[data-from="user"] .message-id {
    order: -2;
}

.message-flowchart {
    margin-top: 6px;
    padding: 3px 10px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--surface);
    color: inherit;
    font-size: 12.5px;
    cursor: pointer;
}
</style>
