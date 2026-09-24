<script setup>
import {nextTick, onMounted, onUnmounted, ref, useSlots} from "vue";
import Btn from "./Btn.vue";

const props = defineProps({
    placeholder: String,
    action: {type: String, default: "Send"},
    locked: Boolean,
    fill: Boolean,
    limit: Number,
    withoutInput: Boolean,
});
const emit = defineEmits(["send"]);
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

defineExpose({focus: () => nextTick(() => input.value.focus())});
</script>

<template>
    <div :class="['chat', {fill}]">
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
        <template v-if="!withoutInput">
            <form :class="['compose', {locked}]" @submit.prevent="send">
                <input ref="input" v-model="words" :placeholder="placeholder" :disabled="locked" :maxlength="limit" spellcheck="false" />
                <template v-if="limit">
                    <span class="left">{{ limit - words.length }}</span>
                </template>
                <Btn kind="primary" small :disabled="locked || !words.trim()" @click="send">{{ action }}</Btn>
            </form>
        </template>
    </div>
</template>

<style scoped>
.chat {
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
