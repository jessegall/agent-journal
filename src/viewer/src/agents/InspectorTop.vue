<script setup>
import CloseButton from "../kit/CloseButton.vue";

const emit = defineEmits(["close"]);
</script>

<template>
    <div class="top">
        <span class="crumb"><slot /></span>
        <CloseButton title="Close the inspector" @click="emit('close')" />
    </div>
</template>

<style scoped>
.top {
    display: flex;
    flex: none;
    align-items: center;
    gap: 4px;
    height: 44px;
    padding: 0 8px 0 24px;
    color: var(--text-3);
    font-size: 12px;
}

.crumb {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 6px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
