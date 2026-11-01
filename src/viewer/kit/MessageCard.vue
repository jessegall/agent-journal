<script setup>
import {computed} from "vue";
import ReadTicks from "../src/kit/ReadTicks.vue";
import {clock} from "../src/format/time.js";
import {render} from "../src/text/index.js";

// one message of the chat as version 4 drew it: a soft rounded card, the user's tinted and set to the right, the agent's to the left,
// the text read as markdown (inline code, lists, bold), and the time under the card
const props = defineProps({message: {type: Object, required: true}});
const html = computed(() => render(props.message.text ?? "", {env: "", rowNames: false}));
const IMAGE = /\.(png|jpe?g|gif|webp|svg|bmp)$/i;
const addressOf = (name) => `/api/files/message/${props.message.id}/${encodeURIComponent(name)}`;
const files = computed(() => (props.message.files ?? []).map((name) => ({name, address: addressOf(name), isImage: IMAGE.test(name)})));
const time = computed(() => clock(new Date(props.message.created_at).getTime() / 1000 || props.message.created_at));
</script>

<template>
    <article class="message" data-message :data-from="message.type" :data-ref="`message:${message.id}`">
        <div class="message-card md" v-html="html" />
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
