<script setup>
import {computed, ref} from "vue";
import ReadTicks from "../src/kit/ReadTicks.vue";
import {clock} from "../src/format/time.js";
import {render} from "../src/text/index.js";
import {peekChip, peekRef} from "../src/route.js";
import "../src/text/all.js";

// one message of the chat as version 4 drew it: a soft rounded card, the user's tinted and set to the right, the agent's to the left,
// the text read as markdown (inline code, lists, bold), and the time under the card
const props = defineProps({message: {type: Object, required: true}});
const emit = defineEmits(["reply", "delete"]);
const copied = ref(false);
const deletable = computed(() => props.message.type === "user" && !props.message.read_at && !props.message.local);
async function copy() {
    await navigator.clipboard?.writeText(props.message.text ?? "");
    copied.value = true;
    setTimeout(() => (copied.value = false), COPIED_MS);
}
const html = computed(() => render(props.message.text ?? "", {env: ""}));
const COPIED_MS = 1500;
const IMAGE = /\.(png|jpe?g|gif|webp|svg|bmp)$/i;
const addressOf = (name) => `/api/files/message/${props.message.id}/${encodeURIComponent(name)}`;
const files = computed(() => (props.message.files ?? []).map((name) => ({name, address: addressOf(name), isImage: IMAGE.test(name)})));
const time = computed(() => clock(new Date(props.message.created_at).getTime() / 1000 || props.message.created_at));
</script>

<template>
    <article class="message" data-message :data-from="message.type" :data-ref="`message:${message.id}`">
        <template v-if="message.parent_id">
            <button type="button" class="message-reply" data-message-reply @click="peekRef(`messages:${message.parent_id}`)">Reply to message {{ message.parent_id }}</button>
        </template>
        <div class="message-body">
            <div class="message-card md" @click="peekChip" v-html="html" />
            <div class="message-tools" data-message-tools>
                <button type="button" class="message-tool" data-message-action="reply" @click="emit('reply', message)">Reply</button>
                <button type="button" class="message-tool" data-message-action="copy" @click="copy">{{ copied ? "Copied" : "Copy" }}</button>
                <template v-if="deletable">
                    <button type="button" class="message-tool" data-message-action="delete" title="Only while it is unread" @click="emit('delete', message)">Delete</button>
                </template>
            </div>
        </div>
        <template v-if="files.length">
            <div class="message-files" data-message-files>
                <template v-for="file in files" :key="file.name">
                    <template v-if="file.isImage">
                        <a :href="file.address" target="_blank" class="message-image" :title="file.name"><img :src="file.address" :alt="file.name"></a>
                    </template>
                    <template v-else>
                        <a :href="file.address" target="_blank" class="message-file">{{ file.name }}</a>
                    </template>
                </template>
            </div>
        </template>
        <div class="message-foot">
            <time class="message-time">{{ time }}</time>
            <template v-if="message.type === 'user'">
                <ReadTicks :message="message" />
            </template>
        </div>
    </article>
</template>

<style scoped>
.message {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
    max-width: min(78%, calc(100% - 48px));
}

.message[data-from="user"] {
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

.message-reply {
    padding: 0 2px;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11.5px;
    cursor: pointer;
}

.message-reply:hover {
    color: var(--text);
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

.message-card :deep(pre) {
    max-width: 100%;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
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
    background: var(--chip);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 0.9em;
    white-space: nowrap;
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
    gap: 4px;
    align-items: center;
    margin: 0 2px;
}

.message-time {
    color: var(--text-4);
    font-size: 11px;
}
</style>
