<script setup>
import {computed} from "vue";
import {ACTS, heldPhases, partOf} from "../../figure/acts.js";

// The box, `u` of the way through the act: popping up around the feet, its flaps open, until it pops in a puff of smoke with its bits
// flying off. The picture's `middle` across and the `floor` under the feet, in pixels.
const props = defineProps({
    u: {type: Number, required: true},
    middle: {type: Number, required: true},
    floor: {type: Number, required: true},
});

// the ways the puff's clouds go out from the box, and the bits that fly off it on arcs, spinning about their own centres
const PUFFS = [-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4].map((way, index) => ({name: `cloud${index}`, way}));
const BITS = [1, 2, 3, 4].map((place) => ({name: `bit${place}`, place}));

const act = ACTS.pack_box;
const box = computed(() => {
    const {into, out} = heldPhases(act, props.u);
    const popped = out >= act.pops;
    const puff = popped ? Math.min((out - act.pops) / 0.4, 1) : 0;
    return {grown: partOf(into, act.appears), popped, puff, x: props.middle, width: 50, height: 36};
});
</script>

<template>
    <template v-if="!box.popped && box.grown > 0">
        <g :transform="`translate(${box.x} ${floor}) scale(${box.grown})`">
            <path :d="`M${-box.width / 2} ${-box.height}l-12 -9 4 -4 8 13Z`" fill="#b88a55" />
            <path :d="`M${box.width / 2} ${-box.height}l12 -9 -4 -4 -8 13Z`" fill="#b88a55" />
            <rect :x="-box.width / 2" :y="-box.height" :width="box.width" :height="box.height" fill="#c89b63" />
            <path :d="`M${-box.width / 2} ${-box.height + 5}H${box.width / 2}`" stroke-width="0.6" />
            <rect x="-7" :y="-box.height + 8" width="14" height="6" fill="#e8d4b0" stroke-width="0.6" />
        </g>
    </template>
    <template v-if="box.popped && box.puff < 1">
        <g :transform="`translate(${box.x} ${floor - 18})`" :opacity="1 - box.puff">
            <template v-for="cloud in PUFFS" :key="cloud.name">
                <circle :cx="Math.sin(cloud.way) * 30 * box.puff" :cy="-Math.cos(cloud.way) * 16 * box.puff" :r="8 + 8 * box.puff" fill="#e9e7e1" stroke="#a9adb8" stroke-width="0.8" />
            </template>
            <template v-for="bit in BITS" :key="bit.name">
                <rect x="-3.5" y="-2" width="7" height="4" fill="#c89b63" :transform="`translate(${(bit.place - 2.5) * 22 * box.puff} ${-20 * box.puff + 30 * box.puff * box.puff}) rotate(${bit.place * 70 * box.puff})`" data-act-box-bit />
            </template>
        </g>
    </template>
</template>
