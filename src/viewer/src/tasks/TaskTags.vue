<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";

defineProps({tags: {type: Array, required: true}});
const emit = defineEmits(["add", "remove"]);
const word = ref("");

function add() {
    const value = word.value.trim();
    if (!value) return;
    emit("add", value);
    word.value = "";
}
</script>

<template>
    <section class="task-tags" aria-label="Task tags">
        <div class="tags">
            <span v-for="tag in tags" :key="tag" class="tag" data-task-tag>
                {{ tag }}
                <button type="button" :aria-label="`Remove tag ${tag}`" :data-remove-tag="tag" @click="emit('remove', tag)">×</button>
            </span>
        </div>
        <form class="add-tag" @submit.prevent="add">
            <input v-model="word" aria-label="New tag" placeholder="New tag" pattern="[a-z0-9-]+" data-task-tag-input />
            <Btn small type="submit" :disabled="!word.trim()" data-task-tag-add>Add tag</Btn>
        </form>
    </section>
</template>

<style scoped>
.task-tags, .tags, .add-tag {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
}
.task-tags {
    margin-bottom: 14px;
}
.tag {
    padding: 2px 6px;
    border-radius: 8px;
    background: var(--hover);
    color: var(--text-2);
    font-size: 12px;
}
.tag button {
    border: 0;
    background: none;
    color: inherit;
    cursor: pointer;
}
.add-tag input {
    width: 110px;
    padding: 4px 6px;
    border: 1px solid var(--border);
    border-radius: 5px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    font-size: 12px;
}
</style>
