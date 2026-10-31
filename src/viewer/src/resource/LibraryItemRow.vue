<script setup>
import {computed} from "vue";
import Chip from "../kit/Chip.vue";

const props = defineProps({item: {type: Object, required: true}, version: {type: Object, required: true}, imported: {type: Number, default: 0}, on: Boolean});
const emit = defineEmits(["open"]);

const standing = computed(() => {
    if (!props.imported) return "";
    return props.imported < props.version.number ? `Imported: version ${props.imported}` : "Imported";
});
</script>

<template>
    <button type="button" :class="['library-row', {on}]" @click="emit('open')">
        <span class="library-row-text">
            <b>{{ item.name }}</b>
            <span>{{ item.description || version.note }}</span>
        </span>
        <Chip>{{ item.item_type }}</Chip>
        <span class="library-row-version">Version {{ version.number }}</span>
        <template v-if="standing">
            <Chip tone="accent">{{ standing }}</Chip>
        </template>
    </button>
</template>

<style scoped>
.library-row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px 14px;
    border: 0;
    border-top: 1px solid var(--border-3);
    background: none;
    color: inherit;
    text-align: left;
    font: inherit;
    cursor: pointer;
}

.library-row.on {
    background: var(--surface-2);
}

.library-row-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    color: var(--text-2);
}

.library-row-text b {
    color: var(--text);
}

.library-row-version {
    color: var(--text-2);
    white-space: nowrap;
}
</style>
