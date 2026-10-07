<template>
    <span class="wait-mark" role="img" aria-label="waiting" />
</template>

<style scoped>
.wait-mark {
    flex: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1.6px solid var(--accent-text);
    border-right-color: transparent;
    animation: wait-turn 2.4s linear infinite;
}

@keyframes wait-turn {
    to {
        transform: rotate(360deg);
    }
}

@media (prefers-reduced-motion: reduce) {
    .wait-mark {
        animation: none;
    }
}
</style>
