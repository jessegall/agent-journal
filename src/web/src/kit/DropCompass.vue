<script setup>
defineProps({zone: {type: String, required: true}});
const CELLS = ["top", "left", "center", "right", "bottom"];
</script>

<template>
    <div class="drop-compass">
        <div :class="['drop-shade', zone]" />
        <div class="drop-cells">
            <template v-for="cell in CELLS" :key="cell">
                <div :class="['drop-cell', cell, {on: cell === zone}]"><i /></div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.drop-compass {
    position: absolute;
    inset: 0;
    z-index: 4;
    pointer-events: none;
    animation: drop-in 0.14s both;
}

.drop-shade {
    position: absolute;
    border: 1px solid color-mix(in srgb, var(--accent) 50%, transparent);
    border-radius: 6px;
    background: color-mix(in srgb, var(--accent) 14%, transparent);
    transition:
        left 0.16s var(--ease),
        top 0.16s var(--ease),
        width 0.16s var(--ease),
        height 0.16s var(--ease);
}

.drop-shade.center {
    top: 4px;
    left: 4px;
    width: calc(100% - 8px);
    height: calc(100% - 8px);
}

.drop-shade.left {
    top: 4px;
    left: 4px;
    width: calc(50% - 6px);
    height: calc(100% - 8px);
}

.drop-shade.right {
    top: 4px;
    left: calc(50% + 2px);
    width: calc(50% - 6px);
    height: calc(100% - 8px);
}

.drop-shade.top {
    top: 4px;
    left: 4px;
    width: calc(100% - 8px);
    height: calc(50% - 6px);
}

.drop-shade.bottom {
    top: calc(50% + 2px);
    left: 4px;
    width: calc(100% - 8px);
    height: calc(50% - 6px);
}

.drop-cells {
    position: absolute;
    top: 50%;
    left: 50%;
    display: grid;
    grid-template-columns: repeat(3, 26px);
    grid-template-rows: repeat(3, 26px);
    gap: 4px;
    transform: translate(-50%, -50%);
}

.drop-cell {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--border-3);
    border-radius: 5px;
    background: var(--raised);
    transition: border-color 0.15s;
}

.drop-cell i {
    position: absolute;
    border-radius: 2px;
    background: var(--border-3);
    transition: background 0.15s;
}

.drop-cell.on {
    border-color: var(--accent);
}

.drop-cell.on i {
    background: var(--accent);
}

.drop-cell.top {
    grid-area: 1 / 2;
}

.drop-cell.top i {
    inset: 3px 3px auto;
    height: 8px;
}

.drop-cell.left {
    grid-area: 2 / 1;
}

.drop-cell.left i {
    inset: 3px auto 3px 3px;
    width: 8px;
}

.drop-cell.center {
    grid-area: 2 / 2;
}

.drop-cell.center i {
    inset: 3px;
}

.drop-cell.right {
    grid-area: 2 / 3;
}

.drop-cell.right i {
    inset: 3px 3px 3px auto;
    width: 8px;
}

.drop-cell.bottom {
    grid-area: 3 / 2;
}

.drop-cell.bottom i {
    inset: auto 3px 3px;
    height: 8px;
}

@keyframes drop-in {
    from {
        opacity: 0;
    }
}
</style>
