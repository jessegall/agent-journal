<script setup>
import {computed} from "vue";
import {clock} from "../src/format/time.js";
import {render} from "../src/text/index.js";

// one message of the chat as version 4 drew it: a soft rounded card, the user's tinted and set to the right, the agent's to the left,
// the text read as markdown (inline code, lists, bold), and the time under the card
const props = defineProps({message: {type: Object, required: true}});
const html = computed(() => render(props.message.text ?? "", {env: "", rowNames: false}));
const time = computed(() => clock(new Date(props.message.created_at).getTime() / 1000 || props.message.created_at));
</script>

<template>
    <article class="message" data-message :data-from="message.type" :data-ref="`message:${message.id}`">
        <div class="message-card md" v-html="html" />
        <time class="message-time">{{ time }}</time>
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

.message-card {
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

.message-time {
    margin: 0 2px;
    color: var(--text-4);
    font-size: 11px;
}
</style>
