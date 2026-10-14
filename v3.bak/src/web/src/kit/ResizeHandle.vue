<script setup>
import {ref} from "vue";

const props = defineProps({
    min: {type: Number, default: 240},
    max: {type: Number, default: 720},
    snap: {type: Number, default: 16},
    axis: {type: String, default: "x"},
    measure: {type: Function, default: null},
});
const emit = defineEmits(["resize", "reset", "start", "stop"]);
const snapped = ref(false);

function natural(panel) {
    const set = panel.style.width;
    panel.style.width = "";
    const width = panel.getBoundingClientRect().width;
    panel.style.width = set;
    return width;
}

function track(event, sized) {
    const move = (moved) => {
        const got = sized(moved);
        snapped.value = got.snapped;
        emit("resize", got.value);
    };
    const stop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
        document.body.classList.remove("resizing", `resizing-${props.axis}`);
        emit("stop");
        if (snapped.value) emit("reset");
        snapped.value = false;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    document.body.classList.add("resizing", `resizing-${props.axis}`);
    emit("start");
    event.preventDefault();
}

function start(event) {
    if (props.measure) return track(event, props.measure);
    const panel = event.currentTarget.nextElementSibling;
    const from = event.clientX;
    const began = panel.getBoundingClientRect().width;
    const home = natural(panel);
    track(event, (moved) => {
        const width = Math.min(props.max, Math.max(props.min, began + from - moved.clientX));
        const near = Math.abs(width - home) <= props.snap;
        return {value: near ? home : width, snapped: near};
    });
}
</script>

<template>
    <div
        :class="['resize-handle', axis, {snapped}]"
        role="separator"
        :aria-orientation="axis === 'y' ? 'horizontal' : 'vertical'"
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

.resize-handle.y {
    width: auto;
    height: 7px;
    margin: -3px 0;
    cursor: row-resize;
}

.resize-handle.y::after {
    inset: 3px 0;
}
</style>

<style>
body.resizing {
    cursor: col-resize;
    user-select: none;
}

body.resizing-y {
    cursor: row-resize;
}
</style>
