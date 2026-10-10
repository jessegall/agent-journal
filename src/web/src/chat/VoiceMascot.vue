<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {
    PRESENCE_GRACE_MS,
    afterSeconds,
    animationLabel,
    blinkOf,
    fallOf,
    hopOf,
    pickWeighted,
    placeOf,
    placedAt,
    showcaseOn,
} from "../domain/mascots.js";
import {animations, scheduleOf, urlOf} from "../composables/voiceAnimations.js";
import {loadProfiles, mascotOf, profiles, profilesLoaded} from "../composables/profiles.js";
import {loadPictures, loadRig, rigs, voiceOfArt} from "../composables/voiceRigs.js";
import RigPlayer from "../kit/RigPlayer.vue";
import SpritePlayer from "../kit/SpritePlayer.vue";

const NARROWEST_BOX = 320;
const still = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const PASSAGES = ["enter", "exit"];

const props = defineProps({present: Boolean, perch: {type: Number, default: 0}});

const mascot = computed(() => mascotOf.value);
const steady = ref(props.present);
let presenceTimer = 0;
watch(
    () => props.present,
    (now) => {
        clearTimeout(presenceTimer);
        presenceTimer = setTimeout(() => (steady.value = now), PRESENCE_GRACE_MS);
    }
);
onUnmounted(() => clearTimeout(presenceTimer));
const anchor = ref(null);
const roomy = ref(true);
let watching = null;
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

const waitForBlink = () => !still && mascot.value.blink && (blinkTimer = setTimeout(blink, afterSeconds(mascot.value.schedule.blink)));
const waitForAct = () => !still && (actTimer = setTimeout(act, afterSeconds(mascot.value.schedule.idle)));

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
        const sheet = now.acts[0] ?? now.blink;
        loadPictures([sheet.url]).then(() => {
            if (mascot.value !== now) return;
            rested.value = sheet;
            waitForBlink();
            if (now.acts.length) waitForAct();
        });
    },
    {immediate: true}
);
if (showcase) watch(steps, () => staged.value || showNext(), {immediate: true});
onMounted(() => {
    const box = anchor.value?.parentElement;
    if (!box || typeof ResizeObserver === "undefined") return;
    watching = new ResizeObserver(() => (roomy.value = box.clientWidth >= NARROWEST_BOX));
    watching.observe(box);
});
onUnmounted(() => {
    watching?.disconnect();
    stop();
});

const rigged = computed(() => (mascot.value ? rigs.value[mascot.value.voice] : null));
const move = ref(null);
const rigStaged = ref(null);
const here = ref(false);
const leaving = ref(false);
let lastMove = null;
let moveTimer = 0;
let rigBlinkTimer = 0;
let rigStage = 0;

const movesOf = (found) => found?.moves.filter((each) => !PASSAGES.includes(each.name)) || [];
const passageOf = (name) => rigged.value?.moves.find((each) => each.name === name) || null;

const rigSteps = computed(() =>
    profiles.value.flatMap((row) => {
        const voice = voiceOfArt(row.data.art);
        const found = rigs.value[voice];
        if (!found) return [];
        const place = placedAt(placeOf(row.data.art || ""), scheduleOf(row.n).place);
        return found.moves.map((each) => ({
            voice,
            rig: found.rig,
            move: each,
            place,
            label: `${row.title.toLowerCase()} \u00b7 ${each.name}`,
        }));
    })
);

function nextMove() {
    const moves = movesOf(rigged.value);
    const others = moves.filter((each) => each !== lastMove);
    lastMove = others[Math.floor(Math.random() * others.length)] || moves[0] || null;
    move.value = lastMove;
}

// The eyes are a layer of their own: the lids shut for a moment whatever the rest of the rig is doing, and open again.
const lids = ref("");

function shut(blink) {
    lids.value = "closed";
    rigBlinkTimer = setTimeout(() => {
        lids.value = "";
        if (blink.twice) return (rigBlinkTimer = setTimeout(() => shut({...blink, twice: false}), blink.again));
        waitForRigBlink();
    }, blink.shut);
}

const waitForMove = () => !still && (moveTimer = setTimeout(nextMove, afterSeconds(mascot.value.schedule.idle)));
const waitForRigBlink = () => !still && (rigBlinkTimer = setTimeout(() => shut(blinkOf()), afterSeconds(mascot.value.schedule.blink)));

function rest() {
    clearTimeout(moveTimer);
    clearTimeout(rigBlinkTimer);
    clearTimeout(hopTimer);
    lids.value = "";
}

function showNextMove() {
    if (!rigSteps.value.length) return;
    rigStaged.value = rigSteps.value[rigStage++ % rigSteps.value.length];
}

// A sitting voice hops onto its seat and off it instead of walking in behind the box's edge, so its hanging legs never vanish.
const hop = computed(() => hopOf(mascot.value?.voice));
const hopping = ref("");
let hopTimer = 0;

function hopThen(way, then) {
    hopping.value = way;
    hopTimer = setTimeout(() => {
        hopping.value = "";
        then();
    }, hop.value.ms);
}

function enter() {
    rest();
    leaving.value = false;
    here.value = true;
    waitForRigBlink();
    if (hop.value && !still) return hopThen("enter", settle);
    move.value = still ? null : passageOf("enter");
    if (!move.value) settle();
}

function leave() {
    rest();
    leaving.value = true;
    if (hop.value && !still) return hopThen("exit", gone);
    move.value = still ? null : passageOf("exit");
    if (!move.value) gone();
}

function gone() {
    leaving.value = false;
    here.value = false;
    move.value = null;
}

function settle() {
    move.value = null;
    waitForMove();
}

function moveEnded() {
    if (showcase) return showNextMove();
    if (leaving.value) return gone();
    settle();
}

watch(
    () => mascot.value?.voice,
    (voice) => voice && loadRig(voice),
    {immediate: true}
);
watch(
    [steady, rigged],
    ([present, found]) => {
        if (showcase || !found) return;
        if (present && (!here.value || leaving.value)) return enter();
        if (!present && here.value && !leaving.value) leave();
    },
    {immediate: true}
);
if (showcase) {
    watch(profiles, (rows) => rows.forEach((row) => loadRig(voiceOfArt(row.data.art))), {immediate: true});
    watch(rigSteps, () => rigStaged.value || showNextMove(), {immediate: true});
}
onUnmounted(rest);

const rigShown = computed(() =>
    showcase
        ? rigStaged.value
        : rigged.value && here.value
          ? {voice: mascot.value.voice, rig: rigged.value.rig, move: move.value, place: mascot.value.place}
          : null
);

const shown = computed(() => playing.value ?? (showcase ? staged.value : rested.value));
const place = computed(() => rigShown.value?.place ?? (showcase ? staged.value?.place : mascot.value.place));
const fall = computed(() => fallOf(mascot.value?.voice));
const moved = ref("");
let perchTimer = 0;
watch(
    () => props.perch,
    (now, was) => {
        clearTimeout(perchTimer);
        moved.value = now < was ? "dropping" : "launched";
        perchTimer = setTimeout(() => (moved.value = ""), fall.value.ms * 2);
    }
);
onUnmounted(() => clearTimeout(perchTimer));
const placed = computed(() => ({
    "--edge": place.value.edge,
    "--line": place.value.line,
    "--perch": `${props.perch}px`,
    "--fall-ms": `${fall.value.ms}ms`,
    "--squash": fall.value.squash,
    "--bounce": `${fall.value.bounce}px`,
    ...(hop.value && {
        "--hop-ms": `${hop.value.ms}ms`,
        "--rise": `${hop.value.rise}px`,
        "--drop": `${hop.value.drop}px`,
        "--hop-squash": hop.value.squash,
    }),
}));
const passage = computed(() => (PASSAGES.includes(rigShown.value?.move?.name) ? rigShown.value.move : null));
const passed = computed(() => (passage.value ? {...placed.value, "--length": `${passage.value.duration}ms`} : placed.value));
</script>

<template>
    <span ref="anchor" class="voice-mascot-anchor" hidden></span>
    <template v-if="rigShown && roomy">
        <span
            class="voice-mascot"
            :class="[passage && `passing ${passage.name}`, hopping && `hopping ${hopping}`, moved]"
            :style="passed"
            aria-hidden="true"
        >
            <RigPlayer :voice="rigShown.voice" :rig="rigShown.rig" :move="rigShown.move" :lids="lids" @ended="moveEnded" />
        </span>
        <template v-if="showcase">
            <span class="voice-mascot-label" :style="placed" aria-hidden="true">{{ rigShown.label }}</span>
        </template>
    </template>
    <template v-else-if="shown && roomy && (steady || showcase)">
        <span :class="['voice-mascot', moved]" :style="placed" aria-hidden="true">
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
    top: calc(var(--size) * var(--line) / -256 - var(--perch));
    right: calc(12px + var(--size) * (var(--edge) - 256) / 256);
    z-index: 3;
    width: var(--size);
    transform-origin: 50% 100%;
    transition: top 260ms cubic-bezier(0.2, 0.8, 0.3, 1);
    height: var(--size);
    pointer-events: none;
}

.voice-mascot.dropping {
    transition: top var(--fall-ms) cubic-bezier(0.55, 0, 1, 0.45);
    animation: mascot-land calc(var(--fall-ms) * 0.9) ease-out var(--fall-ms) both;
}

.voice-mascot.launched {
    animation: mascot-launch calc(var(--fall-ms) * 2) both;
}

@keyframes mascot-launch {
    0% {
        transform: none;
        animation-timing-function: ease-out;
    }

    35% {
        transform: translateY(calc(-1 * var(--size) / 5));
        animation-timing-function: ease-in;
    }

    70% {
        transform: scale(calc(1 + var(--squash)), calc(1 - var(--squash)));
        animation-timing-function: ease-out;
    }

    85% {
        transform: translateY(calc(-1 * var(--bounce)));
    }

    100% {
        transform: none;
    }
}

@keyframes mascot-land {
    0% {
        transform: scale(calc(1 + var(--squash)), calc(1 - var(--squash)));
    }

    45% {
        transform: translateY(calc(-1 * var(--bounce)));
    }

    100% {
        transform: none;
    }
}

.voice-mascot.passing {
    clip-path: inset(-100% -100% calc(var(--size) * (256 - var(--line)) / 256) -100%);
}

.voice-mascot.enter {
    animation: mascot-in 320ms ease-out both;
}

.voice-mascot.exit {
    animation: mascot-out 320ms ease-in calc(var(--length) - 320ms) both;
}

.voice-mascot.hopping.enter {
    animation: mascot-hop-on var(--hop-ms) ease-out both;
}

.voice-mascot.hopping.exit {
    animation: mascot-hop-off var(--hop-ms) ease-in both;
}

@keyframes mascot-hop-on {
    0% {
        opacity: 0;
        transform: translateY(var(--drop));
    }

    20% {
        opacity: 1;
        transform: translateY(var(--drop)) scale(calc(1 + var(--hop-squash)), calc(1 - var(--hop-squash)));
    }

    60% {
        transform: translateY(calc(-1 * var(--rise)));
    }

    82% {
        transform: scale(calc(1 + var(--hop-squash)), calc(1 - var(--hop-squash)));
    }

    100% {
        transform: none;
    }
}

@keyframes mascot-hop-off {
    0% {
        opacity: 1;
        transform: none;
    }

    35% {
        transform: translateY(calc(-1 * var(--rise)));
    }

    100% {
        opacity: 0;
        transform: translateY(var(--drop));
    }
}

@keyframes mascot-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes mascot-out {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}

.voice-mascot-label {
    --size: 128px;
    position: absolute;
    top: calc(var(--size) * var(--line) / -256 - var(--perch) + 8px);
    right: calc(12px + var(--size) * (1 + (var(--edge) - 256) / 256) + 8px);
    z-index: 1;
    color: var(--muted, #8a8f98);
    font-size: 11px;
    white-space: nowrap;
    pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
    .voice-mascot,
    .voice-mascot.dropping,
    .voice-mascot.launched {
        transition: none;
        animation: none;
    }
}

@media (max-width: 560px) {
    .voice-mascot,
    .voice-mascot-label {
        display: none;
    }
}
</style>
