<script setup>
defineProps({html: {type: String, required: true}});
const emit = defineEmits(["go"]);
</script>

<template>
    <div class="thread-quote" title="Go to what this answers" @click.stop="emit('go')" v-html="html" />
</template>

<style scoped>
.thread-quote {
    cursor: pointer;
    width: 0;
    min-width: 100%;
    box-sizing: border-box;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    margin: 0 0 6px;
    padding: 2px 0 2px 9px;
    border-left: 2px solid var(--accent);
    color: var(--text-3);
    font-size: 12px;
    white-space: pre-wrap;
}

.thread-quote :deep(p) {
    margin: 0;
}

.thread-quote:hover {
    color: var(--text-2);
}
</style>
