<script setup>
import {computed} from "vue";
import Btn from "./Btn.vue";
import {clamp} from "../format/number.js";

const props = defineProps({
    rect: {type: Object, required: true},
    beside: Boolean,
    count: {type: String, required: true},
    title: {type: String, required: true},
    text: {type: String, required: true},
    last: Boolean,
});
const emit = defineEmits(["next", "skip"]);
const WIDTH = 280;
const GAP = 14;
const EDGE = 8;

const ring = computed(() => ({
    left: `${props.rect.l - 4}px`,
    top: `${props.rect.t - 4}px`,
    width: `${props.rect.r - props.rect.l + 8}px`,
    height: `${props.rect.b - props.rect.t + 8}px`,
}));

const place = computed(() => {
    const r = props.rect;
    const across = (r.l + r.r) / 2;
    const down = (r.t + r.b) / 2;
    if (!props.beside) {
        const left = clamp(across - WIDTH / 2, EDGE, window.innerWidth - WIDTH - EDGE);
        return {card: {left: `${left}px`, top: `${r.b + GAP}px`}, arrow: "up", at: {left: `${clamp(across - left - 5, 14, WIDTH - 24)}px`}};
    }
    const toLeft = r.l - GAP - WIDTH >= EDGE;
    const left = toLeft ? r.l - GAP - WIDTH : Math.min(r.r + GAP, window.innerWidth - WIDTH - EDGE);
    const top = clamp(down - 34, EDGE, window.innerHeight - 200);
    return {card: {left: `${left}px`, top: `${top}px`}, arrow: toLeft ? "right" : "left", at: {top: `${clamp(down - top - 5, 12, 150)}px`}};
});
</script>

<template>
    <Teleport to="body">
        <div class="tour-ring" :style="ring" />
        <div class="tour-card" :style="place.card" role="dialog" :aria-label="title" @click.stop>
            <span :class="['tour-arrow', place.arrow]" :style="place.at" />
            <p class="tour-count">{{ count }}</p>
            <p class="tour-title">{{ title }}</p>
            <p class="tour-text">{{ text }}</p>
            <div class="tour-row">
                <Btn class="tour-skip" @click="emit('skip')">Skip</Btn>
                <span class="tour-space" />
                <Btn kind="primary" @click="emit('next')">{{ last ? "Done" : "Next" }}</Btn>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.tour-ring {
    position: fixed;
    z-index: 500;
    border: 1.5px solid var(--accent);
    border-radius: 8px;
    pointer-events: none;
    animation: tour-in 0.2s both;
    transition:
        left 0.3s var(--ease),
        top 0.3s var(--ease),
        width 0.3s var(--ease),
        height 0.3s var(--ease);
}

.tour-card {
    position: fixed;
    z-index: 501;
    width: 280px;
    padding: 12px 14px;
    border: 1px solid var(--border-3);
    border-radius: 10px;
    background: var(--raised);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
    animation: tour-rise 0.22s var(--ease) both;
    transition:
        left 0.3s var(--ease),
        top 0.3s var(--ease);
}

.tour-arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--raised);
    transform: rotate(45deg);
    transition:
        left 0.3s var(--ease),
        top 0.3s var(--ease);
}

.tour-arrow.up {
    top: -6px;
    border-top: 1px solid var(--border-3);
    border-left: 1px solid var(--border-3);
}

.tour-arrow.right {
    right: -6px;
    border-top: 1px solid var(--border-3);
    border-right: 1px solid var(--border-3);
}

.tour-arrow.left {
    left: -6px;
    border-bottom: 1px solid var(--border-3);
    border-left: 1px solid var(--border-3);
}

.tour-count {
    margin: 0 0 4px;
    font-size: 11px;
    color: var(--text-4);
}

.tour-title {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
}

.tour-text {
    margin: 4px 0 12px;
    font-size: 12px;
    line-height: 1.5;
    color: var(--text-3);
    text-wrap: pretty;
}

.tour-row {
    display: flex;
    align-items: center;
    gap: 6px;
}

.tour-space {
    flex: 1;
}

.tour-row .tour-skip {
    border-color: transparent;
    color: var(--text-3);
}

@keyframes tour-in {
    from {
        opacity: 0;
    }
}

@keyframes tour-rise {
    from {
        opacity: 0;
        transform: translateY(6px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .tour-ring,
    .tour-card,
    .tour-arrow {
        transition: none;
        animation: none;
    }
}
</style>
