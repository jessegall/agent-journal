<template>
    <span class="working-dots" aria-hidden="true">
        <i />
        <i />
        <i />
    </span>
</template>

<style scoped>
.working-dots {
    display: inline-flex;
    gap: 3px;
}

.working-dots i {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--accent-text);
    opacity: 0.5;
    animation: working-dot 1.2s ease-in-out infinite;
}

.working-dots i:nth-child(2) {
    animation-delay: 0.15s;
}

.working-dots i:nth-child(3) {
    animation-delay: 0.3s;
}

@keyframes working-dot {
    50% {
        opacity: 1;
        translate: 0 -2px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .working-dots i {
        animation: none;
    }
}
</style>
