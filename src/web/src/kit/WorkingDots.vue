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
    opacity: 0.3;
    animation: working-dot 2s ease-in-out infinite;
}

.working-dots i:nth-child(2) {
    animation-delay: 0.4s;
}

.working-dots i:nth-child(3) {
    animation-delay: 0.8s;
}

@keyframes working-dot {
    10% {
        opacity: 1;
    }

    20% {
        opacity: 0.3;
    }
}

@media (prefers-reduced-motion: reduce) {
    .working-dots i {
        animation: none;
    }
}
</style>
