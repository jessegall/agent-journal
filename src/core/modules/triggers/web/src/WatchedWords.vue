<script setup>
import {ref} from "vue";
import {Icon} from "@journal/window-kit";

const props = defineProps({words: {type: Array, required: true}});
const emit = defineEmits(["words"]);
const typed = ref("");

function add() {
    const word = typed.value.trim();
    typed.value = "";
    if (word && !props.words.includes(word)) emit("words", [...props.words, word]);
}

const remove = (word) => emit("words", props.words.filter((held) => held !== word));
</script>

<template>
    <div class="words">
        <template v-for="word in words" :key="word">
            <span class="word">
                {{ word }}
                <button type="button" class="word-remove" :aria-label="`Remove ${word}`" @click="remove(word)"><Icon name="close" :size="11" /></button>
            </span>
        </template>
        <input v-model="typed" class="word-input" placeholder="Add a word, then Enter" aria-label="Add a word" data-trigger-word @keydown.enter.prevent="add" @blur="add">
    </div>
</template>

<style scoped>
.words {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    padding: 6px 8px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
}

.word {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    padding: 1px 4px 1px 8px;
    border-radius: 99px;
    background: var(--hover);
    font-size: 13px;
}

.word-remove {
    display: inline-grid;
    place-items: center;
    padding: 2px;
    border: 0;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.word-input {
    flex: 1;
    min-width: 140px;
    border: 0;
    outline: none;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 13px;
}
</style>
