<script setup>
defineProps({kind: {type: String, default: "ghost"}, small: Boolean});
</script>

<template>
    <button type="button" :class="['btn', kind, {small}]"><slot /></button>
</template>

<style scoped>
.btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 28px;
    padding: 0 11px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: transparent;
    color: var(--text-2);
    font-size: 12.5px;
    cursor: pointer;
    white-space: nowrap;
}

.btn :deep(.ico) {
    width: 12px;
    height: 12px;
}
.btn:hover {
    background: var(--hover);
    color: var(--text);
}
.btn.primary {
    border-color: var(--accent);
    background: var(--accent-dim);
    color: var(--accent-text);
}
.btn.primary:hover {
    background: var(--accent);
    color: #fff;
}
.btn.danger:hover {
    border-color: var(--danger);
    color: var(--danger);
}
.btn.icon {
    height: auto;
    padding: 5px;
    border-color: transparent;
}
.btn.small {
    height: 24px;
    padding: 0 9px;
    font-size: 12px;
}
</style>
