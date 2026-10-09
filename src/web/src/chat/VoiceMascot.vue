<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {afterSeconds, animationLabel, pickWeighted, placeOf, placedAt, showcaseOn} from "../domain/mascots.js";
import {animations, scheduleOf, urlOf} from "../composables/voiceAnimations.js";
import {loadProfiles, mascotOf, profiles, profilesLoaded} from "../composables/profiles.js";
import SpritePlayer from "../kit/SpritePlayer.vue";

const mascot = computed(() => mascotOf.value);
const showcase = showcaseOn();
const rested = ref(null);
const playing = ref(null);
const staged = ref(null);
const turn = ref(0);
let last = null;
let stage = 0;
let blinkTimer = 0;
let actTimer = 0;

if (!profilesLoaded.value) loadProfiles().catch(console.error);

function play(sheet) {
    turn.value += 1;
    playing.value = sheet;
}

function blink() {
    if (!playing.value) play({...mascot.value.blink, still: true});
}

function act() {
    last = pickWeighted(mascot.value.acts, mascot.value.schedule, last);
    clearTimeout(blinkTimer);
    play(last);
}

const waitForBlink = () => mascot.value.blink && (blinkTimer = setTimeout(blink, afterSeconds(mascot.value.schedule.blink)));
const waitForAct = () => (actTimer = setTimeout(act, afterSeconds(mascot.value.schedule.idle)));

const steps = computed(() =>
    profiles.value.flatMap((row) =>
        (animations.value[row.n] || []).map((animation) => ({
            url: urlOf(row.n, animation),
            edit: animation.edit,
            place: placedAt(placeOf(row.data.art || ""), scheduleOf(row.n).place),
            label: `${row.title.toLowerCase()} \u00b7 ${animationLabel(animation)}`,
        }))
    )
);

function showNext() {
    if (!steps.value.length) return;
    staged.value = steps.value[stage++ % steps.value.length];
    play({...staged.value, still: false});
}

function ended() {
    if (showcase) return showNext();
    const wasAct = !playing.value.still;
    playing.value = null;
    waitForBlink();
    if (wasAct && mascot.value.acts.length) waitForAct();
}

function stop() {
    clearTimeout(blinkTimer);
    clearTimeout(actTimer);
    playing.value = null;
    rested.value = null;
    last = null;
}

watch(
    mascot,
    (now) => {
        if (showcase) return;
        stop();
        if (!now || !(now.acts.length || now.blink)) return;
        rested.value = now.acts[0] ?? now.blink;
        waitForBlink();
        if (now.acts.length) waitForAct();
    },
    {immediate: true}
);
if (showcase) watch(steps, () => staged.value || showNext(), {immediate: true});
onUnmounted(stop);

const shown = computed(() => playing.value ?? (showcase ? staged.value : rested.value));
const place = computed(() => (showcase ? staged.value?.place : mascot.value.place));
const placed = computed(() => ({"--edge": place.value.edge, "--line": place.value.line}));
</script>

<template>
    <template v-if="shown">
        <span class="voice-mascot" :style="placed" aria-hidden="true">
            <SpritePlayer :key="turn" :url="shown.url" :edit="shown.edit" :playing="Boolean(playing)" @ended="ended" />
        </span>
        <template v-if="showcase">
            <span class="voice-mascot-label" :style="placed" aria-hidden="true">{{ staged.label }}</span>
        </template>
    </template>
</template>

<style scoped>
.voice-mascot {
    --size: 128px;
    position: absolute;
    top: calc(var(--size) * var(--line) / -256);
    right: calc(12px + var(--size) * (var(--edge) - 256) / 256);
    z-index: 1;
    width: var(--size);
    height: var(--size);
    pointer-events: none;
}

.voice-mascot-label {
    --size: 128px;
    position: absolute;
    top: calc(var(--size) * var(--line) / -256 + 8px);
    right: calc(12px + var(--size) * (1 + (var(--edge) - 256) / 256) + 8px);
    z-index: 1;
    color: var(--muted, #8a8f98);
    font-size: 11px;
    white-space: nowrap;
    pointer-events: none;
}

@media (max-width: 560px), (prefers-reduced-motion: reduce) {
    .voice-mascot,
    .voice-mascot-label {
        display: none;
    }
}
</style>
