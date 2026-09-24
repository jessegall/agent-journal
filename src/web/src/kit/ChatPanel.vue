<script setup>
import {nextTick, onMounted, onUnmounted, ref, useSlots} from "vue";
import Btn from "./Btn.vue";
import Icon from "./Icon.vue";

const props = defineProps({
    placeholder: String,
    action: {type: String, default: "Send"},
    locked: Boolean,
    fill: Boolean,
    limit: Number,
    withoutInput: Boolean,
    echo: String,
    closable: Boolean,
});
const emit = defineEmits(["send", "close"]);
const words = defineModel({type: String, default: ""});
const log = ref(null);
const lines = ref(null);
const input = ref(null);
const slots = useSlots();
const actions = Boolean(slots.actions);
const head = Boolean(slots.head);
const NEAR = 24;
let pinned = true;
const follow = () => pinned && (log.value.scrollTop = log.value.scrollHeight);
const watchScroll = () => (pinned = log.value.scrollHeight - log.value.scrollTop - log.value.clientHeight < NEAR);
const sized = new ResizeObserver(follow);

onMounted(() => (sized.observe(lines.value), sized.observe(log.value)));
onUnmounted(() => sized.disconnect());

function send() {
    if (props.locked || !words.value.trim()) return;
    emit("send", words.value.trim());
}

const focusInput = () => input.value.focus();
defineExpose({focus: () => nextTick(() => props.withoutInput || focusInput())});
</script>

<template>
    <div :class="['chat', {fill}]">
        <template v-if="closable">
            <button type="button" class="close" title="Cancel and start over" @click="emit('close')">
                <Icon name="close" />
            </button>
        </template>
        <template v-if="head">
            <slot name="head" />
        </template>
        <div ref="log" class="log" @scroll="watchScroll">
            <div ref="lines" class="lines">
                <slot />
            </div>
        </div>
        <template v-if="actions">
            <div class="actions">
                <slot name="actions" />
            </div>
        </template>
        <Transition name="echo">
            <template v-if="echo">
                <p :key="echo" :class="['echo', {low: withoutInput}]">{{ echo }}</p>
            </template>
        </Transition>
        <div class="compose-slot">
            <Transition name="input-step" @after-enter="focusInput">
                <template v-if="!withoutInput">
                    <form :class="['compose', {locked}]" @submit.prevent="send">
                        <input
                            ref="input"
                            v-model="words"
                            :placeholder="placeholder"
                            :disabled="locked"
                            :maxlength="limit"
                            spellcheck="false"
                        />
                        <template v-if="limit">
                            <span class="left">{{ limit - words.length }}</span>
                        </template>
                        <Btn kind="primary" small :disabled="locked || !words.trim()" @click="send">{{ action }}</Btn>
                    </form>
                </template>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
.chat {
    position: relative;
    display: flex;
    flex: none;
    flex-direction: column;
    align-self: center;
    width: min(680px, 100%);
    height: min(400px, 52vh);
    border: 1px solid var(--border-2);
    border-radius: 16px;
    background: rgba(24, 25, 28, 0.94);
    backdrop-filter: blur(20px);
    box-shadow: 0 28px 80px rgba(0, 0, 0, 0.55);
}

.chat.fill {
    align-self: stretch;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.log {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.lines {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 100%;
    padding: 16px 16px 6px;
    box-sizing: border-box;
}

.actions {
    position: relative;
    flex: none;
    height: 44px;
}

.compose {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 8px;
    padding: 5px 5px 5px 12px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--side);
}

.compose:focus-within {
    border-color: var(--accent);
}

.left {
    color: var(--text-4);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 7px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.close:hover {
    background: var(--hover);
    color: var(--text);
}

.echo {
    align-self: flex-end;
    max-width: 80%;
    margin: 0 12px 6px;
    color: var(--text-2);
    font-size: 14px;
    line-height: 20px;
    overflow-wrap: anywhere;
    transition: transform 0.26s cubic-bezier(0.2, 0.9, 0.25, 1);
}

.echo.low {
    transform: translateY(60px);
}

.echo-enter-active {
    transition: opacity 0.45s ease;
}

.echo-leave-active {
    transition: opacity 0.25s ease;
}

.echo-enter-from {
    opacity: 0;
}

.echo-leave-to {
    opacity: 0;
}

.compose-slot {
    position: relative;
    flex: none;
    height: 60px;
}

.compose-slot > .compose {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
}

.input-step-enter-active,
.input-step-leave-active {
    transition:
        opacity 0.22s ease,
        transform 0.26s cubic-bezier(0.2, 0.9, 0.25, 1);
}

.input-step-enter-from,
.input-step-leave-to {
    opacity: 0;
    transform: translateY(14px);
}

.compose.locked {
    opacity: 0.5;
}

.compose input {
    flex: 1;
    min-width: 0;
    height: 32px;
    border: 0;
    outline: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 14px;
}

.compose input::placeholder {
    color: var(--text-4);
}
</style>
