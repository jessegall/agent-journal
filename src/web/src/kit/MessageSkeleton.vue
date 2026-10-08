<script setup>
const shapes = [
    {id: "shape-1", width: 46, height: 38, mine: false},
    {id: "shape-2", width: 30, height: 22, mine: true},
    {id: "shape-3", width: 58, height: 64, mine: false},
    {id: "shape-4", width: 40, height: 30, mine: false},
    {id: "shape-5", width: 34, height: 22, mine: true},
    {id: "shape-6", width: 62, height: 86, mine: false},
    {id: "shape-7", width: 26, height: 22, mine: false},
    {id: "shape-8", width: 50, height: 44, mine: true},
    {id: "shape-9", width: 38, height: 30, mine: false},
    {id: "shape-10", width: 56, height: 58, mine: false},
    {id: "shape-11", width: 30, height: 22, mine: true},
    {id: "shape-12", width: 44, height: 38, mine: false},
    {id: "shape-13", width: 60, height: 72, mine: false},
    {id: "shape-14", width: 36, height: 30, mine: true},
];
</script>

<template>
    <div class="thread-skeleton" aria-label="Loading messages">
        <template v-for="shape in shapes" :key="shape.id">
            <div :class="['thread-shape', {mine: shape.mine}]" :style="{width: `${shape.width}%`, height: `${shape.height}px`}" />
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
    background-color: color-mix(in srgb, var(--raised) 60%, transparent);
    background-image: linear-gradient(100deg, transparent 35%, color-mix(in srgb, var(--text-3) 22%, transparent) 50%, transparent 65%);
    background-size: 200vw 100%;
    background-repeat: no-repeat;
    background-attachment: fixed;
    animation: thread-shimmer 1.6s linear infinite;
}

.thread-shape.mine {
    align-self: flex-end;
}

@keyframes thread-shimmer {
    from {
        background-position: -100vw 0;
    }

    to {
        background-position: 100vw 0;
    }
}
</style>
