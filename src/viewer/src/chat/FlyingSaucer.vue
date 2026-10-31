<script setup>
import {computed} from "vue";
import {UFO} from "../figure/parcels.js";

// The UFO that comes for the parcels once the work is committed: its middle at `x`, `y` on the page, in pixels, drawn in 3D by the figure's
// own renderer (figure.js Stage.drawSaucer) as `saucer`, its pictures one for each step of its rim lights' blink, how large they are and
// where its middle is on them; and under it, from the lamp under its belly (parcels.js beamOf), a beam of light as strong as `beam`, 0 to 1,
// reaching `reach` pixels down and `width` pixels wide at its foot, as wide as what it lifts.
const props = defineProps({
    x: {type: Number, required: true},
    y: {type: Number, required: true},
    saucer: {type: Object, required: true},
    beam: {type: Number, default: 0},
    reach: {type: Number, default: 0},
    width: {type: Number, default: 34},
});

const style = computed(() => ({left: `${props.x}px`, top: `${props.y}px`}));
// the beam as a trapezium from the lamp down to its foot, in a box as wide as its foot or the lamp, whichever is wider
const span = computed(() => Math.max(props.width, UFO.lamp));
const beamBox = computed(() => ({left: `${-span.value / 2}px`, top: `${UFO.belly}px`, width: `${span.value}px`, height: `${props.reach}px`, opacity: props.beam}));
const beamPath = computed(() => {
    const [lamp, foot] = [(span.value - UFO.lamp) / 2, (span.value - props.width) / 2];
    return `M${lamp} 0H${span.value - lamp}L${span.value - foot} ${props.reach}H${foot}Z`;
});
// the saucer's pictures laid over each other, its middle on the UFO's, each shown for its step of the blink in turn
const hull = computed(() => ({
    left: `${-props.saucer.at.x}px`,
    top: `${-props.saucer.at.y}px`,
    width: `${props.saucer.width}px`,
    height: `${props.saucer.height}px`,
    "--blink-ms": `${UFO.blinkMs * props.saucer.pictures.length}ms`,
}));
const stepStyle = (index) => ({animationDelay: `${-(props.saucer.pictures.length - index) * UFO.blinkMs}ms`});
</script>

<template>
    <div class="flying-saucer" :style="style" aria-hidden="true">
        <template v-if="beam > 0">
            <svg class="flying-saucer-beam" :style="beamBox" :viewBox="`0 0 ${span} ${reach}`" :width="span" :height="reach">
                <defs>
                    <linearGradient id="flying-saucer-beam" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stop-color="#fff3a8" stop-opacity="0.85" />
                        <stop offset="1" stop-color="#fff3a8" stop-opacity="0.2" />
                    </linearGradient>
                </defs>
                <path :d="beamPath" fill="url(#flying-saucer-beam)" />
            </svg>
        </template>
        <div class="flying-saucer-hull" :style="hull">
            <template v-for="(picture, index) in saucer.pictures" :key="index">
                <img class="flying-saucer-step" :src="picture" :style="stepStyle(index)" alt="" />
            </template>
        </div>
    </div>
</template>

<style scoped>
.flying-saucer {
    position: fixed;
    z-index: 41;
    width: 0;
    height: 0;
    pointer-events: none;
}

.flying-saucer-beam {
    position: absolute;
    z-index: -1;
}

/* the saucer rocks gently as it hovers */
.flying-saucer-hull {
    position: absolute;
    filter: drop-shadow(0 0 1px color-mix(in srgb, var(--text) 45%, transparent));
    animation: flying-saucer-rock 2400ms ease-in-out infinite;
}

/* the pictures of the blink's steps lie over each other, each showing for its own step in turn */
.flying-saucer-step {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: flying-saucer-blink var(--blink-ms) steps(1, end) infinite;
}

@keyframes flying-saucer-blink {
    0% {
        opacity: 1;
    }

    25% {
        opacity: 0;
    }
}

@keyframes flying-saucer-rock {
    0%,
    100% {
        rotate: -2deg;
    }

    50% {
        rotate: 2deg;
    }
}

@media (prefers-reduced-motion: reduce) {
    .flying-saucer-hull,
    .flying-saucer-step {
        animation: none;
    }

    .flying-saucer-step:first-child {
        opacity: 1;
    }
}
</style>
