<script setup>
import {onMounted, onUnmounted, shallowRef} from "vue";
import {latestFloors, onFloors} from "../figure/floors.js";
import FigureFloorLine from "./FigureFloorLine.vue";

// the floors as the floors loop reads them, handed over in the frame they are read in so the lines never trail what they stand on, and
// kept apart from the chat's state, which is never written sixty times a second
const floors = shallowRef(latestFloors().floors);
let stop = () => {};

onMounted(() => (stop = onFloors((read) => (floors.value = read.floors))));
onUnmounted(() => stop());
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
