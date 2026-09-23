<script setup>
import {nextTick, ref, useSlots, watch} from "vue";
import Btn from "./Btn.vue";

const props = defineProps({placeholder: String, action: {type: String, default: "Send"}, locked: Boolean, grows: Number});
const emit = defineEmits(["send"]);
const words = defineModel({type: String, default: ""});
const log = ref(null);
const input = ref(null);
const actions = Boolean(useSlots().actions);
const still = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
let height = 0;

watch(
    () => props.grows,
    () =>
        nextTick(() => {
            if (log.value.scrollHeight > height) log.value.scrollTo({top: log.value.scrollHeight, behavior: still ? "auto" : "smooth"});
            height = log.value.scrollHeight;
        })
);

function send() {
    if (props.locked || !words.value.trim()) return;
    emit("send", words.value.trim());
}

defineExpose({focus: () => nextTick(() => input.value.focus())});
</script>

<template>
    <div class="chat">
        <div ref="log" class="log">
            <slot />
        </div>
        <template v-if="actions">
            <div class="actions">
                <slot name="actions" />
            </div>
        </template>
        <form :class="['compose', {locked}]" @submit.prevent="send">
            <input ref="input" v-model="words" :placeholder="placeholder" :disabled="locked" spellcheck="false" />
            <Btn kind="primary" small :disabled="locked || !words.trim()" @click="send">{{ action }}</Btn>
        </form>
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

.log {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
    overflow-y: auto;
    padding: 16px 16px 6px;
}

.log > :first-child {
    margin-top: auto;
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
