<script setup>
const props = defineProps({min: {type: Number, default: 240}, max: {type: Number, default: 720}});
const emit = defineEmits(["resize", "reset"]);

function start(event) {
    const from = event.clientX;
    const began = event.currentTarget.nextElementSibling.getBoundingClientRect().width;
    const move = (moved) => emit("resize", Math.min(props.max, Math.max(props.min, began + from - moved.clientX)));
    const stop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
        document.body.classList.remove("resizing");
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    document.body.classList.add("resizing");
    event.preventDefault();
}
</script>

<template>
    <div
        class="resize-handle"
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
</style>

<style>
body.resizing {
    cursor: col-resize;
    user-select: none;
}
</style>
