<script setup>
defineProps({filled: Boolean, still: Boolean, bars: {type: Array, default: () => []}});
</script>

<template>
    <span class="skeleton-line">
        <slot />
        <span :class="['bars', {faded: filled}]">
            <template v-for="bar in bars" :key="bar.width">
                <span
                    :class="['bar', {still}]"
                    :style="{width: bar.width, height: `${bar.height}px`, borderRadius: `${bar.height / 2}px`}"
                />
            </template>
        </span>
    </span>
</template>

<style scoped>
.skeleton-line {
    display: grid;
    flex: none;
}

.skeleton-line > :deep(*) {
    grid-area: 1 / 1;
}

.bars {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    gap: 5px;
    height: 100%;
    padding: 2px 0;
    box-sizing: border-box;
    transition: opacity 0.18s;
}

.faded {
    opacity: 0;
}

.bar {
    display: block;
    background: linear-gradient(100deg, var(--border) 0%, var(--border) 40%, var(--border-2) 50%, var(--border) 60%, var(--border) 100%);
    background-attachment: fixed;
    background-size: 200vw 100%;
    animation: sweep 2s linear infinite;
}

.bar.still {
    background: var(--border);
    animation: none;
}

@keyframes sweep {
    0% {
        background-position: 100vw 0;
    }

    70%,
    100% {
        background-position: -100vw 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .bar {
        animation: none;
    }
}
</style>
