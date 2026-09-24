<script setup>
import {nextTick, onMounted, onUnmounted, ref, useSlots, watch} from "vue";
import Btn from "./Btn.vue";
import Icon from "./Icon.vue";

const props = defineProps({
    placeholder: String,
    action: {type: String, default: "Send"},
    locked: Boolean,
    fill: Boolean,
    limit: Number,
    withoutInput: Boolean,
    waiting: Boolean,
    echo: String,
    closable: Boolean,
    hint: String,
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
const added = new MutationObserver(() => ((pinned = true), follow()));

onMounted(() => (sized.observe(lines.value), sized.observe(log.value), added.observe(lines.value, {childList: true})));
onUnmounted(() => (sized.disconnect(), added.disconnect()));

function send() {
    if (props.locked || !words.value.trim()) return;
    emit("send", words.value.trim());
}

const MOST_LINES = 8;

function grow() {
    const box = input.value;
    if (!box) return;
    box.style.height = "auto";
    box.style.height = `${Math.min(box.scrollHeight, MOST_LINES * parseFloat(getComputedStyle(box).lineHeight))}px`;
}

watch(words, () => nextTick(grow));

const focusInput = () => input.value.focus();
const typing = () => !props.withoutInput && !props.waiting;
defineExpose({focus: () => nextTick(() => typing() && input.value && focusInput())});

const focusEntered = (el) => el === input.value && focusInput();
</script>

<template>
    <div :class="['chat', {fill}]">
        <Transition name="close-fade">
            <template v-if="closable">
                <button type="button" class="close" title="Cancel" @click="emit('close')">
                    <Icon name="close" />
                </button>
            </template>
        </Transition>
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
        <div class="hint-row">
            <Transition name="hint" mode="out-in">
                <template v-if="hint">
                    <em :key="hint" class="hint">{{ hint }}</em>
                </template>
            </Transition>
        </div>
        <div class="echo-slot">
            <Transition name="echo">
                <template v-if="echo && !waiting">
                    <p :key="echo" class="echo">{{ echo }}</p>
                </template>
            </Transition>
        </div>
        <div class="compose-slot">
            <Transition name="input-step" @after-enter="() => typing() && focusInput()">
                <template v-if="!withoutInput">
                    <form :class="['compose', {locked, waiting}]" @submit.prevent="send">
                        <Transition name="swap" mode="out-in" @after-enter="focusEntered">
                            <template v-if="waiting">
                                <span class="sent-line">{{ words }}</span>
                            </template>
                            <template v-else>
                                <textarea
                                    ref="input"
                                    v-model="words"
                                    rows="1"
                                    :placeholder="placeholder"
                                    :disabled="locked"
                                    :maxlength="limit || null"
                                    spellcheck="false"
                                    @input="grow"
                                    @keydown.enter.exact="!$event.isComposing && ($event.preventDefault(), send())"
                                />
                            </template>
                        </Transition>
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
    align-items: flex-end;
    gap: 10px;
    margin: 8px;
    padding: 5px 5px 5px 12px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--side);
    transition:
        background var(--fade),
        border-color var(--fade);
}

.compose:focus-within {
    border-color: var(--accent);
}

.left {
    align-self: center;
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

.close-fade-enter-active,
.close-fade-leave-active {
    transition: opacity var(--fade);
}

.close-fade-enter-from,
.close-fade-leave-to {
    opacity: 0;
}

.close:hover {
    background: var(--hover);
    color: var(--text);
}

.hint-row {
    flex: none;
    min-height: 0;
    margin: 0 20px;
    animation: fade-in var(--fade) 2s both;
}

.hint {
    display: block;
    margin-bottom: 6px;
    color: var(--text-4);
    font-size: 13px;
    line-height: 18px;
}

.hint-enter-active,
.hint-leave-active {
    transition:
        opacity var(--fade),
        transform var(--move);
}

.hint-enter-from {
    opacity: 0;
    transform: translateY(4px);
}

.hint-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

.echo-slot {
    display: flex;
    flex: none;
    justify-content: flex-end;
    min-height: 26px;
}

.chat:has(.close) .lines {
    padding-right: 48px;
}

.echo {
    align-self: flex-end;
    max-width: 80%;
    margin: 0 14px 8px;
    color: var(--text-3);
    font-size: 13px;
    font-style: italic;
    line-height: 18px;
    overflow-wrap: anywhere;
}

.echo-enter-active {
    transition: opacity var(--fade) 0.5s;
}

.echo-leave-active {
    transition: opacity var(--fade);
}

.echo-enter-from {
    opacity: 0;
}

.echo-leave-to {
    opacity: 0;
}

.compose-slot {
    display: grid;
    flex: none;
    min-height: 60px;
}

.compose-slot > .compose {
    grid-area: 1 / 1;
    align-self: end;
}

.input-step-enter-active {
    transition:
        opacity var(--fade),
        transform var(--move);
}

.input-step-leave-active {
    transition: opacity var(--fade) 0.15s;
}

.input-step-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.input-step-leave-to {
    opacity: 0;
}

.compose .left,
.compose > :deep(.btn) {
    transition: opacity var(--fade);
}

.compose.waiting {
    border-color: transparent;
    background: transparent;
}

.compose.waiting .left,
.compose.waiting > :deep(.btn) {
    opacity: 0;
    pointer-events: none;
}

.sent-line {
    flex: 1;
    min-width: 0;
    height: 32px;
    overflow: hidden;
    color: var(--text-3);
    font-size: 14px;
    line-height: 32px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.swap-enter-active,
.swap-leave-active {
    transition: opacity var(--fade);
}

.swap-enter-from,
.swap-leave-to {
    opacity: 0;
}

.compose.locked {
    opacity: 0.5;
}

.compose textarea {
    flex: 1;
    min-width: 0;
    height: 32px;
    padding: 6px 0;
    border: 0;
    outline: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 14px;
    line-height: 20px;
    resize: none;
}

.compose textarea::placeholder {
    color: var(--text-4);
}
</style>
