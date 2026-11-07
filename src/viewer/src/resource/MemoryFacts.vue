<script setup>
import {ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import TextInput from "../kit/TextInput.vue";

// the words that give a memory back to an agent that names them, added and taken off here
const props = defineProps({id: {type: Number, required: true}, read: {type: Function, required: true}});
const rows = ref([]);
const word = ref("");
const refusal = ref("");

async function load() {
    const answer = await props.read(["memory-keyword", "list", "--memory", String(props.id)]);
    rows.value = answer.ok ? answer.value.rows : [];
}

async function changed(line) {
    const answer = await props.read(line);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) load();
    return answer.ok;
}

async function add() {
    if (word.value.trim() && (await changed(["memory-keyword", "make", String(props.id), word.value.trim()]))) word.value = "";
}

watch(() => props.id, load, {immediate: true});
</script>

<template>
    <section class="memory-facts" data-memory-keywords>
        <p class="memory-label">Keywords</p>
        <template v-if="!rows.length">
            <p class="memory-none">No keywords: this memory comes back only as the conversation fills up.</p>
        </template>
        <div class="memory-words">
            <template v-for="row in rows" :key="row.id">
                <span class="memory-word" data-memory-word>{{ row.word }}<button type="button" class="memory-word-off" :aria-label="`Take off ${row.word}`" data-memory-word-off @click="changed(['memory-keyword', 'delete', String(row.id)])">×</button></span>
            </template>
        </div>
        <form class="memory-add" data-memory-word-form @submit.prevent="add">
            <TextInput v-model="word" class="memory-word-input" placeholder="Add a word" aria-label="Add a word" />
            <Btn small type="submit" :disabled="!word.trim()">Add</Btn>
        </form>
        <template v-if="refusal">
            <p class="memory-refusal" role="alert">{{ refusal }}</p>
        </template>
    </section>
</template>

<style scoped>
.memory-facts {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 14px;
}

.memory-label {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.memory-none {
    margin: 0;
    color: var(--text-2);
    font-size: 12.5px;
}

.memory-words,
.memory-add {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
}

.memory-word-input {
    flex: 1 1 140px;
}

.memory-word {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    padding: 1px 8px;
    border: 1px solid var(--border);
    border-radius: 10px;
    font-size: 12.5px;
}

.memory-word-off {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.memory-refusal {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
