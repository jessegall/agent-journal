<script setup>
defineProps({file: {type: Object, required: true}, lines: {type: Number, default: 1}});
</script>

<template>
    <span :class="['tags', {empty: !file.description, clamped: lines > 1}]" :style="{'--lines': lines}">
        {{ file.description || "No description" }}
    </span>
</template>

<style scoped>
.tags,
.editor {
    display: block;
    width: 100%;
    min-width: 0;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    text-align: left;
}

.tags {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: text;
}

.tags.clamped {
    display: -webkit-box;
    white-space: normal;
    -webkit-line-clamp: var(--lines);
    -webkit-box-orient: vertical;
}

.tags.empty {
    color: var(--text-3);
}

.editor {
    outline: none;
    box-shadow: 0 1px 0 var(--accent-text);
}
</style>
