<script setup>
import {computed} from "vue";
import {ACTS} from "../figure/acts.js";
import AskSign from "./act/AskSign.vue";
import {COLOURS} from "./act/colours.js";
import DiscoBall from "./act/DiscoBall.vue";
import FileCard from "./act/FileCard.vue";
import FumeSteam from "./act/FumeSteam.vue";
import HandRub from "./act/HandRub.vue";
import PackBox from "./act/PackBox.vue";
import Parachute from "./act/Parachute.vue";
import PogoStick from "./act/PogoStick.vue";
import PressPlate from "./act/PressPlate.vue";
import ThoughtCloud from "./act/ThoughtCloud.vue";
import VacuumCleaner from "./act/VacuumCleaner.vue";
import WallBugs from "./act/WallBugs.vue";

// What the figure holds and what grows beside it while it acts out a journal moment or a search (figure/acts.js), drawn over its picture:
// the act `name`, `u` of the way through it, 0 to 1; the free hand's grip, the eyes and the feet as shares of the picture (`hand.out` the
// way across the picture the free hand's side is, 1 to the right, and `hand.other` the other hand's grip); the picture `size` pixels square; and `room`, the pixels from its left
// and right sides to the screen's edges, which a runner runs off past; `ball`, where the disco ball hangs over the feet while it
// dances (perches.js discoBall); `canopy`, the parachute's canopy drawn in 3D (figure.js Stage.drawCanopy); and `bug`, a fixed run's
// bug drawn in 3D (figure.js Stage.drawBug), with `wallBugs`, the bug shot's bugs on the chat window's walls in the picture's pixels
// (acts.js bugShotScene), `slush` its flying slush and the splashes it left and `camera` the bugs whose slush flies at the screen, in the
// same pixels. Each act's drawing is its own component in act/, given these in pixels.
const props = defineProps({
    name: {type: String, required: true},
    u: {type: Number, required: true},
    hand: {type: Object, required: true},
    head: {type: Object, required: true},
    feet: {type: Number, required: true},
    size: {type: Number, required: true},
    room: {type: Object, required: true},
    ball: {type: Object, default: null},
    canopy: {type: Object, default: null},
    bug: {type: Object, default: null},
    wallBugs: {type: Array, default: () => []},
    slush: {type: Array, default: () => []},
    camera: {type: Array, default: () => []},
});

const px = (share) => share * props.size;
const hand = computed(() => ({x: px(props.hand.x), y: px(props.hand.y)}));
const other = computed(() => ({x: px(props.hand.other.x), y: px(props.hand.other.y)}));
const head = computed(() => ({x: px(props.head.x), y: px(props.head.y)}));
const floor = computed(() => px(props.feet));
const middle = computed(() => px(0.5));
const out = computed(() => props.hand.out);
// whether the act shows thinking with a thought cloud (acts.js ponder, think_cloud, type_ponder)
const thinking = computed(() => Boolean(ACTS[props.name].pulse));
</script>

<template>
    <svg class="figure-act" :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" aria-hidden="true" :data-act="name">
        <g :stroke="COLOURS.ink" stroke-width="1" stroke-linejoin="round">
            <template v-if="name === 'ask_sign'">
                <AskSign :u="u" :hand="hand" />
            </template>
            <template v-if="thinking">
                <ThoughtCloud :name="name" :u="u" :head="head" :out="out" :size="size" />
            </template>
            <template v-if="name === 'file_card'">
                <FileCard :u="u" :hand="hand" :middle="middle" :floor="floor" :out="out" :size="size" />
            </template>
            <template v-if="name === 'hand_rub'">
                <HandRub :u="u" :hand="hand" />
            </template>
            <template v-if="name === 'fume'">
                <FumeSteam :u="u" :head="head" />
            </template>
            <template v-if="name === 'bug_shot' && bug">
                <WallBugs :u="u" :middle="middle" :size="size" :bug="bug" :bugs="wallBugs" :slush="slush" :camera="camera" />
            </template>
            <template v-if="name === 'disco' && ball">
                <DiscoBall :u="u" :middle="middle" :floor="floor" :size="size" :ball="ball" />
            </template>
            <template v-if="name === 'pogo'">
                <PogoStick :u="u" :middle="middle" :floor="floor" :size="size" />
            </template>
            <template v-if="name === 'chute' && canopy">
                <Parachute :u="u" :head="head" :hand="hand" :other="other" :size="size" :canopy="canopy" />
            </template>
            <template v-if="name === 'pack_box'">
                <PackBox :u="u" :middle="middle" :floor="floor" />
            </template>
            <template v-if="name === 'press'">
                <PressPlate :u="u" :middle="middle" :size="size" />
            </template>
            <template v-if="name === 'vacuum'">
                <VacuumCleaner :u="u" :hand="hand" :middle="middle" :floor="floor" :out="out" :size="size" />
            </template>
        </g>
    </svg>
</template>

<style scoped>
.figure-act {
    position: absolute;
    left: 0;
    top: 0;
    overflow: visible;
    pointer-events: none;
    filter: drop-shadow(0 0 1px color-mix(in srgb, var(--text) 45%, transparent));
}
</style>
