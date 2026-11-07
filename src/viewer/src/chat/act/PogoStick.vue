<script setup>
import {computed} from "vue";
import {ACTS, partOf} from "../../figure/acts.js";
import {COLOURS} from "./colours.js";

// The pogo stick, upright under the hands with its foot below the figure's feet, `u` of the way through the act: drawn out from behind the
// back, held, and let go to fall away out of sight, turning as it goes; its handlebar, foot pegs and spring. The picture's `middle` across
// and the `floor` under the feet, in pixels; the picture `size` pixels square.
const props = defineProps({
    u: {type: Number, required: true},
    middle: {type: Number, required: true},
    floor: {type: Number, required: true},
    size: {type: Number, required: true},
});

const stick = computed(() => {
    const {draw, drop, stick: long} = ACTS.pogo;
    const height = long * props.size;
    const falling = partOf(props.u, drop);
    const coil = Array.from({length: 7}, (_, index) => `${index % 2 ? 3 : -3} ${2 + index * 1.6}`).join(" L");
    return {
        shown: partOf(props.u, [draw[1] * 0.6, draw[1]]),
        foot: props.floor,
        top: -props.size * ACTS.pogo.handles,
        bottom: height * 0.18,
        bar: props.size * 0.16,
        peg: props.size * 0.13,
        spring: `M0 1 L${coil} L0 ${2 + 7 * 1.6}`,
        fall: falling * falling * props.size * 9,
        turn: 70 * falling,
    };
});
</script>

<template>
    <template v-if="stick.shown">
        <g :transform="`translate(${middle} ${stick.foot + stick.fall}) rotate(${stick.turn}) scale(${stick.shown})`" data-pogo-stick>
            <line x1="0" :y1="stick.top" x2="0" :y2="stick.bottom" :stroke="COLOURS.silver" stroke-width="2.6" stroke-linecap="round" />
            <line :x1="-stick.bar" :y1="stick.top" :x2="stick.bar" :y2="stick.top" :stroke="COLOURS.silver" stroke-width="3" stroke-linecap="round" />
            <line :x1="-stick.peg" y1="-1" :x2="stick.peg" y2="-1" :stroke="COLOURS.red" stroke-width="2.4" stroke-linecap="round" />
            <path :d="stick.spring" :stroke="COLOURS.gold" stroke-width="1.2" fill="none" />
        </g>
    </template>
</template>
