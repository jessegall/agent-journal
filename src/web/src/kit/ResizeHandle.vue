<script setup>
import {ref} from "vue";

const props = defineProps({min: {type: Number, default: 240}, max: {type: Number, default: 720}, snap: {type: Number, default: 16}});
const emit = defineEmits(["resize", "reset"]);
const snapped = ref(false);

function natural(panel) {
    const set = panel.style.width;
    panel.style.width = "";
    const width = panel.getBoundingClientRect().width;
    panel.style.width = set;
    return width;
}

function start(event) {
    const panel = event.currentTarget.nextElementSibling;
    const from = event.clientX;
    const began = panel.getBoundingClientRect().width;
    const home = natural(panel);
    const move = (moved) => {
        const width = Math.min(props.max, Math.max(props.min, began + from - moved.clientX));
        snapped.value = Math.abs(width - home) <= props.snap;
        emit("resize", snapped.value ? home : width);
    };
    const stop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
        document.body.classList.remove("resizing");
        if (snapped.value) emit("reset");
        snapped.value = false;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    document.body.classList.add("resizing");
    event.preventDefault();
}
</script>

<template>
    <div
        :class="['resize-handle', {snapped}]"
        role="separator"
        aria-orientation="vertical"
        title="Drag to resize; double-click to reset"
        @pointerdown="start"
        @dblclick="emit('reset')"
    />
</template>

<style scoped>
.resize-handle {
    position: relative;
    z-index: 3;
    flex: none;
    width: 7px;
    margin: 0 -3px;
    cursor: col-resize;
    touch-action: none;
}

.resize-handle::after {
    content: "";
    position: absolute;
    inset: 0 3px;
    background: transparent;
    transition: background 0.15s;
}

.resize-handle:hover::after {
    background: var(--border-3);
}

.resize-handle.snapped::after {
    background: var(--accent);
}
</style>

<style>
body.resizing {
    cursor: col-resize;
    user-select: none;
}
</style>
