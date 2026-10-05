<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import Outline from "../src/kit/Outline.vue";
import {boxAround} from "../src/platform/boxes.js";
import {nextButtons} from "./next.js";

const FOLLOW = 250;
const rect = ref(null);
let following = 0;

const measure = () => (rect.value = globalThis.demo ? boxAround(nextButtons(globalThis.demo)) : null);

onMounted(() => (following = setInterval(measure, FOLLOW)));
onUnmounted(() => clearInterval(following));
</script>

<template>
    <template v-if="rect">
        <Outline :rect="rect" />
    </template>
</template>
