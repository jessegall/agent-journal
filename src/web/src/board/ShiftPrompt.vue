<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";

const props = defineProps({ask: Object});
const emit = defineEmits(["send", "close"]);
const text = ref("");
const QUESTIONS = {
    held: {title: "Why is it held?", word: "why", required: true},
    done: {title: "How did it land?", word: "how", required: false},
    todo: {title: "Why reopen it?", word: "why", required: true},
};
const question = computed(() => QUESTIONS[props.ask.lane]);
const ready = computed(() => !question.value.required || text.value.trim());

function send() {
    if (ready.value) emit("send", {[question.value.word]: text.value.trim()});
}
</script>

<template>
    <Dialog :title="question.title" @close="emit('close')">
        <p class="card">#{{ ask.card.n }} {{ ask.card.title }}</p>
        <input
            v-model="text"
            class="field"
            autofocus
            :placeholder="question.required ? 'A few words' : 'A few words, or leave it empty'"
            @keydown.enter="send"
            @keydown.esc="emit('close')"
        />
        <div class="actions">
            <Btn small @click="emit('close')">Cancel</Btn>
            <Btn kind="primary" small :disabled="!ready" @click="send">Move it</Btn>
        </div>
    </Dialog>
</template>

<style scoped>
.card {
    margin: 0 0 10px;
    color: var(--text-2);
    font-size: 12.5px;
}

.field {
    width: 100%;
    box-sizing: border-box;
    padding: 7px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    font-size: 13px;
}

.field:focus {
    border-color: var(--accent);
    outline: none;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px;
}
</style>
