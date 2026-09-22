<script setup>
import CloseButton from "../kit/CloseButton.vue";
import {ref} from "vue";
import {api} from "../api/client.js";
import {route} from "../route.js";

const props = defineProps({notice: Object});

const forcing = ref(false);

async function force() {
    forcing.value = true;
    try {
        await api.forceAgent(props.notice.data.session);
    } catch (e) {
        forcing.value = false;
    }
}

const answering = ref(false);

async function permit(allow) {
    answering.value = true;
    try {
        await api.permitAgent(props.notice.data.session, allow);
    } catch (e) {
        answering.value = false;
    }
}

async function close() {
    await api.act("notice", props.notice.n, "close");
}
</script>

<template>
    <div :class="['chat-notice', `tone-${notice.data.tone || 'note'}`]">
        <span class="chat-notice-dot" />
        <span class="chat-notice-text">{{ notice.title }}</span>
        <template v-if="notice.data.link">
            <a class="chat-notice-go" :href="notice.data.link" target="_blank" rel="noopener">{{ notice.data.label || "open" }}</a>
        </template>
        <template v-if="notice.data.action === 'permission' && notice.data.session">
            <button type="button" class="chat-notice-go" :disabled="answering" @click="permit(true)">Allow</button>
            <button type="button" class="chat-notice-go" :disabled="answering" @click="permit(false)">Deny</button>
        </template>
        <template v-else-if="notice.data.action && notice.data.session">
            <button type="button" :class="['chat-notice-go', {forcing}]" :disabled="forcing" @click="force">
                {{ forcing ? "Forcing" : "Force now" }}
            </button>
        </template>
        <CloseButton title="Close this" @click="close" />
    </div>
</template>

<style scoped>
.chat-notice {
    --tone: #4fc3d7;

    flex: none;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 14px 7px 11px;
    border-bottom: 1px solid var(--border);
    border-left: 3px solid var(--tone);
    background: color-mix(in srgb, var(--tone) 14%, var(--bg));
    color: var(--text);
    font-size: 12px;
}

.chat-notice-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--tone);
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
    border: 1px solid color-mix(in srgb, var(--tone) 55%, transparent);
    border-radius: 6px;
    background: color-mix(in srgb, var(--tone) 22%, transparent);
    color: var(--text);
    font-size: 11.5px;
}

.chat-notice-go:hover {
    background: color-mix(in srgb, var(--tone) 38%, transparent);
    color: #fff;
}

.chat-notice-x .ico {
    width: 11px;
    height: 11px;
}

.chat-notice.tone-good {
    --tone: var(--tone-good);
}

.chat-notice.tone-warn {
    --tone: var(--tone-warn);
}

.chat-notice-go.forcing {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    opacity: 0.75;
    cursor: default;
}

.chat-notice-go.forcing::after {
    content: "";
    width: 8px;
    height: 8px;
    border: 1.5px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: forcing 0.8s linear infinite;
}

@keyframes forcing {
    to {
        transform: rotate(360deg);
    }
}
</style>
