<script setup>
import TipBubble from "./TipBubble.vue";

defineProps({text: {type: String, required: true}});
</script>

<template>
    <TipBubble class="hint-bubble" role="status" :title="text" arrow="calc(100% - 14px)" />
</template>

<style scoped>
.hint-bubble {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 5;
    max-width: 220px;
    pointer-events: none;
    animation: hint-in 90ms var(--ease) both;
}

@keyframes hint-in {
    from {
        opacity: 0;
        translate: 0 -3px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .hint-bubble {
        animation: none;
    }
}
</style>
