<script setup>
const shapes = [
    [46, 38],
    [30, 22],
    [58, 64],
    [40, 30],
    [34, 22],
    [62, 86],
    [26, 22],
    [50, 44],
    [38, 30],
    [56, 58],
    [30, 22],
    [44, 38],
    [60, 72],
    [36, 30],
];
</script>

<template>
    <div class="thread-skeleton" aria-label="Loading messages">
        <template v-for="([width, height], i) in shapes" :key="i">
            <div :class="['thread-shape', {mine: i % 3 === 1}]" :style="{width: `${width}%`, height: `${height}px`}" />
        </template>
    </div>
</template>

<style scoped>
.thread-skeleton {
    order: 1;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 8px;
    padding: 14px 8px 12px;
    overflow: hidden;
}

.thread-shape {
    flex: none;
    border-radius: 9px;
    background: linear-gradient(
            100deg,
            transparent 30%,
            color-mix(in srgb, var(--text-3) 12%, transparent) 50%,
            transparent 70%
        )
        0 0 / 300% 100%,
        color-mix(in srgb, var(--raised) 60%, transparent);
    animation: thread-shimmer 1.8s ease-in-out infinite;
}

.thread-shape.mine {
    align-self: flex-end;
}

@keyframes thread-shimmer {
    from {
        background-position:
            100% 0,
            0 0;
    }

    to {
        background-position:
            0 0,
            0 0;
    }
}
</style>
