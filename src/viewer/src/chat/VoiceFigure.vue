<script setup>
import {onMounted, onUnmounted, ref, watch} from "vue";
import {BLINK, blinkOpenness, nextBlinkMs} from "../figure/blink.js";
import {loadVoiceFigure} from "../figure/assets.js";
import {heldClip} from "../figure/heldClip.js";

// the figure of a voice at home on the compose box, standing as the agent works: still in place, playing the clip for the tool in hand, blinking
// now and then; three.js and the figure load only when a voice is chosen
const props = defineProps({voice: {type: String, required: true}, running: {type: String, default: ""}, heardAt: {type: Number, default: 0}});
const SIZE = 112;
const canvas = ref(null);
const failure = ref("");
let player = null;
let clips = [];
let timer = null;
let blinkAt = performance.now() + nextBlinkMs(Math.random);
let began = performance.now();
let shownClip = "";

const clipNamed = (name) => clips.find((clip) => clip.name === name) ?? clips.find((clip) => clip.name === "idle");

function draw() {
    if (!player) return;
    const clip = clipNamed(heldClip(props.running, props.heardAt, Date.now() / 1000));
    if (clip.name !== shownClip) {
        shownClip = clip.name;
        began = performance.now();
    }
    const now = performance.now();
    const index = Math.floor(((now - began) / 1000) * clip.fps) % clip.frames;
    const blinking = blinkOpenness(now - blinkAt);
    if (now - blinkAt > BLINK.close + BLINK.open) blinkAt = now + nextBlinkMs(Math.random);
    player.show(clip, index, 0, {posture: "stand", open: blinking});
}

async function start() {
    try {
        const [figure, {FigurePlayer}, {CLIPS}] = await Promise.all([loadVoiceFigure(props.voice), import("../figure/player.js"), import("../figure/figure.js")]);
        clips = CLIPS;
        player = new FigurePlayer(figure, canvas.value);
        timer = setInterval(draw, 1000 / 12);
        draw();
    } catch (error) {
        failure.value = String(error.message ?? error);
    }
}

function stop() {
    clearInterval(timer);
    timer = null;
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
    <canvas ref="canvas" class="voice-figure" data-figure-canvas :data-voice="voice" :data-failure="failure || undefined" :width="SIZE" :height="SIZE" aria-hidden="true" />
</template>

<style scoped>
.voice-figure {
    position: absolute;
    right: 16px;
    bottom: 100%;
    width: 112px;
    height: 112px;
    pointer-events: none;
}
</style>
