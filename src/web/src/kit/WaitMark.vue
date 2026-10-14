<template>
    <span class="wait-mark" role="img" aria-label="waiting" />
</template>

<style scoped>
.wait-mark {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--tone-warn);
    animation: wait-pulse 1.6s ease-in-out infinite;
}

@keyframes wait-pulse {
    0%,
    100% {
        box-shadow: 0 0 0 0 color-mix(in oklab, var(--tone-warn) 55%, transparent);
        opacity: 1;
    }

    50% {
        box-shadow: 0 0 0 5px transparent;
        opacity: 0.6;
    }
}

@media (prefers-reduced-motion: reduce) {
    .wait-mark {
        animation: none;
    }
}
</style>
