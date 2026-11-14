<script setup>
import {computed} from "vue";
import {ACTS} from "../../figure/acts.js";

// The steam rising off the head at `head`, in pixels, of a figure fuming `u` of the way through the act, puff after puff from either side
const props = defineProps({
    u: {type: Number, required: true},
    head: {type: Object, required: true},
});

const act = ACTS.fume;
const steam = computed(() => {
    const k = (props.u - act.steam[0]) / (act.steam[1] - act.steam[0]);
    if (k <= 0 || k >= 1) return [];
    return Array.from({length: 6}, (_, index) => {
        const rise = (k * 3 + index / 6) % 1;
        const side = index % 2 ? 1 : -1;
        return {name: `puff${index}`, x: props.head.x + side * (12 + 10 * rise), y: props.head.y - 14 - 26 * rise, r: 2.5 + 4 * rise, fade: 1 - rise};
    });
});
</script>

<template>
    <template v-for="puff in steam" :key="puff.name">
        <circle :cx="puff.x" :cy="puff.y" :r="puff.r" fill="#e9e7e1" stroke="#a9adb8" stroke-width="0.6" :opacity="puff.fade" />
    </template>
</template>
