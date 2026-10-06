<script setup>
defineProps({expanded: Boolean, small: Boolean});
const emit = defineEmits(["click"]);
</script>

<template>
    <button type="button" :class="['setting-how', {small}]" :aria-expanded="expanded" @click="emit('click')">How it works</button>
</template>

<style scoped>
.setting-how {
    margin-left: 6px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.setting-how:hover {
    color: var(--text);
}

.setting-how.small {
    margin-left: 2px;
    color: var(--text-3);
    font-size: 11.5px;
    font-weight: 400;
}
</style>
