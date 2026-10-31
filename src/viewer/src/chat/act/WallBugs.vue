<script setup>
import {computed, useId} from "vue";
import {ACTS, cameraDrops} from "../../figure/acts.js";

// The bugs of a fixed test run crawling on the chat window's walls, drawn in 3D (`bug`, its pictures one for each step of its stride,
// figure.js Stage.drawBug), each `bugs` one where it is on its wall in the picture's pixels, its feet to the wall (acts.js bugShotScene):
// shot, it is gone and leaves nothing where it sat: it burst into slush (acts.js slushAt), `slush` the particles still flying, each a green
// blob, and the splashes of those landed, each a small green splash on a chat box, the floor or an edge of the window, fading and running
// down its face. A box's `clip` keeps its splashes on the visible part of that box as it scrolls. And `camera`, the
// shot bugs whose slush flies at the screen, each with the seconds since its shot and where it burst, whose drops fly out at the screen,
// growing as they come, land on it as on a camera's lens and run down as they fade (acts.js cameraDrops). `u` of the way through the bug
// shot, for the bugs' stride; the picture's `middle` across, and the picture `size` pixels square.
const props = defineProps({
    u: {type: Number, required: true},
    middle: {type: Number, required: true},
    size: {type: Number, required: true},
    bug: {type: Object, required: true},
    bugs: {type: Array, required: true},
    slush: {type: Array, default: () => []},
    camera: {type: Array, default: () => []},
});

const act = ACTS.bug_shot;
const GREEN = "#9bd34a";
const DARK_GREEN = "#5f8f24";
const clipId = useId();

// each bug still crawling as it is drawn, named by its place in the shot, its picture for the step of its stride it is at
const drawn = computed(() => {
    const step = Math.floor((props.u * act.frames) / 2) % 2;
    return props.bugs.flatMap((each, index) => (each.shot ? [] : [{name: `bug${index}`, place: `translate(${each.x} ${each.y}) rotate(${each.turn})`, href: props.bug.pictures[step]}]));
});
const splashes = computed(() => props.slush.filter((each) => !each.flying).map((each, index) => ({...each, name: `splash${index}`})));
const flying = computed(() => props.slush.filter((each) => each.flying).map((each, index) => ({...each, name: `slush${index}`})));
const picture = computed(() => ({x: -props.bug.at.x, y: -props.bug.at.y, width: props.bug.width, height: props.bug.height}));
const drops = computed(() => props.camera.flatMap((each, shot) => cameraDrops(each.seconds, props.size, each.from, {x: props.middle, y: props.size * 0.5}).map((drop, index) => ({...drop, name: `drop${shot}-${index}`}))));
</script>

<template>
    <template v-for="each in drawn" :key="each.name">
        <g :transform="each.place">
            <image :href="each.href" :x="picture.x" :y="picture.y" :width="picture.width" :height="picture.height" data-act-bug />
        </g>
    </template>
    <defs>
        <template v-for="each in splashes" :key="each.name">
            <clipPath v-if="each.clip" :id="`${clipId}-${each.name}`">
                <rect :x="each.clip.left" :y="each.clip.top" :width="each.clip.right - each.clip.left" :height="each.clip.bottom - each.clip.top" />
            </clipPath>
        </template>
    </defs>
    <g v-for="each in splashes" :key="each.name" :clip-path="each.clip ? `url(#${clipId}-${each.name})` : null" :data-act-surface="each.on === 'surface' ? '' : null">
        <template v-if="each.run > 0">
            <rect :x="each.x - each.r * 0.22" :y="each.y" :width="each.r * 0.44" :height="each.run" :rx="each.r * 0.2" :fill="GREEN" stroke="none" :opacity="each.opacity * 0.75" data-act-run />
            <circle :cx="each.x" :cy="each.y + each.run" :r="each.r * 0.4" :fill="GREEN" :stroke="DARK_GREEN" stroke-width="0.5" :opacity="each.opacity * 0.9" />
        </template>
        <ellipse :cx="each.x" :cy="each.y" :rx="each.r * (each.on === 'floor' || each.on === 'top' ? 1.4 : 0.7)" :ry="each.r * (each.on === 'floor' || each.on === 'top' ? 0.7 : 1.4)" :fill="GREEN" :stroke="DARK_GREEN" stroke-width="0.5" :opacity="each.opacity * 0.9" data-act-splash />
    </g>
    <template v-for="each in flying" :key="each.name">
        <circle :cx="each.x" :cy="each.y" :r="each.r" :fill="GREEN" :stroke="DARK_GREEN" stroke-width="0.5" data-act-slush />
    </template>
    <template v-for="drop in drops" :key="drop.name">
        <g class="figure-act-lens" :opacity="drop.fade">
            <template v-if="drop.landed">
                <rect :x="drop.x - drop.r * 0.25" :y="drop.y" :width="drop.r * 0.5" :height="drop.run" rx="2" fill="#9bd34a" opacity="0.8" />
                <circle :cx="drop.x" :cy="drop.y + drop.run" :r="drop.r * 0.4" fill="#9bd34a" />
            </template>
            <circle :cx="drop.x" :cy="drop.y" :r="drop.r" :fill="GREEN" opacity="0.85" data-act-lens />
            <circle :cx="drop.x - drop.r * 0.3" :cy="drop.y - drop.r * 0.3" :r="drop.r * 0.25" fill="#e8ffd0" opacity="0.8" />
        </g>
    </template>
</template>

<style scoped>
/* a drop of the bug's splatter on the screen, soft as a drop on a camera's lens is */
.figure-act-lens {
    filter: blur(0.7px);
}
</style>
