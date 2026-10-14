<script setup>
import {ref} from "vue";
import {split} from "../domain/words.js";
import Chip from "./Chip.vue";

const props = defineProps({
    words: {type: Array, default: () => []},
    readonly: Boolean,
    placeholder: {type: String, default: ""},
    highlight: {type: Array, default: () => []},
});
const emit = defineEmits(["change"]);
const draft = ref("");

function add(text) {
    const fresh = split(text).filter((word) => !props.words.includes(word));
    draft.value = "";
    if (fresh.length) emit("change", [...props.words, ...fresh]);
}

const remove = (word) =>
    emit(
        "change",
        props.words.filter((w) => w !== word)
    );
const backspace = () => !draft.value && props.words.length && remove(props.words.at(-1));
</script>

<template>
    <div :class="['word-chips', {readonly}]">
        <template v-for="word in words" :key="word">
            <Chip :tone="highlight.includes(word) ? 'good' : ''" :removable="!readonly" :label="word" :title="word" @remove="remove(word)">
                {{ word }}
            </Chip>
        </template>
        <template v-if="!readonly">
            <input
                v-model="draft"
                class="word-chips-input"
                :placeholder="placeholder"
                aria-label="Add a word"
                @keydown.enter.prevent="add(draft)"
                @keydown.,.prevent="add(draft)"
                @keydown.delete="backspace"
                @paste.prevent="add($event.clipboardData.getData('text'))"
                @blur="add(draft)"
            />
        </template>
    </div>
</template>

<style scoped>
.word-chips {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    min-height: 36px;
    padding: 5px 6px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
}

.word-chips:focus-within {
    border-color: var(--accent);
}

.word-chips.readonly {
    background: none;
}

.word-chips-input {
    flex: 1;
    min-width: 140px;
    height: 24px;
    border: 0;
    outline: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
}
</style>
