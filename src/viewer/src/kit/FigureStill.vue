<script setup>
import {onMounted, onUnmounted, ref, watch} from "vue";
import {loadVoiceFigure} from "../figure/assets.js";

// A voice's 3D figure standing at rest, drawn once when it comes into view, where a voice is shown to be chosen or named
const props = defineProps({voice: {type: String, default: ""}, size: {type: Number, default: 150}});
const canvas = ref(null);
let seen = null;

async function draw() {
    if (!props.voice || !canvas.value) return;
    const [figure, {CLIPS}, {FigurePlayer}] = await Promise.all([loadVoiceFigure(props.voice), import("../figure/figure.js"), import("../figure/player.js")]);
    if (!canvas.value) return;
    canvas.value.width = canvas.value.height = Math.round(props.size * (window.devicePixelRatio || 1));
    const idle = CLIPS.find((clip) => clip.name === "idle");
    new FigurePlayer(figure, canvas.value).show(idle, 0, 30, {posture: "stand"});
}

onMounted(() => {
    seen = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        seen.disconnect();
        draw();
    });
    seen.observe(canvas.value);
});
onUnmounted(() => seen?.disconnect());
watch(() => props.voice, draw);
</script>

<template>
    <canvas ref="canvas" class="figure-still" :style="{width: `${size}px`, height: `${size}px`}" />
</template>

<style scoped>
.figure-still {
    display: block;
}
</style>
