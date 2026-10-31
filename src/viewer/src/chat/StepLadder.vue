<script setup>
import {computed} from "vue";
import {LADDER} from "../figure/places.js";

// The wooden ladder the figure sets against the chat window's side to rummage past it (figure/perches.js rummageSpot): its feet on the
// ground at `foot` and its top resting on the side at `top`, both on the page in pixels, seen face on, its two rails `width` pixels apart
// with rungs LADDER rung apart between them. It tips up from the floor as it is set there, and tips back down as it is taken away.
const props = defineProps({
    foot: {type: Object, required: true},
    top: {type: Object, required: true},
});

const WIDTH = 14;
const PAD = 4;

const box = computed(() => ({
    left: Math.min(props.foot.x, props.top.x) - WIDTH - PAD,
    top: props.top.y - PAD,
    right: Math.max(props.foot.x, props.top.x) + WIDTH + PAD,
    bottom: props.foot.y + PAD,
}));
const style = computed(() => ({
    left: `${box.value.left}px`,
    top: `${box.value.top}px`,
    width: `${box.value.right - box.value.left}px`,
    height: `${box.value.bottom - box.value.top}px`,
    "--fallen": `${props.top.x > props.foot.x ? -80 : 80}deg`,
    transformOrigin: `${props.foot.x - box.value.left}px ${props.foot.y - box.value.top}px`,
}));
// the two rails and the rungs between them, in the drawing's own pixels: each rail its half width either side of the ladder's line
const drawing = computed(() => {
    const [fx, fy, tx, ty] = [props.foot.x - box.value.left, props.foot.y - box.value.top, props.top.x - box.value.left, props.top.y - box.value.top];
    const long = Math.hypot(tx - fx, ty - fy);
    const [ax, ay] = [(tx - fx) / long, (ty - fy) / long];
    const [nx, ny] = [-ay * (WIDTH / 2), ax * (WIDTH / 2)];
    const rails = [-1, 1].map((side) => ({x1: fx + side * nx, y1: fy + side * ny, x2: tx + side * nx, y2: ty + side * ny}));
    const rungs = Array.from({length: Math.floor(long / LADDER.rung)}, (_, index) => {
        const along = (index + 0.6) * LADDER.rung;
        const [x, y] = [fx + ax * along, fy + ay * along];
        return {x1: x - nx, y1: y - ny, x2: x + nx, y2: y + ny};
    });
    return {rails, rungs};
});
</script>

<template>
    <div class="step-ladder" :style="style" aria-hidden="true" data-step-ladder>
        <svg class="step-ladder-drawing" :width="box.right - box.left" :height="box.bottom - box.top">
            <template v-for="(rung, index) in drawing.rungs" :key="`rung${index}`">
                <line class="step-ladder-rung" v-bind="rung" />
            </template>
            <template v-for="(rail, index) in drawing.rails" :key="`rail${index}`">
                <line class="step-ladder-rail" v-bind="rail" />
            </template>
        </svg>
    </div>
</template>

<style scoped>
.step-ladder {
    position: fixed;
    z-index: 39;
    pointer-events: none;
    animation: step-ladder-set 420ms cubic-bezier(0.3, 1.3, 0.5, 1) both;
}

.step-ladder.step-ladder-leave-active {
    animation: step-ladder-set 320ms ease-in reverse both;
}

.step-ladder-drawing {
    display: block;
    overflow: visible;
    filter: drop-shadow(0 0 1px color-mix(in srgb, var(--text) 45%, transparent));
}

.step-ladder-rail {
    stroke: #9b6a3a;
    stroke-width: 3;
    stroke-linecap: round;
}

.step-ladder-rung {
    stroke: #c08a52;
    stroke-width: 2;
    stroke-linecap: round;
}

/* set against the wall: it tips up from lying on the floor about its feet */
@keyframes step-ladder-set {
    from {
        rotate: var(--fallen);
        opacity: 0;
    }

    to {
        rotate: 0deg;
        opacity: 1;
    }
}

@media (prefers-reduced-motion: reduce) {
    .step-ladder,
    .step-ladder.step-ladder-leave-active {
        animation: none;
    }
}
</style>
