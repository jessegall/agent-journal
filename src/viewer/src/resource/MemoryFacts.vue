<script setup>
import {ref, watch} from "vue";

// the words that give a memory back to an agent that names them
const props = defineProps({id: {type: Number, required: true}, read: {type: Function, required: true}});
const words = ref([]);

async function load() {
    const answer = await props.read(["memory-keyword", "list", "--memory-id", String(props.id)]);
    words.value = answer.ok ? answer.value.rows.map((row) => row.word) : [];
}

watch(() => props.id, load, {immediate: true});
</script>

<template>
    <template v-if="words.length">
        <section class="memory-facts" data-memory-keywords>
            <p class="memory-label">Keywords</p>
            <p class="memory-words">{{ words.join(", ") }}</p>
        </section>
    </template>
</template>

<style scoped>
.memory-facts {
    margin-top: 14px;
}

.memory-label {
    margin: 0 0 2px;
    color: var(--text-3);
    font-size: 12px;
}

.memory-words {
    margin: 0;
    font-size: 13px;
}
</style>
