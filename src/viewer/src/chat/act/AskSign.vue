<script setup>
import {computed} from "vue";
import {ACTS} from "../../figure/acts.js";
import {COLOURS} from "./colours.js";

// The sign over the figure's head on a stick in the free hand at `hand`, in pixels, tipping as it waggles `u` of the way through the act
const props = defineProps({
    u: {type: Number, required: true},
    hand: {type: Object, required: true},
});

const act = ACTS.ask_sign;
const shown = computed(() => props.u > act.raise[0] && props.u < act.lower[1]);
const waggle = computed(() => {
    const [from, to] = act.waggle;
    const k = Math.min(Math.max((props.u - from) / (to - from), 0), 1);
    return 14 * Math.sin(2 * Math.PI * act.waggles * k) * Math.sin(Math.PI * k);
});
</script>

<template>
    <template v-if="shown">
        <g :transform="`translate(${hand.x} ${hand.y}) rotate(${waggle})`">
            <rect x="-1.2" y="-22" width="2.4" height="26" :fill="COLOURS.wood" />
            <rect x="-12" y="-40" width="24" height="20" rx="2" :fill="COLOURS.paper" stroke-width="1.4" />
            <text x="0" y="-24.5" text-anchor="middle" class="figure-act-mark" :fill="COLOURS.ink" stroke="none">?</text>
        </g>
    </template>
</template>

<style scoped>
.figure-act-mark {
    font: 800 15px/1 var(--mono, monospace);
}
</style>
