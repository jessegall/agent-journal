<script setup>
defineOptions({inheritAttrs: false});
</script>

<template>
    <textarea class="text-area" spellcheck="false" v-bind="$attrs" />
</template>

<style scoped>
.text-area {
    box-sizing: border-box;
    width: 100%;
    min-height: 140px;
    padding: 8px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    line-height: 1.5;
    resize: vertical;
}

.text-area:focus {
    border-color: var(--accent);
    outline: none;
}

.text-area:disabled {
    color: var(--text-3);
}

.text-area::placeholder {
    color: var(--text-4);
}
</style>
