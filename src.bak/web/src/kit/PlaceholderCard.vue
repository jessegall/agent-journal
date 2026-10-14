<script setup>
const emit = defineEmits(["click"]);
</script>

<template>
    <button type="button" class="placeholder-card" @click="emit('click')"><slot /></button>
</template>

<style scoped>
.placeholder-card {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    min-height: 44px;
    padding: 10px 12px;
    border: 1px dashed var(--border-2);
    border-radius: 9px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
    transition:
        border-color 0.15s,
        color 0.15s,
        background 0.15s;
}

.placeholder-card:hover {
    border-color: var(--accent);
    background: var(--hover);
    color: var(--text);
}
</style>
