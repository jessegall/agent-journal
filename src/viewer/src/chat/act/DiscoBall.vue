<script setup>
import {computed} from "vue";
import {ACTS} from "../../figure/acts.js";
import {COLOURS} from "./colours.js";

// The disco ball over the dancing figure, `u` of the way through the dance: its string from where it is tied down to the ball, the ball's
// mirror tiles turning as it spins, and flecks of its light going round the figure in the colours. `ball` is where it hangs over the feet
// (perches.js discoBall); the picture's `middle` across and the `floor` under the feet, in pixels; the picture `size` pixels square.
const props = defineProps({
    u: {type: Number, required: true},
    middle: {type: Number, required: true},
    floor: {type: Number, required: true},
    size: {type: Number, required: true},
    ball: {type: Object, required: true},
});

const disco = computed(() => {
    const r = (ACTS.disco.ball * props.size) / 2;
    const y = props.floor - props.ball.hangs;
    const turn = props.u * 40;
    const tiles = [];
    for (let row = -2; row <= 2; row++) for (let column = -3; column <= 3; column++) tiles.push({name: `tile${row}:${column}`, x: props.middle + column * r * 0.42 + ((turn * r * 0.42) % (r * 0.42)) - r * 0.21, y: y + row * r * 0.42, light: (row + column + Math.floor(turn)) % 3 === 0});
    const flecks = Array.from({length: 9}, (_, index) => {
        const way = index * 0.7 + props.u * 9;
        return {name: `fleck${index}`, x: props.middle + Math.cos(way) * props.size * (0.55 + 0.1 * (index % 3)), y: y + 10 + Math.abs(Math.sin(way * 1.3)) * props.size * 0.75, colour: `hsl(${(index * 40 + props.u * 1400) % 360} 95% 65%)`};
    });
    return {x: props.middle, y, r, top: props.floor - props.ball.above, tiles, flecks};
});
</script>

<template>
    <line :x1="disco.x" :y1="disco.top" :x2="disco.x" :y2="disco.y - disco.r" :stroke="COLOURS.silver" stroke-width="1" />
    <clipPath id="figure-act-ball">
        <circle :cx="disco.x" :cy="disco.y" :r="disco.r" />
    </clipPath>
    <circle :cx="disco.x" :cy="disco.y" :r="disco.r" fill="#8d93a3" />
    <g clip-path="url(#figure-act-ball)">
        <template v-for="tile in disco.tiles" :key="tile.name">
            <rect :x="tile.x - disco.r * 0.18" :y="tile.y - disco.r * 0.18" :width="disco.r * 0.36" :height="disco.r * 0.36" :fill="tile.light ? '#f4f6fb' : '#b9bfcc'" />
        </template>
    </g>
    <circle :cx="disco.x" :cy="disco.y" :r="disco.r" fill="none" :stroke="COLOURS.ink" stroke-width="0.8" />
    <template v-for="fleck in disco.flecks" :key="fleck.name">
        <circle :cx="fleck.x" :cy="fleck.y" r="2.2" :fill="fleck.colour" opacity="0.85" />
    </template>
</template>
