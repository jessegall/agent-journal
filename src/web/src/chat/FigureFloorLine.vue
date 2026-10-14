<script setup>
defineProps({floor: {type: Object, required: true}});
</script>

<template>
    <div class="figure-floor-line" :data-kind="floor.kind" :style="{left: `${floor.left}px`, top: `${floor.top}px`, width: `${floor.right - floor.left}px`}">
        <span class="figure-floor-name">{{ floor.kind }}</span>
    </div>
</template>

<style scoped>
.figure-floor-line {
    position: fixed;
    height: 0;
    border-top: 2px dashed var(--accent);
    pointer-events: none;
}

.figure-floor-line[data-kind="bubble"],
.figure-floor-line[data-kind="tab"] {
    border-top-color: var(--text-3);
}

.figure-floor-line[data-kind="foot"] {
    border-top-style: dotted;
}

.figure-floor-name {
    position: absolute;
    left: 4px;
    top: -16px;
    padding: 0 4px;
    border-radius: 4px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 10px;
}
</style>
