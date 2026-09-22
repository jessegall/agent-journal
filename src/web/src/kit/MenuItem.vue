<script setup>
defineProps({on: Boolean});
</script>

<template>
    <button type="button" :class="['menu-item', {on}]"><slot /></button>
</template>

<style scoped>
.menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
}

.menu-item:hover {
    background: var(--hover);
    color: var(--text);
}

.menu-item.on {
    background: color-mix(in srgb, var(--accent) 16%, transparent);
    color: var(--text);
}
</style>
