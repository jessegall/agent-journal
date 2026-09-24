<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {peek} from "../route.js";
import {meta} from "../state/store.js";

const props = defineProps({file: Object});
const kind = computed(() => meta(props.file.type));
const named = computed(() => props.file.title || `${kind.value.title} ${props.file.n}`);
</script>

<template>
    <button
        type="button"
        class="file-source"
        :title="`Attached to ${kind.title.toLowerCase()} ${file.n}: ${named}`"
        @click="peek(file.type, file.n)"
    >
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
