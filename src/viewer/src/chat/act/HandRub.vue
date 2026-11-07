<script setup>
import {computed} from "vue";
import {ACTS} from "../../figure/acts.js";
import {COLOURS} from "./colours.js";

// The little cloud rising from the rubbing hands at `hand`, in pixels, `u` of the way through the act: the act's few puffs drifting up once
// each and fading, one after another, and its sparkles twinkling among them, each at its place from the hands in pixels; nothing outside
// the act's puff
const props = defineProps({
    u: {type: Number, required: true},
    hand: {type: Object, required: true},
});

const SPARKLES = [[-9, -12], [8, -18], [1, -26]];

const act = ACTS.hand_rub;
const rub = computed(() => {
    const k = (props.u - act.puff[0]) / (act.puff[1] - act.puff[0]);
    if (k <= 0 || k >= 1) return null;
    const fade = Math.min(k * 6, 1, (1 - k) * 6);
    const puffs = Array.from({length: act.puffs}, (_, index) => {
        const rise = (k + index / act.puffs) % 1;
        return {name: `puff${index}`, x: (index - (act.puffs - 1) / 2) * 5 + 3 * Math.sin(rise * 6 + index), y: -4 - 16 * rise, r: 2 + 3.5 * rise, fade: fade * (1 - rise) * 0.85};
    });
    const sparkles = SPARKLES.slice(0, act.sparkles).map(([x, y], index) => {
        const size = 2.6 * Math.max(Math.sin(Math.PI * ((k * 4 + index / 3) % 1)), 0);
        const shape = `M${x} ${y - size * 2}L${x + size * 0.5} ${y - size * 0.5}L${x + size * 2} ${y}L${x + size * 0.5} ${y + size * 0.5}L${x} ${y + size * 2}L${x - size * 0.5} ${y + size * 0.5}L${x - size * 2} ${y}L${x - size * 0.5} ${y - size * 0.5}Z`;
        return {name: `sparkle${index}`, shape, fade};
    });
    return {puffs, sparkles};
});
</script>

<template>
    <template v-if="rub">
        <g class="figure-act-rub" :transform="`translate(${hand.x} ${hand.y})`">
            <template v-for="puff in rub.puffs" :key="puff.name">
                <circle :cx="puff.x" :cy="puff.y" :r="puff.r" :fill="COLOURS.smoke" stroke="#a9adb8" stroke-width="0.5" :opacity="puff.fade" />
            </template>
            <template v-for="sparkle in rub.sparkles" :key="sparkle.name">
                <path :d="sparkle.shape" :fill="COLOURS.light" stroke="none" :opacity="sparkle.fade" />
            </template>
        </g>
    </template>
</template>
