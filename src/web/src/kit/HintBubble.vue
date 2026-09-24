<script setup>
defineProps({text: {type: String, required: true}});
</script>

<template>
    <span class="hint-bubble" role="status">{{ text }}</span>
</template>

<style scoped>
.hint-bubble {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 5;
    width: max-content;
    max-width: 220px;
    padding: 7px 10px;
    border: 1px solid color-mix(in srgb, var(--accent) 45%, var(--border-2));
    border-radius: 8px;
    background: var(--raised);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.4);
    color: var(--text-2);
    font-size: 12px;
    line-height: 1.4;
    pointer-events: none;
    animation: hint-in var(--fade) var(--ease) both;
}

.hint-bubble::before {
    content: "";
    position: absolute;
    top: -5px;
    right: 9px;
    width: 8px;
    height: 8px;
    border-top: 1px solid color-mix(in srgb, var(--accent) 45%, var(--border-2));
    border-left: 1px solid color-mix(in srgb, var(--accent) 45%, var(--border-2));
    background: var(--raised);
    transform: rotate(45deg);
}

@keyframes hint-in {
    from {
        opacity: 0;
        transform: translateY(-4px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .hint-bubble {
        animation: none;
    }
}
</style>
