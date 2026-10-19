<script setup>
import {meta} from "../domain/tables.js";
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {peekRef} from "../route.js";

const props = defineProps({file: Object});
const table = computed(() => props.file.row.split(":")[0]);
const kind = computed(() => meta(table.value));
const named = computed(() => props.file.title || props.file.row);
</script>

<template>
    <button type="button" class="file-source" :title="`Attached to ${kind.title.toLowerCase()} ${file.row.split(':')[1]}: ${named}`" @click="peekRef(file.row)">
        <Icon :name="kind.icon" :size="11" />
        <span class="file-source-title">{{ named }}</span>
    </button>
</template>

<style scoped>
.file-source {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-width: 0;
    max-width: 100%;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11.5px;
    text-align: left;
    cursor: pointer;
}

.file-source:hover {
    color: var(--accent-text);
}

.file-source .ico {
    flex: none;
}

.file-source-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
