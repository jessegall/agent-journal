<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {BLINK, blinkOpenness, nextBlinkMs} from "../figure/blink.js";
import {loadVoiceFigure} from "../figure/assets.js";
import {heldClip} from "../figure/heldClip.js";
import {GROUND} from "../figure/figure.js";
import {strideAtDistance} from "../figure/gait.js";
import {between} from "../figure/perches.js";
import {boxAt, cornerAt, freeEdge, freeSpot, restOf, tripTo} from "../figure/places.js";
import {legAt, legEnded} from "../domain/figureMotion.js";
import {useFigureBody} from "../composables/figureBody.js";

// the figure of a voice at home on the compose box, playing the clip for the tool in hand and blinking now and then; with nothing to do it
// strolls along the edge it stands on to the other corner and back, its legs striding as far as it goes; three.js and the figure load only
// when a voice is chosen
const props = defineProps({voice: {type: String, required: true}, running: {type: String, default: ""}, heardAt: {type: Number, default: 0}});
const SIZE = 112;
const canvas = ref(null);
const failure = ref("");
let player = null;
let clips = [];
let blinkAt = performance.now() + nextBlinkMs(Math.random);
let began = performance.now();
let shownClip = "";
let strollAt = 0;
let frames = 0;
const figure = {size: SIZE, below: GROUND};
const STROLL_SECONDS = [8, 20];

const {body, start: startBody, stop: stopBody} = useFigureBody(frame);

const clipNamed = (name) => clips.find((clip) => clip.name === name) ?? clips.find((clip) => clip.name === "idle");
const placed = (spot) => {
    const box = boxAt(spot, figure, spot.posture);
    return {x: box.left, y: box.top};
};

// the spot the figure rests on now, a corner of the edge it stands on, kept as the page moves under it
function rest() {
    body.place = restOf(figure, body.place.on ? body.place : null);
    body.at = placed(body.place);
    body.here = true;
}

// a stroll to the corner of the edge farther from where it stands: a straight trip, only its walk
function stroll() {
    const {element, edge} = freeEdge();
    const far = cornerAt(edge, body.place.x - edge.left < edge.width / 2 ? "right" : "left", figure);
    const spot = freeSpot([{...far, view: null, on: element}], figure, body.place);
    const trip = spot && tripTo(body.place, spot, figure, {straight: true});
    const leg = trip?.legs.find((each) => each.ms > 0);
    if (!leg) return;
    body.trip = {to: spot, way: trip.way};
    body.leg = leg;
    body.walk = {from: {...body.at}, began: performance.now(), on: null};
    body.trip.moves = true;
}

function walk(now) {
    const elapsed = now - body.walk.began;
    body.at = legAt(body.leg, body.walk.from, elapsed);
    if (!legEnded(body.leg, body.walk.began, now)) return;
    body.place = body.trip.to;
    body.trip = null;
    strollAt = now + between(STROLL_SECONDS, Math.random) * 1000;
    rest();
}

function frame() {
    if (!player) return;
    const now = performance.now();
    if (body.trip) walk(now);
    else if (frames++ % 6 === 0) rest();
    if (!body.trip && now > strollAt && !props.running) stroll();
    draw(now);
}

function draw(now) {
    const walking = Boolean(body.trip);
    const clip = clipNamed(walking ? "walk" : heldClip(props.running, props.heardAt, Date.now() / 1000));
    if (clip.name !== shownClip) {
        shownClip = clip.name;
        began = now;
    }
    const index = Math.floor(((now - began) / 1000) * clip.fps) % clip.frames;
    const blinking = blinkOpenness(now - blinkAt);
    if (now - blinkAt > BLINK.close + BLINK.open) blinkAt = now + nextBlinkMs(Math.random);
    const facing = walking ? (body.trip.way > 0 ? 90 : 270) : (body.place.face ?? 0);
    const stride = walking ? strideAtDistance(Math.abs(body.at.x - body.walk.from.x), SIZE) : null;
    player.show(clip, index, facing, {posture: walking ? "walk" : "stand", open: blinking, stride});
}

const style = computed(() => ({transform: `translate(${body.at.x}px, ${body.at.y}px)`, width: `${SIZE}px`, height: `${SIZE}px`}));

async function start() {
    try {
        const [figure, {FigurePlayer}, {CLIPS}] = await Promise.all([loadVoiceFigure(props.voice), import("../figure/player.js"), import("../figure/figure.js")]);
        clips = CLIPS;
        player = new FigurePlayer(figure, canvas.value);
        strollAt = performance.now() + between(STROLL_SECONDS, Math.random) * 1000;
        rest();
        startBody();
    } catch (error) {
        failure.value = String(error.message ?? error);
    }
}

function stop() {
    stopBody();
    body.here = false;
    player = null;
}

onMounted(start);
onUnmounted(stop);
watch(() => props.voice, () => {
    stop();
    start();
});
</script>

<template>
    <canvas v-show="body.here" ref="canvas" class="voice-figure" data-figure-canvas :data-voice="voice" :data-failure="failure || undefined" :style="style" :width="SIZE" :height="SIZE" aria-hidden="true" />
</template>

<style scoped>
.voice-figure {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
}
</style>
