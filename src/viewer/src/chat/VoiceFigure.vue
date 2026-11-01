<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {BLINK, blinkOpenness, nextBlinkMs} from "../figure/blink.js";
import {loadVoiceFigure} from "../figure/assets.js";
import {heldClip} from "../figure/heldClip.js";
import {GROUND} from "../figure/figure.js";
import {readFloors} from "../figure/floors.js";
import {strideAtDistance} from "../figure/gait.js";
import {GLANCE, glanceAfter, glancePoint} from "../figure/looks.js";
import {between, bubbleNear, perchOn, perchSpot} from "../figure/perches.js";
import {READING, readingAt, readingFacing} from "../figure/reactions.js";
import {boxAt, cornerAt, freeEdge, freeSpot, restOf, tripTo} from "../figure/places.js";
import {airborneFrame, fallingFrom, legAt, legEnded} from "../domain/figureMotion.js";
import {useFigureBody} from "../composables/figureBody.js";

// the figure of a voice at home on the compose box, playing the clip for the tool in hand and blinking now and then; with nothing to do it
// strolls along the edge it stands on to the other corner and back, its legs striding as far as it goes; three.js and the figure load only
// when a voice is chosen
const props = defineProps({voice: {type: String, required: true}, running: {type: String, default: ""}, heardAt: {type: Number, default: 0}, facedAt: {type: Number, default: 0}});
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
const ANSWER_SECONDS = 3;
const PERCH_SECONDS = [6, 12];
const CLIMB_SHARE = 0.4;
let perch = null;
let glance = null;
let reading = null;
let readAt = 0;
const READ_SECONDS = [20, 45];
const HEAD_HEIGHT = 0.3;

const {body, start: startBody, stop: stopBody} = useFigureBody(frame);

const clipNamed = (name) => clips.find((clip) => clip.name === name) ?? clips.find((clip) => clip.name === "idle");
const placed = (spot) => {
    const box = boxAt(spot, figure, spot.posture);
    return {x: box.left, y: box.top};
};

// the spot the figure rests on now: a corner of the edge it stands on, or the bubble it climbed onto while that stays in view, kept as the
// page moves under it
function rest() {
    const held = perch && perchSpot(perch, readFloors(), figure);
    if (perch && !held) {
        perch = null;
        body.airborne = fallingFrom(body.place, null, readFloors().floors, performance.now());
        return;
    }
    body.place = held ?? restOf(figure, body.place.on ? body.place : null);
    body.at = placed(body.place);
    body.here = true;
}

// a trip to `spot`: its legs run one after the other, each carrying the picture from where the one before it ended
function setOff(spot) {
    const trip = tripTo(body.place, spot, figure, {random: Math.random});
    const legs = trip?.legs.filter((each) => each.ms > 0);
    if (!legs?.length) return false;
    body.trip = {to: spot, way: trip.way, legs: legs.slice(1)};
    startLeg(legs[0], body.at, performance.now());
    return true;
}

function startLeg(leg, from, now) {
    body.leg = leg;
    body.walk = {from: {...from}, began: now, on: null};
}

// a stroll to the corner of the edge farther from where it stands, or from a bubble down to the edge
function stroll() {
    const {element, edge} = freeEdge();
    const far = cornerAt(edge, body.place.x - edge.left < edge.width / 2 ? "right" : "left", figure);
    const spot = freeSpot([{...far, view: null, on: element}], figure, body.place);
    const set = spot && setOff(spot);
    if (set) perch = null;
    return set;
}

// a climb onto a bubble in view, by the jump the trip has for the height
function climb() {
    const taken = perchOn(readFloors(), figure, [], Math.random, {now: performance.now() / 1000});
    const spot = taken?.kind === "stand" && perchSpot(taken, readFloors(), figure);
    if (!spot || !setOff(spot)) return false;
    perch = taken;
    return true;
}

function walk(now) {
    body.at = legAt(body.leg, body.walk.from, now - body.walk.began);
    if (!legEnded(body.leg, body.walk.began, now)) return;
    const [next, ...legs] = body.trip.legs;
    if (next) {
        body.trip = {...body.trip, legs};
        return startLeg(next, body.at, now);
    }
    body.place = body.trip.to;
    body.trip = null;
    strollAt = now + between(perch ? PERCH_SECONDS : STROLL_SECONDS, Math.random) * 1000;
    rest();
}

// the bubble went from under it: it falls through the air to the floor below, then rests where it lands
function fall(now) {
    const {airborne, landed} = airborneFrame(body.airborne, readFloors().floors, now, reducedMotion());
    body.airborne = airborne;
    if (airborne) body.at = placed(airborne);
    else if (landed) {
        body.place = landed.spot;
        strollAt = now + between(STROLL_SECONDS, Math.random) * 1000;
        rest();
    }
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// it reads along a bubble beside it: its body turned to the bubble and its eyes following the lines, for a few seconds
function startReading(now) {
    readAt = now + between(READ_SECONDS, Math.random) * 1000;
    const floor = bubbleNear(readFloors(), body.place, figure);
    if (floor && !body.airborne) reading = {floor, began: now};
}

function stopReading(now) {
    reading = null;
    readAt = now + between(READ_SECONDS, Math.random) * 1000;
}

function frame() {
    if (!player) return;
    const now = performance.now();
    if (body.airborne) {
        if (reading) stopReading(now);
        fall(now);
        return draw(now);
    }
    if (body.trip) walk(now);
    else if (frames++ % 6 === 0) rest();
    if (!body.trip && !reading && now > readAt) startReading(now);
    if (reading && (body.trip || body.airborne || now - reading.began > READING.seconds * 1000)) stopReading(now);
    if (!body.trip && !reading && now > strollAt && !props.running) {
        if (perch || !(Math.random() < CLIMB_SHARE && climb())) stroll();
        strollAt = now + 1000;
    }
    draw(now);
}

// a face the user just put on a message is answered with joy, for a moment, where it stands
const answering = () => Date.now() / 1000 - props.facedAt < ANSWER_SECONDS;

function draw(now) {
    const walking = Boolean(body.trip) && !body.airborne;
    const clip = clipNamed(body.airborne ? "fall" : walking ? (body.leg.clip ?? "walk") : answering() ? "joy" : heldClip(props.running, props.heardAt, Date.now() / 1000));
    if (clip.name !== shownClip) {
        shownClip = clip.name;
        began = now;
    }
    const index = Math.floor(((now - began) / 1000) * clip.fps) % clip.frames;
    const blinking = blinkOpenness(now - blinkAt);
    if (now - blinkAt > BLINK.close + BLINK.open) blinkAt = now + nextBlinkMs(Math.random);
    const facing = walking ? (body.trip.way > 0 ? 90 : 270) : reading ? readingFacing(reading.floor, body.at.x + SIZE / 2, SIZE) : (body.place.face ?? 0);
    const stride = walking && !body.leg.hopping ? strideAtDistance(Math.abs(body.at.x - body.walk.from.x), SIZE) : null;
    const seconds = now / 1000;
    glance = glanceAfter(glance, seconds, Math.random, GLANCE);
    const at = walking || body.airborne ? null : reading ? readingAt(reading.floor, (now - reading.began) / 1000) : glancePoint(glance, seconds, {x: body.at.x + SIZE / 2, y: body.at.y + SIZE * HEAD_HEIGHT}, SIZE);
    player.show(clip, index, facing, {posture: walking && !body.leg.hopping ? "walk" : "stand", open: blinking, stride, at});
}

const style = computed(() => ({transform: `translate(${body.at.x}px, ${body.at.y}px)`, width: `${SIZE}px`, height: `${SIZE}px`}));

// each start takes a number; a start that finds a later one taken, or the figure stopped, while its files load gives up
let started = 0;

async function start() {
    const mine = ++started;
    try {
        const [figure, {FigurePlayer}, {CLIPS}] = await Promise.all([loadVoiceFigure(props.voice), import("../figure/player.js"), import("../figure/figure.js")]);
        if (mine !== started) return;
        clips = CLIPS;
        player = new FigurePlayer(figure, canvas.value);
        strollAt = performance.now() + between(STROLL_SECONDS, Math.random) * 1000;
        readAt = performance.now() + between(READ_SECONDS, Math.random) * 1000;
        rest();
        startBody();
    } catch (error) {
        if (mine === started) failure.value = String(error.message ?? error);
    }
}

function stop() {
    started++;
    stopBody();
    body.here = false;
    body.trip = null;
    body.airborne = null;
    perch = null;
    reading = null;
    glance = null;
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
