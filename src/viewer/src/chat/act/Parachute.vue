<script setup>
import {computed} from "vue";
import {chuteOver} from "../../figure/acts.js";

// The parachute over the figure, `u` of the way through its sway: its canopy drawn in 3D (`canopy`, figure.js Stage.drawCanopy) above the
// eyes at `head`, and its lines down to both hands at `hand` and `other` (acts.js chuteOver), in pixels; the picture `size` pixels square
const props = defineProps({
    u: {type: Number, required: true},
    head: {type: Object, required: true},
    hand: {type: Object, required: true},
    other: {type: Object, required: true},
    size: {type: Number, required: true},
    canopy: {type: Object, required: true},
});

const chute = computed(() => chuteOver(props.canopy, props.head, [props.hand, props.other], props.size, props.u));
const lines = computed(() => chute.value.lines.map(({from, to}, index) => ({name: `line${index}`, x1: from.x, y1: from.y, x2: to.x, y2: to.y})));
const turning = computed(() => `rotate(${chute.value.turn} ${chute.value.middle.x} ${chute.value.middle.y})`);
</script>

<template>
    <template v-for="line in lines" :key="line.name">
        <line :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2" stroke-width="0.7" data-chute-line />
    </template>
    <g :transform="turning">
        <image :href="canopy.picture" :x="chute.left" :y="chute.top" :width="canopy.width" :height="canopy.height" data-chute-canopy />
    </g>
</template>
