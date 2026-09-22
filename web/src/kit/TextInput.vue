<template>
    <input class="text-input" spellcheck="false" />
</template>

<style scoped>
.text-input {
    min-width: 0;
    padding: 6px 9px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
}

.text-input:focus {
    outline: none;
    border-color: var(--accent);
}
</style>
