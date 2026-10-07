<script setup>
defineProps({text: {type: String, default: ""}});
</script>

<template>
    <pre class="term">{{ text }}</pre>
</template>

<style scoped>
.term {
    max-height: 60vh;
    margin: 0 0 14px;
    padding: 12px;
    overflow: auto;
    border-radius: 12px;
    background: var(--raised);
    color: var(--text-2);
    font: 0.75rem/1.45 ui-monospace, Menlo, monospace;
    white-space: pre-wrap;
    word-break: break-word;
}
</style>
