<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {agent} from "../composables/leadAgent.js";
import {useHomeViews} from "../composables/homeViews.js";
import {figureStatus} from "../composables/voiceFigure.js";
import {beatClipsOf, beatsAfter, clipOf, figureStateOf, POINTED_AFTER} from "../domain/figureState.js";
import {loadVoiceFigure} from "../figure/assets.js";
import {openTabs, pointedView, spotOf} from "../figure/places.js";
import {rows} from "../sync/rows.js";

// The figure is this many pixels square, as the chat's flat figure is; it walks this many of them a second and hops in this many milliseconds
const SIZE = 112;
const WALK_SPEED = 90;
const HOP_MS = 280;
const HOP_SPEED = 1500;
// how often the figure looks again at what the agent does and where things are, in milliseconds
const LOOK_EVERY = 1000;
// below the figure's feet in its picture, as a share of its height: the clips' ground row (figure.js GROUND)
let ground = 0;

const POINTED = {butler: "butler_pointed", homie: "homie_pointed", coach: "coach_pointed", colleague: "colleague_pointed", squire: "squire_pointed"};

const props = defineProps({voice: {type: String, required: true}});

const canvas = ref(null);
const voice = computed(() => props.voice);
const {views} = useHomeViews();
const counts = computed(() => Object.fromEntries(Object.entries(views.value).map(([key, view]) => [key, view.count || 0])));

let player = null;
let clips = [];
let frameTimer = 0;
let lookTimer = 0;
const now = ref(Date.now() / 1000);
const waitingSince = ref(0);
const at = ref({x: 0, y: 0});
const moving = ref(null);
const beats = ref([]);
let seenAt = Date.now() / 1000;
let pointedFor = 0;
let playing = {name: "", started: 0};

const held = computed(() => figureStateOf(agent.value, rows("work"), waitingSince.value, now.value));
const target = ref({x: 0, y: 0, view: null});

// the first of these clips the figure has; idle when it has none of them
const clipNamed = (...names) => names.map((name) => clips.find((clip) => clip.name === name)).find(Boolean) || clips.find((clip) => clip.name === "idle");
const hasClip = (name) => clips.some((clip) => clip.name === name);

// what the figure plays now: a walk while it moves, a beat until it is done, its one pointed remark, pointing once it stands at a tab, or the held state's clip
function current() {
    if (moving.value) return {clip: clipNamed("walk"), facing: moving.value.way > 0 ? 90 : 270};
    if (beats.value.length) return {clip: clipNamed(...beatClipsOf(voice.value, beats.value[0].beat)), facing: 0, once: true};
    const pointedDue = held.value.state === "asking" && now.value - held.value.since >= POINTED_AFTER && pointedFor !== held.value.since;
    if (pointedDue && hasClip(POINTED[voice.value])) {
        return {clip: clipNamed(POINTED[voice.value]), facing: 0, once: true, pointed: true};
    }
    if (target.value.view && !moving.value) return {clip: clipNamed("point"), facing: 0};
    return {clip: clipNamed(clipOf(held.value.state)), facing: 0};
}

function step() {
    clearTimeout(frameTimer);
    if (!player || document.hidden) return;
    const shown = current();
    const key = `${shown.clip.name}/${shown.facing}`;
    if (playing.name !== key) playing = {name: key, started: performance.now()};
    const index = Math.floor(((performance.now() - playing.started) / 1000) * shown.clip.fps);
    if (shown.once && index >= shown.clip.frames) {
        if (shown.pointed) pointedFor = held.value.since;
        else beats.value = beats.value.slice(1);
        playing = {name: "", started: 0};
        return step();
    }
    player.show(shown.clip, shown.clip.loops ? index % shown.clip.frames : Math.min(index, shown.clip.frames - 1), shown.facing);
    frameTimer = setTimeout(step, 1000 / shown.clip.fps);
}

// the figure's feet on a spot: its picture's left and top in the window
const placed = (spot) => ({x: spot.x - SIZE / 2, y: spot.y - (1 - ground) * SIZE});

function moveTo(spot) {
    const from = at.value;
    const to = placed(spot);
    if (Math.hypot(to.x - from.x, to.y - from.y) < 2) return;
    const walk = (Math.abs(to.x - from.x) / WALK_SPEED) * 1000;
    moving.value = {way: Math.sign(to.x - from.x) || 1, legs: [{x: to.x, y: from.y, ms: walk, easing: "linear"}, {x: to.x, y: to.y, ms: Math.abs(to.y - from.y) > 2 ? Math.max(HOP_MS, (Math.abs(to.y - from.y) / HOP_SPEED) * 1000) : 0, easing: "ease-out"}]};
    nextLeg();
}

const leg = ref({x: 0, y: 0, ms: 0, easing: "linear"});

function nextLeg() {
    const legs = moving.value?.legs || [];
    const next = legs.find((each) => each.ms > 0);
    if (!next) {
        moving.value = null;
        return step();
    }
    moving.value = {...moving.value, legs: legs.slice(legs.indexOf(next) + 1)};
    leg.value = next;
    at.value = {x: next.x, y: next.y};
    step();
}

function look() {
    clearTimeout(lookTimer);
    now.value = Date.now() / 1000;
    const waiting = counts.value.question + counts.value.waiting + counts.value.suggestion > 0;
    waitingSince.value = waiting ? waitingSince.value || now.value : 0;
    const fresh = beatsAfter(agent.value, seenAt);
    if (fresh.length) {
        seenAt = fresh[fresh.length - 1].at;
        beats.value = [...beats.value, ...fresh];
    }
    target.value = spotOf(pointedView(counts.value, openTabs()), (1 - ground) * SIZE);
    if (!moving.value) moveTo(target.value);
    if (!document.hidden) lookTimer = setTimeout(look, LOOK_EVERY);
}

const seen = () => {
    if (document.hidden) return;
    look();
    step();
};

async function load(name) {
    player = null;
    if (!name) return;
    try {
        const [figure, module] = await Promise.all([loadVoiceFigure(name), import("../figure/figure.js")]);
        if (name !== voice.value || !canvas.value) return;
        const {FigurePlayer} = await import("../figure/player.js");
        clips = module.CLIPS;
        ground = module.GROUND;
        canvas.value.width = canvas.value.height = Math.round(SIZE * (window.devicePixelRatio || 1));
        player = new FigurePlayer(figure, canvas.value);
        at.value = placed(spotOf(null));
        figureStatus.value = "shown";
        look();
        step();
    } catch (error) {
        console.error(error);
        figureStatus.value = "failed";
    }
}

watch(voice, load);
onMounted(() => {
    document.addEventListener("visibilitychange", seen);
    window.addEventListener("resize", look);
    load(voice.value);
});
onUnmounted(() => {
    clearTimeout(frameTimer);
    clearTimeout(lookTimer);
    document.removeEventListener("visibilitychange", seen);
    window.removeEventListener("resize", look);
});

const style = computed(() => ({
    width: `${SIZE}px`,
    height: `${SIZE}px`,
    transform: `translate(${at.value.x}px, ${at.value.y}px)`,
    transition: moving.value ? `transform ${leg.value.ms}ms ${leg.value.easing}` : "none",
}));
</script>

<template>
    <div v-show="figureStatus === 'shown'" class="voice-figure" :style="style" aria-hidden="true" @transitionend="nextLeg">
        <canvas ref="canvas" class="voice-figure-canvas" />
    </div>
</template>

<style scoped>
.voice-figure {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 40;
    pointer-events: none;
}

.voice-figure-canvas {
    width: 100%;
    height: 100%;
}
</style>
