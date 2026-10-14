<script setup>
defineProps({label: {type: String, required: true}});
const emit = defineEmits(["press"]);
</script>

<template>
    <button type="button" class="new-button" @click="emit('press')">
        <span class="new-plus" aria-hidden="true">+</span>
        {{ label }}
    </button>
</template>

<style scoped>
.new-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-weight: 600;
}

.new-plus {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    font-size: 1.125rem;
    line-height: 1;
}
</style>
