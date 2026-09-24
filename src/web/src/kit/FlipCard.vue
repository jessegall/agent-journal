<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";

const props = defineProps({
    from: {type: Object, required: true},
    width: {type: Number, default: 460},
    height: {type: Number, default: 380},
});
const emit = defineEmits(["close"]);
const MOVE_MS = 380;
const FLIP_MS = 550;
const centred = ref(false);
const flipped = ref(false);
const timers = [];
const later = (ms, fn) => timers.push(setTimeout(fn, ms));
const box = computed(() => {
    if (!centred.value) return {left: props.from.left, top: props.from.top, width: props.from.width, height: props.from.height};
    const width = Math.min(props.width, window.innerWidth - 32);
    const height = Math.min(props.height, window.innerHeight - 32);
    return {left: (window.innerWidth - width) / 2, top: (window.innerHeight - height) / 2, width, height};
});
const px = (b) => ({left: `${b.left}px`, top: `${b.top}px`, width: `${b.width}px`, height: `${b.height}px`});

function close() {
    flipped.value = false;
    later(FLIP_MS * 0.6, () => (centred.value = false));
    later(FLIP_MS * 0.6 + MOVE_MS, () => emit("close"));
}

function key(e) {
    if (e.key !== "Escape") return;
    e.stopImmediatePropagation();
    close();
}

onMounted(() => {
    window.addEventListener("keydown", key, true);
    requestAnimationFrame(() => requestAnimationFrame(() => (centred.value = true)));
    later(MOVE_MS, () => (flipped.value = true));
});
onUnmounted(() => {
    window.removeEventListener("keydown", key, true);
    timers.forEach(clearTimeout);
});
</script>

<template>
    <Teleport to="body">
        <div :class="['flip-scrim', {shown: centred}]" @click.self="close">
            <div class="flip" :style="px(box)">
                <div :class="['flip-inner', {flipped}]">
                    <div class="flip-face front"><slot name="front" /></div>
                    <div class="flip-face back"><slot name="back" /></div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.flip-scrim {
    position: fixed;
    inset: 0;
    z-index: 75;
    background: rgba(0, 0, 0, 0);
    transition: background 0.3s;
}

.flip-scrim.shown {
    background: rgba(0, 0, 0, 0.45);
}

.flip {
    position: fixed;
    perspective: 1200px;
    transition:
        left 0.38s var(--ease),
        top 0.38s var(--ease),
        width 0.38s var(--ease),
        height 0.38s var(--ease);
}

.flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.flip-inner.flipped {
    transform: rotateY(180deg);
}

.flip-face {
    position: absolute;
    inset: 0;
    overflow-y: auto;
    padding: 22px 24px;
    border: 1px solid var(--border-2);
    border-radius: 13px;
    background: rgba(28, 29, 33, 0.98);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.5);
    backface-visibility: hidden;
}

.back {
    transform: rotateY(180deg);
}

@media (prefers-reduced-motion: reduce) {
    .flip,
    .flip-inner,
    .flip-scrim {
        transition: none;
    }
}
</style>
