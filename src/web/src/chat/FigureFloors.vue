<script setup>
import {onMounted, onUnmounted, shallowRef} from "vue";
import {latestFloors} from "../figure/floors.js";
import FigureFloorLine from "./FigureFloorLine.vue";

// the floors as the floors loop last read them, drawn on a frame of their own so the chat's state is never written sixty times a second
const floors = shallowRef([]);
let frame = 0;

const draw = () => {
    frame = requestAnimationFrame(draw);
    floors.value = latestFloors().floors;
};

onMounted(draw);
onUnmounted(() => cancelAnimationFrame(frame));
</script>

<template>
    <div class="figure-floors" aria-hidden="true">
        <template v-for="floor in floors" :key="floor.id">
            <FigureFloorLine :floor="floor" />
        </template>
    </div>
</template>

<style scoped>
.figure-floors {
    position: fixed;
    inset: 0;
    z-index: 39;
    pointer-events: none;
}
</style>
