<script setup>
import {computed, ref, watch} from "vue";
import {BLINK, LAYER, PARCEL, digitsOf} from "../figure/parcels.js";

// A parcel the figure built, a block of server units drawn in 3D by the figure's own renderer (figure.js Stage.drawBlock), standing on the
// page with its base's middle at `x`, `y`, in pixels, `up` pixels higher on the pile it sits on, `scale` times its size and as opaque as
// `opacity`; it pops in as it appears, and hops up when it is pushed onto the pile. Its `block` is its pictures, one for each step of its
// lights' blink, their size and how far of them lies below the floor. Each time `blows` goes up, a blow has landed on it: a cartoon cloud
// of dust puffs around it, and a spray of 0 and 1 digits flies out of it, each its own way and pace, fading as it goes. The one the figure
// pushes is drawn `ahead` of it (parcels.js LAYER), and one on the pile is marked `piled` for the figure to keep clear of.
const props = defineProps({
    x: {type: Number, required: true},
    y: {type: Number, required: true},
    up: {type: Number, default: 0},
    scale: {type: Number, default: 1},
    opacity: {type: Number, default: 1},
    blows: {type: Number, default: 0},
    block: {type: Object, required: true},
    ahead: {type: Boolean, default: false},
    piled: {type: Boolean, default: false},
});

// The dust of a blow: puffs of cloud around the unit, each its place from the unit's base's middle and its size, in pixels
const CLOUDS = [
    {x: -17, y: -4, size: 14},
    {x: -7, y: -2, size: 12},
    {x: 6, y: -3, size: 13},
    {x: 17, y: -5, size: 12},
    {x: -11, y: -12, size: 11},
    {x: 12, y: -13, size: 10},
    {x: 0, y: -17, size: 11},
];

// the puffs in the air, each {id, digits}, every digit {id, text, x, y}
const puffs = ref([]);
let puffed = 0;
const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// a puff is gone once the last of its digits has stopped and faded, its clouds long gone by then
function puff() {
    const id = ++puffed;
    const digits = digitsOf(Math.random).map((digit, index) => ({...digit, id: `${id}-${index}`}));
    puffs.value = [...puffs.value, {id, digits}];
    setTimeout(() => (puffs.value = puffs.value.filter((each) => each.id !== id)), Math.max(...digits.map((digit) => Math.max(digit.moveMs, digit.fadeMs))));
}

watch(
    () => props.blows,
    (now, before) => now > before && !still() && puff()
);

const cloudStyle = (cloud) => ({
    left: `${cloud.x - cloud.size / 2}px`,
    top: `${cloud.y - cloud.size / 2}px`,
    width: `${cloud.size}px`,
    height: `${cloud.size}px`,
});
const digitStyle = (digit) => ({
    "--from-x": `${digit.x}px`,
    "--from-y": `${digit.y}px`,
    "--to-x": `${digit.x + digit.dx}px`,
    "--to-y": `${digit.y + digit.dy}px`,
    "--move-ms": `${digit.moveMs}ms`,
    "--fade-ms": `${digit.fadeMs}ms`,
});

const style = computed(() => ({left: `${props.x}px`, top: `${props.y}px`, zIndex: props.ahead ? LAYER.ahead : LAYER.behind}));
const placed = computed(() => ({transform: `translateY(${-props.up}px)`}));
const sized = computed(() => ({transform: `scale(${props.scale})`, opacity: props.opacity}));
// the block's pictures, laid over each other, each shown for its step of the blink in turn
const pictured = computed(() => ({
    width: `${props.block.width}px`,
    height: `${props.block.height}px`,
    bottom: `${-props.block.below}px`,
    "--blink-ms": `${BLINK.ms * props.block.pictures.length}ms`,
}));
const stepStyle = (index) => ({animationDelay: `${-(props.block.pictures.length - index) * BLINK.ms}ms`});
</script>

<template>
    <div class="code-parcel" :style="style" aria-hidden="true">
        <div class="code-parcel-placed" :style="placed">
            <div class="code-parcel-sized" :style="sized">
                <div class="code-parcel-box" :style="pictured" :data-figure-pile="piled ? '' : null">
                    <template v-for="(picture, index) in block.pictures" :key="index">
                        <img :class="['code-parcel-step', {blinks: block.pictures.length > 1}]" :src="picture" :style="stepStyle(index)" alt="" />
                    </template>
                </div>
            </div>
        </div>
        <template v-for="each in puffs" :key="each.id">
            <div class="code-parcel-dust">
                <template v-for="cloud in CLOUDS" :key="`${cloud.x}/${cloud.y}`">
                    <span class="code-parcel-cloud" :style="cloudStyle(cloud)" />
                </template>
                <template v-for="digit in each.digits" :key="digit.id">
                    <span class="code-parcel-digit" :style="digitStyle(digit)">{{ digit.text }}</span>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.code-parcel {
    position: fixed;
    width: 0;
    height: 0;
    pointer-events: none;
}

/* pushed onto the pile, the parcel hops up onto the parcels under it */
.code-parcel-placed {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    transform-origin: 50% 100%;
    transition: transform 240ms cubic-bezier(0.3, 1.6, 0.5, 1);
}

.code-parcel-sized {
    transform-origin: 50% 100%;
}

/* the parcel fades in out of thin air, grows past its size and quickly settles back to it, as a cartoon's prop pops in; its middle on
   the base's middle and its floor line on the floor */
.code-parcel-box {
    position: absolute;
    left: 0;
    bottom: 0;
    translate: -50% 0;
    transform-origin: 50% 100%;
    filter: drop-shadow(0 0 1px color-mix(in srgb, var(--text) 45%, transparent));
    animation: code-parcel-pop 520ms cubic-bezier(0.3, 0.7, 0.4, 1) both;
}

/* the pictures of the blink's steps lie over each other, and while the lights blink each shows for its own step in turn */
.code-parcel-step {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}

.code-parcel-step.blinks {
    opacity: 0;
    animation: code-parcel-blink var(--blink-ms) steps(1, end) infinite;
}

@keyframes code-parcel-blink {
    0% {
        opacity: 1;
    }

    25% {
        opacity: 0;
    }
}

@keyframes code-parcel-pop {
    0% {
        opacity: 0;
        transform: scale(0.2);
    }

    55% {
        opacity: 1;
        transform: scale(1.4);
    }

    78% {
        transform: scale(0.9);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

/* a blow's dust puffs out around the parcel and fades, and its bits fly up and out in an arc, turning */
.code-parcel-dust {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
}

.code-parcel-cloud {
    position: absolute;
    border-radius: 50%;
    background: #ece6d8;
    box-shadow: 0 0 0 0.7px color-mix(in srgb, #272936 70%, transparent);
    animation: code-parcel-puff 560ms ease-out both;
}

@keyframes code-parcel-puff {
    0% {
        opacity: 0;
        transform: scale(0.3);
    }

    25% {
        opacity: 0.95;
    }

    100% {
        opacity: 0;
        transform: scale(1.35) translateY(-4px);
    }
}

/* the digits fly out of the dust, each its own way, slowing to a stop, and fade at their own pace */
.code-parcel-digit {
    position: absolute;
    left: -2.5px;
    top: -4px;
    font: 800 9px/1 var(--mono, monospace);
    color: #8eeaff;
    text-shadow: 0 0 2px #1c1e25;
    animation:
        code-parcel-fly var(--move-ms) cubic-bezier(0.15, 0.6, 0.35, 1) both,
        code-parcel-fade var(--fade-ms) ease-in both;
}

@keyframes code-parcel-fly {
    from {
        transform: translate(var(--from-x), var(--from-y));
    }

    to {
        transform: translate(var(--to-x), var(--to-y));
    }
}

@keyframes code-parcel-fade {
    0% {
        opacity: 0;
    }

    12% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .code-parcel-box {
        animation: none;
    }

    .code-parcel-placed {
        transition: none;
    }

    .code-parcel-step.blinks {
        animation: none;
    }

    .code-parcel-step.blinks:first-child {
        opacity: 1;
    }
}
</style>
