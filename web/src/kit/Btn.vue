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
    padding: 6px 12px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: transparent;
    color: var(--text-2);
    cursor: pointer;
    white-space: nowrap;
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
    padding: 5px;
    border-color: transparent;
}
.btn.small {
    padding: 3px 9px;
    font-size: 12px;
}
</style>
