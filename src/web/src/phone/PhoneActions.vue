<script setup>
import Icon from "../kit/Icon.vue";

const emit = defineEmits(["press"]);
</script>

<template>
    <button type="button" class="actions" aria-label="Message actions" @click="emit('press', $event)">
        <Icon name="dots" :size="14" />
    </button>
</template>

<style scoped>
.actions {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin: -14px -12px -14px -8px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
}
</style>
