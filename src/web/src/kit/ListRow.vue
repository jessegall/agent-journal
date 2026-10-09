<script setup>
defineProps({title: {type: String, required: true}, label: {type: String, default: ""}});
defineEmits(["open"]);
</script>

<template>
    <div class="list-row">
        <button type="button" class="list-row-title" :title="label || undefined" @click="$emit('open')">{{ title }}</button>
        <slot name="side" />
        <slot />
    </div>
</template>

<style scoped>
.list-row {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid var(--line, #e5e5e5);
}

.list-row-title {
    flex: 1;
    min-width: 0;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.list-row :slotted(.list-row-note) {
    font-size: 12px;
    opacity: 0.7;
}

.list-row :slotted(.list-row-line) {
    flex-basis: 100%;
    font-size: 12px;
    opacity: 0.7;
}

.list-row :slotted(.list-row-bar) {
    flex-basis: 100%;
}

.list-row :slotted(.list-row-link) {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
}
</style>
