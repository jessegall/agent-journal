<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {ACT_SECONDS, afterSeconds, BLINK_SECONDS, otherThan} from "../domain/mascots.js";
import {loadProfiles, mascotOf, profilesLoaded} from "../composables/profiles.js";

const mascot = computed(() => mascotOf.value);
const rested = ref(null);
const playing = ref(null);
const turn = ref(0);
let blinks = null;
let acts = [];
let last = null;
let blinkTimer = 0;
let actTimer = 0;

if (!profilesLoaded.value) loadProfiles().catch(console.error);

const measured = (url) =>
    new Promise((resolve) => {
        const probe = new Image();
        probe.onload = () => resolve({url, frames: Math.round(probe.naturalWidth / probe.naturalHeight)});
        probe.onerror = () => resolve(null);
        probe.src = url;
    });

function play(sheet) {
    turn.value += 1;
    playing.value = sheet;
}

function blink() {
    if (!playing.value) play(blinks);
}

function act() {
    last = otherThan(acts, last);
    clearTimeout(blinkTimer);
    play(last);
}

const waitForBlink = () => blinks && (blinkTimer = setTimeout(blink, afterSeconds(BLINK_SECONDS)));
const waitForAct = () => (actTimer = setTimeout(act, afterSeconds(ACT_SECONDS)));

function ended(event) {
    if (event.animationName !== "voice-mascot-idle") return;
    const wasAct = !playing.value.still;
    playing.value = null;
    waitForBlink();
    if (wasAct) waitForAct();
}

function stop() {
    clearTimeout(blinkTimer);
    clearTimeout(actTimer);
    playing.value = null;
    rested.value = null;
    blinks = null;
    acts = [];
    last = null;
}

watch(
    mascot,
    async (now) => {
        stop();
        if (!now) return;
        const [blink, ...found] = await Promise.all([now.blink, ...now.acts, now.single].map(measured));
        if (mascot.value !== now) return;
        const numbered = found.slice(0, now.acts.length).filter(Boolean);
        acts = numbered.length ? numbered : found.slice(now.acts.length).filter(Boolean);
        if (!acts.length) return;
        blinks = blink && {...blink, still: true};
        rested.value = acts[0];
        waitForBlink();
        waitForAct();
    },
    {immediate: true}
);
onUnmounted(stop);

const shown = computed(() => playing.value ?? rested.value);
const look = computed(() => ({
    backgroundImage: `url(${shown.value.url})`,
    "--frames": shown.value.frames,
    "--inset": `${mascot.value.place.inset}px`,
    "--lift": `${mascot.value.place.lift}px`,
    "--walk": `${mascot.value.place.walk}px`,
}));
const walks = computed(() => Boolean(playing.value) && !playing.value.still);
</script>

<template>
    <template v-if="mascot && rested">
        <span :key="turn" :class="['voice-mascot', {playing: Boolean(playing), walking: walks}]" :style="look" aria-hidden="true" @animationend="ended"></span>
    </template>
</template>

<style scoped>
.voice-mascot {
    --size: 120px;
    --rate: 3.5;
    position: absolute;
    top: calc(var(--size) * -200 / 256 - var(--lift));
    right: calc(var(--size) * (230 - 256) / 256 + var(--inset));
    z-index: 1;
    width: var(--size);
    height: var(--size);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: calc(var(--size) * var(--frames)) var(--size);
    pointer-events: none;
}

.voice-mascot.playing {
    animation: voice-mascot-idle calc(var(--frames) / var(--rate) * 1s) steps(var(--frames)) 1;
}

.voice-mascot.walking {
    animation:
        voice-mascot-idle calc(var(--frames) / var(--rate) * 1s) steps(var(--frames)) 1,
        voice-mascot-walk calc(var(--frames) / var(--rate) * 1s) steps(var(--frames)) 1;
}

@keyframes voice-mascot-idle {
    from {
        background-position-x: 0;
    }

    to {
        background-position-x: calc(var(--size) * var(--frames) * -1);
    }
}

@keyframes voice-mascot-walk {
    0%,
    100% {
        transform: translateX(0);
    }

    50% {
        transform: translateX(calc(var(--walk) * -1));
    }
}

@media (max-width: 560px), (prefers-reduced-motion: reduce) {
    .voice-mascot {
        display: none;
    }
}
</style>
