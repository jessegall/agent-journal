<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {ACT_SECONDS, afterSeconds, animationLabel, BLINK_SECONDS, otherThan, placeOf, showcaseOn} from "../domain/mascots.js";
import {animations, urlOf} from "../composables/voiceAnimations.js";
import {loadProfiles, mascotOf, profiles, profilesLoaded} from "../composables/profiles.js";

const mascot = computed(() => mascotOf.value);
const rested = ref(null);
const playing = ref(null);
const turn = ref(0);
const showcase = showcaseOn();
const staged = ref(null);
let stage = 0;
let blinks = null;
let acts = [];
let last = null;
let blinkTimer = 0;
let actTimer = 0;

if (!profilesLoaded.value) loadProfiles().catch(console.error);

const measured = (url) =>
    new Promise((resolve) => {
        if (!url) return resolve(null);
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

const steps = computed(() =>
    profiles.value.flatMap((row) =>
        (animations.value[row.n] || []).map((animation) => ({
            url: urlOf(row.n, animation),
            place: placeOf(row.data.art || ""),
            label: `${row.title.toLowerCase()} \u00b7 ${animationLabel(animation)}`,
        }))
    )
);

async function showNext() {
    if (!steps.value.length) return;
    const step = steps.value[stage++ % steps.value.length];
    const sheet = await measured(step.url);
    if (!sheet) return showNext();
    staged.value = step;
    play({...sheet, still: false});
}

function ended(event) {
    if (event.animationName !== "voice-mascot-idle") return;
    if (showcase) return showNext();
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
        if (showcase) return;
        stop();
        if (!now) return;
        const [blink, ...found] = await Promise.all([now.blink, ...now.acts].map(measured));
        if (mascot.value !== now) return;
        acts = found.filter(Boolean);
        if (!acts.length) return;
        blinks = blink && {...blink, still: true};
        rested.value = acts[0];
        waitForBlink();
        waitForAct();
    },
    {immediate: true}
);
onUnmounted(stop);
if (showcase) watch(steps, () => staged.value || showNext(), {immediate: true});

const place = computed(() => (showcase ? staged.value?.place : mascot.value.place));
const stood = computed(() => ({"--edge": place.value.edge, "--foot": place.value.foot}));
const shown = computed(() => playing.value ?? rested.value);
const look = computed(() => ({
    backgroundImage: `url(${shown.value.url})`,
    "--frames": shown.value.frames,
    "--edge": place.value.edge,
    "--foot": place.value.foot,
}));
</script>

<template>
    <template v-if="showcase ? staged && shown : mascot && rested">
        <span :key="turn" :class="['voice-mascot', {playing: Boolean(playing)}]" :style="look" aria-hidden="true" @animationend="ended"></span>
        <span v-if="showcase" class="voice-mascot-label" :style="stood" aria-hidden="true">{{ staged.label }}</span>
    </template>
</template>

<style scoped>
.voice-mascot {
    --size: 128px;
    --rate: 3.5;
    position: absolute;
    top: calc(var(--size) * var(--foot) / -256);
    right: calc(12px + var(--size) * (var(--edge) - 256) / 256);
    z-index: 1;
    width: var(--size);
    height: var(--size);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: calc(var(--size) * var(--frames)) var(--size);
    pointer-events: none;
}

.voice-mascot-label {
    --size: 128px;
    position: absolute;
    top: calc(var(--size) * var(--foot) / -256 + 8px);
    right: calc(12px + var(--size) * (1 + (var(--edge) - 256) / 256) + 8px);
    z-index: 1;
    background: none;
    font-size: 11px;
    color: var(--muted, #8a8f98);
    white-space: nowrap;
    pointer-events: none;
}

.voice-mascot.playing {
    animation: voice-mascot-idle calc(var(--frames) / var(--rate) * 1s) steps(var(--frames)) 1;
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
    .voice-mascot,
    .voice-mascot-label {
        display: none;
    }
}
</style>
