<script setup>
defineProps({inline: Boolean});
</script>

<template>
    <div :class="['inspector-actions', {inline}]" data-inspector-actions><slot /></div>
</template>

<style scoped>
.inspector-actions { display: flex; flex: none; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 8px; padding: 8px 16px; border-bottom: 1px solid var(--border); background: var(--raised); }
.inspector-actions:not(:has(button, a, input)) { display: none; }
.inspector-actions.inline { padding: 0; border: 0; background: none; }
</style>
