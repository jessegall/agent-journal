<script setup>
import Icon from "./Icon.vue";

defineProps({count: {type: Number, required: true}});
defineEmits(["jump"]);
</script>

<template>
    <button type="button" class="jump-pill" @click="$emit('jump')">
        <Icon name="down" :size="13" />
        Jump to latest
        <template v-if="count">
            <span class="jump-pill-new">· {{ count }} new</span>
        </template>
    </button>
</template>

<style scoped>
.jump-pill {
    position: absolute;
    bottom: 12px;
    left: 50%;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 30px;
    padding: 0 14px 0 12px;
    border: 1px solid var(--border-3);
    border-radius: 999px;
    background: var(--sel);
    color: var(--text);
    font-size: 12px;
    white-space: nowrap;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    transform: translateX(-50%);
    animation: jump-pill-in 0.2s both;
}

.jump-pill:hover {
    background: #272930;
}

.jump-pill :deep(.ico) {
    color: inherit;
}

.jump-pill-new {
    color: var(--text-3);
}

@keyframes jump-pill-in {
    from {
        opacity: 0;
    }
}
</style>
