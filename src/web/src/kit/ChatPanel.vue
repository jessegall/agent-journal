<script setup>
import {nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import Btn from "./Btn.vue";

const props = defineProps({
    placeholder: String,
    action: {type: String, default: "Send"},
    locked: Boolean,
    limit: Number,
});
const emit = defineEmits(["send"]);
const words = defineModel({type: String, default: ""});
const log = ref(null);
const lines = ref(null);
const input = ref(null);
const NEAR = 24;
let pinned = true;
const follow = () => pinned && (log.value.scrollTop = log.value.scrollHeight);
const watchScroll = () => (pinned = log.value.scrollHeight - log.value.scrollTop - log.value.clientHeight < NEAR);
const sized = new ResizeObserver(follow);
const added = new MutationObserver(() => ((pinned = true), follow()));

onMounted(() => (sized.observe(lines.value), sized.observe(log.value), added.observe(lines.value, {childList: true, subtree: true})));
onUnmounted(() => (sized.disconnect(), added.disconnect()));

function send() {
    if (props.locked || !words.value.trim()) return;
    emit("send", words.value.trim());
}

const MOST_LINES = 6;

function grow() {
    const box = input.value;
    if (!box) return;
    box.style.height = "auto";
    box.style.height = `${Math.min(box.scrollHeight, MOST_LINES * parseFloat(getComputedStyle(box).lineHeight))}px`;
}

watch(words, () => nextTick(grow));

defineExpose({focus: () => nextTick(() => input.value && input.value.focus())});
</script>

<template>
    <div class="chat">
        <template v-if="$slots.head">
            <slot name="head" />
        </template>
        <div ref="log" class="log" role="log" @scroll="watchScroll">
            <div ref="lines" class="lines">
                <slot />
            </div>
        </div>
        <div class="row">
            <slot name="row" />
        </div>
        <form :class="['compose', {locked}]" @submit.prevent="send">
            <template v-if="$slots.tool">
                <span class="tool">
                    <slot name="tool" />
                </span>
            </template>
            <textarea
                ref="input"
                v-model="words"
                rows="1"
                :placeholder="placeholder"
                :aria-label="placeholder"
                :disabled="locked"
                :maxlength="limit || null"
                spellcheck="false"
                @input="grow"
                @keydown.enter.exact="!$event.isComposing && ($event.preventDefault(), send())"
            />
            <span class="tail">
                <template v-if="limit && words.length > limit * 0.8">
                    <span class="left">{{ limit - words.length }}</span>
                </template>
                <Btn kind="primary" small :disabled="locked || !words.trim()" @click="send">{{ action }}</Btn>
            </span>
        </form>
    </div>
</template>

<style scoped>
.chat {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 1px solid var(--border-2);
    border-radius: 16px;
    background: rgba(24, 25, 28, 0.94);
    backdrop-filter: blur(20px);
    box-shadow: 0 28px 80px rgba(0, 0, 0, 0.55);
}

.log {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: none;
}

.lines {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 10px;
    min-height: 100%;
    padding: 16px 16px 6px;
    box-sizing: border-box;
}

.row {
    position: relative;
    flex: none;
    height: var(--chat-row, 36px);
    margin: 0 8px;
}

.compose {
    display: flex;
    flex: none;
    align-items: flex-end;
    gap: 10px;
    margin: 0 8px 8px;
    padding: 5px 5px 5px 12px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--side);
    transition:
        opacity 0.18s ease-out,
        border-color 0.18s ease-out;
}

.compose:focus-within {
    border-color: var(--accent);
}

.compose.locked {
    opacity: 0.5;
}

.tool {
    display: flex;
    flex: none;
    align-items: center;
    height: 32px;
}

.tail {
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
    height: 32px;
}

.left {
    color: var(--text-4);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
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
    overflow: hidden;
    color: var(--text-4);
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
