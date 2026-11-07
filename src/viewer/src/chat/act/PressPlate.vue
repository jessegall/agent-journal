<script setup>
import {computed} from "vue";
import {ACTS, heldPhases, partOf} from "../../figure/acts.js";

// The press, `u` of the way through the act: its plate lowered onto the head on its screw from above the picture, and lifted off it again.
// The picture's `middle` across, in pixels; the picture `size` pixels square.
const props = defineProps({
    u: {type: Number, required: true},
    middle: {type: Number, required: true},
    size: {type: Number, required: true},
});

const act = ACTS.press;
const plate = computed(() => {
    const {into, out} = heldPhases(act, props.u);
    const top = props.size * 0.27 - 6;
    return top - 70 * (1 - partOf(into, act.lowers)) - 90 * partOf(out, act.lifts);
});
</script>

<template>
    <rect :x="middle - 2" :y="plate - 200" width="4" height="200" fill="#a9adb8" />
    <rect :x="middle - 22" :y="plate" width="44" height="6" rx="1" fill="#6b6f7c" />
</template>
