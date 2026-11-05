<script setup>
import {computed} from "vue";
import {ACTS, partOf, standingAt} from "../../figure/acts.js";
import {COLOURS} from "./colours.js";

// The filing cabinet that grows up out of the floor beside the figure, toward its free hand, its drawer sliding out for the card in the
// hand and shut again, before it sinks back: `u` of the way through the act; the free hand at `hand`, the picture's `middle` across and the
// `floor` under the feet, in pixels; `out` the way the free hand's side is, 1 to the right; the picture `size` pixels square
const props = defineProps({
    u: {type: Number, required: true},
    hand: {type: Object, required: true},
    middle: {type: Number, required: true},
    floor: {type: Number, required: true},
    out: {type: Number, required: true},
    size: {type: Number, required: true},
});

// where the cabinet stands, as shares of the picture: across from the middle, toward the free hand, and the height of its top above the feet
const STAND = {across: 0.24, top: 0.3};

const act = ACTS.file_card;
const stand = computed(() => ({x: props.middle + props.out * STAND.across * props.size, top: props.floor - STAND.top * props.size, up: standingAt(act, props.u)}));
const growing = computed(() => `translate(0 ${props.floor}) scale(1 ${stand.value.up}) translate(0 ${-props.floor})`);
// the drawer slid out, 0 to 1, and the card dropped into it
const drawer = computed(() => partOf(props.u, act.opens) * (1 - partOf(props.u, act.shuts)));
const filed = computed(() => partOf(props.u, act.filed));
</script>

<template>
    <template v-if="filed < 1 && u > act.reach[0]">
        <g :transform="`translate(${hand.x} ${hand.y + 3 + 6 * filed})`">
            <rect x="-6" y="-4" width="12" height="8" :fill="COLOURS.paper" stroke-width="0.7" />
            <path d="M-4 -1.5h8M-4 1h6" stroke-width="0.5" />
        </g>
    </template>
    <g :transform="growing">
        <rect :x="stand.x - 12" :y="stand.top" :width="24" :height="floor - stand.top" rx="1" :fill="COLOURS.wood" />
        <rect :x="stand.x - 10" :y="stand.top + 2 - 5 * drawer" width="20" :height="5 * drawer" fill="#5b3a1c" stroke-width="0.6" />
        <rect :x="stand.x - 10 - 1.5 * drawer" :y="stand.top + 2" :width="20 + 3 * drawer" height="10" rx="1" :fill="COLOURS.wood" />
        <rect :x="stand.x - 10" :y="stand.top + 14" width="20" height="10" rx="1" :fill="COLOURS.wood" />
        <path :d="`M${stand.x - 3} ${stand.top + 7}h6M${stand.x - 3} ${stand.top + 19}h6`" stroke-width="1.4" />
    </g>
</template>
