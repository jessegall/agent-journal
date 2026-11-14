<script setup>
import {computed} from "vue";
import {ACTS, partOf} from "../../figure/acts.js";
import {COLOURS} from "./colours.js";

// The thought cloud over the thinking figure's head, out toward its free hand, wherever it shows thinking (acts.js ponder, think_cloud,
// type_ponder): three puffs rising from beside the head into a small cloud, `across` and `above` the eyes as shares of the picture, `wide`
// across, holding three dots that pulse one after another, each its turn of the act's pulse. In the thinking act the puffs rise one after
// another as it begins and all of it fades as its hand comes away; at the laptop, it is there whole. The act `name`, `u` of the way
// through it; the eyes at `head`, in pixels; `out` the way the free hand's side is, 1 to the right; the picture `size` pixels square.
const props = defineProps({
    name: {type: String, required: true},
    u: {type: Number, required: true},
    head: {type: Object, required: true},
    out: {type: Number, required: true},
    size: {type: Number, required: true},
});

const CLOUD = {across: 0.24, above: 0.36, wide: 0.3, puffs: [[0.08, 0.12, 0.022], [0.13, 0.2, 0.03], [0.18, 0.27, 0.04]]};
const BUMPS = [[-0.32, 0.05, 0.2], [-0.12, -0.12, 0.24], [0.14, -0.1, 0.22], [0.32, 0.06, 0.18], [0, 0.12, 0.22]];

const px = (share) => share * props.size;
const cloud = computed(() => {
    const {puffs, cloud: held, rise, pulse, frames, fps} = ACTS[props.name];
    if (!pulse) return null;
    const forming = (from, to) => (puffs ? partOf(props.u, [from, to]) : 1);
    const shown = puffs ? partOf(props.u, [held[0], puffs[1]]) * (1 - partOf(props.u, [held[1], rise[1]])) : 1;
    if (!shown) return null;
    const seconds = (props.u * frames) / fps;
    const rising = CLOUD.puffs.map(([across, above, r], index) => ({
        name: `puff${index}`,
        x: props.head.x + props.out * px(across),
        y: props.head.y - px(above),
        r: px(r) * (puffs ? forming(puffs[0] + (index * (puffs[1] - puffs[0])) / 3, puffs[0] + ((index + 1) * (puffs[1] - puffs[0])) / 3) : 1),
    }));
    const x = props.head.x + props.out * px(CLOUD.across);
    const y = props.head.y - px(CLOUD.above);
    const w = px(CLOUD.wide);
    const bumps = BUMPS.map(([dx, dy, r], index) => ({name: `bump${index}`, x: x + dx * w, y: y + dy * w, r: r * w}));
    const dots = [-1, 0, 1].map((place, index) => ({name: `dot${index}`, x: x + place * w * 0.22, y, r: w * 0.05 * (1 + 0.5 * Math.max(Math.sin(2 * Math.PI * (seconds / pulse - index / 3)), 0)), lit: 0.35 + 0.65 * Math.max(Math.sin(2 * Math.PI * (seconds / pulse - index / 3)), 0)}));
    return {shown, rising, bumps, dots, grown: puffs ? forming(puffs[0] + (2 * (puffs[1] - puffs[0])) / 3, puffs[1]) : 1};
});
</script>

<template>
    <template v-if="cloud">
        <g :opacity="cloud.shown" data-thought-cloud>
            <template v-for="puff in cloud.rising" :key="puff.name">
                <circle :cx="puff.x" :cy="puff.y" :r="puff.r" :fill="COLOURS.paper" stroke-width="0.8" />
            </template>
            <template v-if="cloud.grown">
                <g :opacity="cloud.grown">
                    <template v-for="bump in cloud.bumps" :key="bump.name">
                        <circle :cx="bump.x" :cy="bump.y" :r="bump.r" :fill="COLOURS.paper" stroke-width="0.9" />
                    </template>
                    <template v-for="bump in cloud.bumps" :key="bump.name">
                        <circle :cx="bump.x" :cy="bump.y" :r="bump.r - 0.8" :fill="COLOURS.paper" stroke="none" />
                    </template>
                    <template v-for="dot in cloud.dots" :key="dot.name">
                        <circle :cx="dot.x" :cy="dot.y" :r="dot.r" :fill="COLOURS.ink" stroke="none" :opacity="dot.lit" data-thought-dot />
                    </template>
                </g>
            </template>
        </g>
    </template>
</template>
