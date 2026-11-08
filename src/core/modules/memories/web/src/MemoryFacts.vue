<script setup>
import {computed, ref, watch} from "vue";
import {Btn, InspectorPart, TextInput, eventMayBeChildOf, useWindow} from "@journal/window-kit";

// the words that give a memory back to an agent that names them, added and taken off here
const view = useWindow();
const row = view.option("row");
const key = computed(() => `keywords.${row.value.id}`);
const rows = computed(() => view.props[key.value].rows.value);
const word = ref("");
const refusal = ref("");

async function changed(line) {
    const answer = await view.run(line);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) view.reload(key.value);
    return answer.ok;
}

async function add() {
    if (word.value.trim() && (await changed(["memory-keyword", "make", String(row.value.id), word.value.trim()]))) word.value = "";
}

watch(key, (name) => view.reload(name), {immediate: true});
view.follow(["memory_keyword.*"], (event) => eventMayBeChildOf(event, "memory_id", new Set([row.value.id])) && view.reload(key.value));
</script>

<template>
    <InspectorPart title="Keywords">
        <section class="memory-facts" data-memory-keywords>
            <template v-if="!rows.length">
                <p class="memory-none">No keywords: this memory comes back only as the conversation fills up.</p>
            </template>
            <div class="memory-words">
                <template v-for="item in rows" :key="item.id">
                    <span class="memory-word" data-memory-word>{{ item.word }}<button type="button" class="memory-word-off" :aria-label="`Take off ${item.word}`" data-memory-word-off @click="changed(['memory-keyword', 'delete', String(item.id)])">×</button></span>
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
    </InspectorPart>
</template>

<style scoped>
.memory-facts {
    display: flex;
    flex-direction: column;
    gap: 6px;
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
