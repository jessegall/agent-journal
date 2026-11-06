<script setup>
import {onUnmounted} from "vue";
import {MarkBody, markDeclaration, useWindow} from "@journal/window-kit";

// a question opened from the chat, drawn over the chat with its options, as version 4 did; a click beside it, escape or its answer closes it
const QUESTION_MARK = "questions.question";
const OPEN_STATE = "open";
const ANSWERED_PAUSE_MILLISECONDS = 450;
const props = defineProps({id: {type: Number, required: true}});
const emit = defineEmits(["close"]);
const window = useWindow();

async function closeOnceSettled() {
    const answer = await window.readKey(`question.${props.id}`);
    if (answer.ok && answer.value.state !== OPEN_STATE) setTimeout(() => emit("close"), ANSWERED_PAUSE_MILLISECONDS);
}

const closeOnEscape = (event) => event.key === "Escape" && emit("close");
globalThis.addEventListener("keydown", closeOnEscape);
onUnmounted(() => globalThis.removeEventListener("keydown", closeOnEscape));
window.follow(["question.*"], closeOnceSettled);
</script>

<template>
    <div class="question-layer" data-question-overlay>
        <div class="question-veil" data-question-veil @click="emit('close')" />
        <div class="question-sheet">
            <MarkBody :declaration="markDeclaration(QUESTION_MARK) || {}" :mark="{id: 0, type: QUESTION_MARK, target_model: 'question', target_id: id}" shown />
        </div>
    </div>
</template>

<style scoped>
.question-layer {
    position: absolute;
    z-index: 21;
    display: grid;
    inset: 0;
    padding: 16px;
    place-items: center;
}

.question-veil {
    position: absolute;
    inset: 0;
    background: color-mix(in srgb, var(--bg) 55%, transparent);
    backdrop-filter: blur(6px) saturate(0.8);
}

.question-sheet {
    position: relative;
    overflow-y: auto;
    box-sizing: border-box;
    width: min(640px, 100%);
    max-height: 100%;
}
</style>
