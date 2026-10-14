<script setup>
import Icon from "../kit/Icon.vue";

defineProps({
    icon: {type: String, required: true},
    label: {type: String, required: true},
    on: {type: Boolean, default: false},
});
</script>

<template>
    <button type="button" :class="['quick-row', {on}]">
        <Icon :name="icon" />
        <span class="quick-label">{{ label }}</span>
        <slot />
    </button>
</template>

<style scoped>
.quick-row {
    scroll-margin-block: 40px;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 38px;
    padding: 0 10px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}

.quick-row.on {
    background: var(--sel);
    color: var(--text);
}

.quick-row .ico {
    flex: none;
    width: 14px;
    height: 14px;
    color: var(--text-3);
}

.quick-row.on .ico {
    color: var(--accent-text);
}

.quick-label {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
