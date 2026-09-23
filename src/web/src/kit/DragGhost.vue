<script setup>
import Icon from "./Icon.vue";

defineProps({
    x: {type: Number, required: true},
    y: {type: Number, required: true},
    icon: {type: String, required: true},
    title: {type: String, required: true},
    hint: {type: String, default: ""},
});
</script>

<template>
    <div class="drag-ghost" :style="{left: `${x + 14}px`, top: `${y + 12}px`}">
        <Icon :name="icon" :size="13" />
        <span>{{ title }}</span>
        <span class="drag-ghost-hint">{{ hint }}</span>
    </div>
</template>

<style scoped>
.drag-ghost {
    position: fixed;
    z-index: 400;
    display: flex;
    align-items: center;
    gap: 6px;
    height: 26px;
    padding: 0 10px;
    border: 1px solid var(--border-3);
    border-radius: 6px;
    background: var(--sel);
    color: var(--text);
    font-size: 12px;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    animation: ghost-in 0.1s both;
}

.drag-ghost-hint {
    color: var(--text-3);
}

@keyframes ghost-in {
    from {
        opacity: 0;
    }
}
</style>

<style>
body.dragging-view,
body.dragging-view * {
    cursor: grabbing !important;
    user-select: none;
}
</style>
