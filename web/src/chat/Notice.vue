<script setup>
import {act, forceAgent} from "../api.js";
import Icon from "../kit/Icon.vue";
import {route} from "../route.js";

const props = defineProps({notice: Object});

async function force() {
    await forceAgent(route.value.env, props.notice.data.session);
}

async function close() {
    await act(route.value.env, "notice", props.notice.n, "close");
}
</script>

<template>
    <div :class="['chat-notice', `tone-${notice.data.tone || 'note'}`]">
        <span class="chat-notice-dot" />
        <span class="chat-notice-text">{{ notice.title }}</span>
        <template v-if="notice.data.link">
            <a class="chat-notice-go" :href="notice.data.link" target="_blank" rel="noopener">{{ notice.data.label || "open" }}</a>
        </template>
        <template v-if="notice.data.action && notice.data.session">
            <button type="button" class="chat-notice-go" @click="force">Force now</button>
        </template>
        <button type="button" class="chat-notice-x" title="Close this" @click="close"><Icon name="close" /></button>
    </div>
</template>

<style scoped>
.chat-notice {
    flex: none;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 14px;
    border-bottom: 1px solid var(--border);
    background: color-mix(in srgb, var(--accent) 10%, var(--bg));
    color: var(--text);
    font-size: 12px;
}

.chat-notice-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
}

.chat-notice-text {
    flex: 1;
    min-width: 0;
}

button.chat-notice-go {
    font: inherit;
    font-size: 11.5px;
    cursor: pointer;
}

.chat-notice-go {
    flex: none;
    padding: 3px 9px;
    border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
    border-radius: 6px;
    background: color-mix(in srgb, var(--accent) 18%, transparent);
    color: var(--text);
    font-size: 11.5px;
}

.chat-notice-go:hover {
    background: color-mix(in srgb, var(--accent) 30%, transparent);
    color: #fff;
}

.chat-notice-x {
    flex: none;
    padding: 2px 5px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
}

.chat-notice-x:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text);
}

.chat-notice-x .ico {
    width: 11px;
    height: 11px;
}

.chat-notice.tone-good {
    background: color-mix(in srgb, #3d7a4f 16%, var(--bg));
}

.chat-notice.tone-good .chat-notice-dot {
    background: #63b37c;
}

.chat-notice.tone-warn {
    background: color-mix(in srgb, #8a6a2f 18%, var(--bg));
}

.chat-notice.tone-warn .chat-notice-dot {
    background: #d8a94a;
}
</style>
