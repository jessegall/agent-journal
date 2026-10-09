<script setup>
import {computed, ref, watch} from "vue";
import {idleSheetOf, loadProfiles, mascotOn, profilesLoaded} from "../composables/profiles.js";

const sheet = computed(() => (mascotOn.value ? idleSheetOf() : ""));
const present = ref(false);

if (!profilesLoaded.value) loadProfiles().catch(console.error);

watch(
    sheet,
    (url) => {
        present.value = false;
        if (!url) return;
        const probe = new Image();
        probe.onload = () => (present.value = sheet.value === url);
        probe.src = url;
    },
    {immediate: true}
);
</script>

<template>
    <template v-if="present">
        <span class="voice-mascot" :style="{backgroundImage: `url(${sheet})`}" aria-hidden="true"></span>
    </template>
</template>

<style scoped>
.voice-mascot {
    --frames: 6;
    --size: 120px;
    position: absolute;
    top: calc(var(--size) * -200 / 256);
    right: calc(var(--size) * (230 - 256) / 256);
    z-index: 1;
    width: var(--size);
    height: var(--size);
    background-repeat: no-repeat;
    background-size: calc(var(--size) * var(--frames)) var(--size);
    pointer-events: none;
    animation: voice-mascot-idle 1.7s steps(6) infinite;
}

@keyframes voice-mascot-idle {
    from {
        background-position-x: 0;
    }

    to {
        background-position-x: calc(var(--size) * var(--frames) * -1);
    }
}

@media (max-width: 560px), (prefers-reduced-motion: reduce) {
    .voice-mascot {
        display: none;
    }
}
</style>
