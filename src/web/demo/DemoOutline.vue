<script setup>
import {inject, onMounted, ref} from "vue";
import Outline from "../src/kit/Outline.vue";
import {useFollowedBox} from "../src/composables/followedBox.js";
import {boxAround} from "../src/platform/boxes.js";
import {nextButtons} from "./next.js";
import {STAND_IN} from "./standIn.js";

const standIn = inject(STAND_IN);
const rect = ref(null);

const {follow} = useFollowedBox(() => (rect.value = boxAround(nextButtons(standIn))));

onMounted(follow);
</script>

<template>
    <template v-if="rect">
        <Outline :rect="rect" />
    </template>
</template>
