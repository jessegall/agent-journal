<script setup>
import {computed} from "vue";
import {ACTS, heldPhases, partOf} from "../../figure/acts.js";
import {COLOURS} from "./colours.js";

// The vacuum, `u` of the way through the act: the canister on the floor beside the figure, its hose up to the nozzle in the free hand at
// `hand`, and the words flying in to the nozzle. The picture's `middle` across and the `floor` under the feet, in pixels; `out` the way the
// free hand's side is, 1 to the right; the picture `size` pixels square. The equipment fades in and out; each word fades at its source
// and into the nozzle so its next trip never jumps across the screen while visible.
const props = defineProps({
    u: {type: Number, required: true},
    hand: {type: Object, required: true},
    middle: {type: Number, required: true},
    floor: {type: Number, required: true},
    out: {type: Number, required: true},
    size: {type: Number, required: true},
});

const WORDS = ["abc", "the", "ok", "do", "fix"];

const act = ACTS.vacuum;
const vacuumed = computed(() => {
    const {into, out: off} = heldPhases(act, props.u);
    const on = into * (1 - off);
    const x = props.middle + props.out * props.size * 0.44;
    const y = props.floor;
    const nozzle = {x: props.hand.x + props.out * 7, y: props.hand.y + 4};
    const phase = (props.u * (act.intro + act.hold + act.outro) - act.intro) / act.hold;
    const words = Array.from({length: act.words}, (_, index) => {
        const k = (((phase * 2 + index / act.words) % 1) + 1) % 1;
        const from = {x: nozzle.x + props.out * (70 + 12 * (index % 3)), y: nozzle.y - 30 + 13 * index};
        return {x: from.x + (nozzle.x - from.x) * k ** 1.6, y: from.y + (nozzle.y - from.y) * k ** 1.6, size: 1 - 0.7 * k, opacity: partOf(k, [0, 0.12]) * (1 - partOf(k, [0.85, 1])), word: WORDS[index]};
    });
    return {
        on,
        x,
        y,
        nozzle: `translate(${nozzle.x} ${nozzle.y}) scale(${props.out} 1)`,
        words,
        hose: `M${x} ${y - 12}Q${x} ${nozzle.y + 30} ${nozzle.x - props.out * 6} ${nozzle.y}`,
    };
});
</script>

<template>
    <g v-if="vacuumed.on > 0" :opacity="vacuumed.on">
        <path :d="vacuumed.hose" fill="none" stroke-width="2.6" :stroke="COLOURS.ink" />
        <path :d="vacuumed.hose" fill="none" stroke-width="1.4" stroke="#6366f1" />
        <rect :x="vacuumed.x - 9" :y="vacuumed.y - 16" width="18" height="14" rx="4" fill="#ef476f" />
        <circle :cx="vacuumed.x - 5" :cy="vacuumed.y - 2" r="2.5" :fill="COLOURS.ink" />
        <circle :cx="vacuumed.x + 5" :cy="vacuumed.y - 2" r="2.5" :fill="COLOURS.ink" />
        <g :transform="vacuumed.nozzle">
            <path d="M-6 -1.6H2L6 -4.5V4.5L2 1.6H-6Z" fill="#35374b" />
        </g>
        <template v-for="word in vacuumed.words" :key="word.word">
            <text :x="word.x" :y="word.y" :font-size="7 * word.size" :opacity="word.opacity" text-anchor="middle" class="figure-act-word" stroke="none" :fill="COLOURS.paper">{{ word.word }}</text>
        </template>
    </g>
</template>

<style scoped>
.figure-act-word {
    font-family: var(--mono, monospace);
    font-weight: 700;
    paint-order: stroke;
}
</style>
