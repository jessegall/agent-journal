<script setup>
import Icon from "../kit/Icon.vue";

defineProps({files: {type: Array, required: true}});
const emit = defineEmits(["remove"]);
</script>

<template>
    <div class="dump-files">
        <template v-for="(file, i) in files" :key="file.name + i">
            <span class="dump-file">
                <Icon name="paperclip" :size="12" />
                {{ file.name }}
                <button type="button" class="dump-x" title="Leave this file out" @click="emit('remove', i)">×</button>
            </span>
        </template>
    </div>
</template>

<style scoped>
.dump-files {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.dump-file {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-2);
    font-size: 12px;
}

.dump-x {
    padding: 0;
    border: none;
    background: none;
    color: var(--text-4);
    cursor: pointer;
}

.dump-x:hover {
    color: var(--danger);
}
</style>
