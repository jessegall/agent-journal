<script setup>
import {shimmerStyle} from "./shimmerClock.js";

// a grey shape with a light band sweeping over it; its parent gives it the size and the corners
const SHIMMER_MS = 1600;
const shimmer = shimmerStyle(SHIMMER_MS);
</script>

<template>
    <span class="shimmer" :style="shimmer" />
</template>

<style scoped>
.shimmer {
    display: block;
    flex: none;
    max-width: 100%;
    background-color: color-mix(in srgb, var(--raised) 60%, transparent);
    background-image: linear-gradient(100deg, transparent 35%, color-mix(in srgb, var(--text-3) 22%, transparent) 50%, transparent 65%);
    background-size: 200vw 100%;
    background-repeat: no-repeat;
    background-attachment: fixed;
    animation: shimmer-sweep var(--shimmer-ms) linear infinite;
}

@keyframes shimmer-sweep {
    from {
        background-position: -100vw 0;
    }

    to {
        background-position: 100vw 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .shimmer {
        animation: none;
    }
}
</style>
