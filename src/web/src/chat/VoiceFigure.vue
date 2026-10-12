<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {agent} from "../composables/leadAgent.js";
import {useHomeViews} from "../composables/homeViews.js";
import {figureRise, figureStatus} from "../composables/voiceFigure.js";
import {SEATED, beatsAfter, clipOf, eggFor, facesAfter, figureStateOf, testResultsAfter} from "../domain/figureState.js";
import {loadVoiceFigure} from "../figure/assets.js";
import {BUBBLE, HANGS, ODDS, SETTLED_SECONDS, perchOn, perchSpot} from "../figure/perches.js";
import {WORKED_SECONDS, ambientFor, flips, reactionTo, workClip} from "../figure/reactions.js";
import {HOME, boxAt, openTabs, pointedView, seatOf, seatRise, spotOf} from "../figure/places.js";
import {rows} from "../sync/rows.js";

// The figure is this many pixels square, as the chat's flat figure is; it walks this many of them a second and hops in this many milliseconds
const SIZE = 112;
const WALK_SPEED = 90;
// a jump crouches this long before it leaves the ground and is in the air for this long, a little longer for a higher perch; a fall
// takes as long as a body takes to drop that far
const JUMP_CROUCH_MS = 280;
const JUMP_AIR_MS = 420;
const JUMP_AIR_PER_PIXEL = 0.25;
const GRAVITY = 2400;
const FLIP_CROUCH_MS = 290;
const FLIP_AIR_MS = 600;
const JUMP_EASING = "cubic-bezier(0.2, 0.7, 0.4, 1)";
const FALL_EASING = "cubic-bezier(0.55, 0, 0.9, 0.6)";
// how often the figure looks again at what the agent does and where things are, in milliseconds
const LOOK_EVERY = 1000;
// below the figure's feet in its picture, as a share of its height: the clips' ground row (figure.js GROUND)
let ground = 0;

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
// the one-off clips waiting to play, oldest first, each as {clip, card}: a reaction to a moment, or the egg that belongs to it; `card` is
// the key of the chat mark the figure turns to face while it plays, or ""
const beats = ref([]);
// when each reaction last played, when each ambient one may next play, and the state each test run's card had when last looked at
const reacted = new Map();
const ambientDue = new Map();
const testStates = new Map();
// the eggs played so far, so none plays twice for one occurrence or twice in a row
const played = [];
// the voice's own entrance plays when its figure appears, and its exit when the environment's agent goes; with no agent it is not shown
const arriving = ref(false);
// the landing plays once after a jump or a fall, unless the figure goes on to hang
const landing = ref(false);
const leaving = ref(false);
const here = ref(false);
let seenAt = Date.now() / 1000;
let playing = {name: "", started: 0, shown: null, index: 0};
// the clip on screen, so the page can draw what the rig has no bones for, such as the bug the squire chases
const shownClip = ref(null);

const held = computed(() => figureStateOf(agent.value, rows("work"), waitingSince.value, now.value));
const target = ref({x: 0, y: 0, view: null});
// the bubble the figure perches on, as the figure's perches.js describes it, or null while it sits on the compose box's edge
let perch = null;
let perchedAt = Date.now() / 1000;
// the sides, "l" or "r", of the hands this voice carries nothing in, which it can hang by
let hands = [];
// what the figure rests on, as the element and where the figure is on it, watched each frame; null while it moves
let footing = null;
let destination = null;
let footFrame = 0;
// the working clip the figure rolled for the working state it is in, so it does not change its mind within it
let worked = {state: "", clip: ""};
// the user has typed in the compose box since the last look, and when the agent's work began, so that finishing it is a moment
let typed = false;
let workBegan = 0;
const WORKING = new Set(["thinking", "searching", "writing", "running"]);

// the first of these clips the figure has; idle when it has none of them
const clipNamed = (...names) =>
    names.map((name) => clips.find((clip) => clip.name === name)).find(Boolean) || clips.find((clip) => clip.name === "idle");
const hasClip = (name) => clips.some((clip) => clip.name === name);

// what the figure plays now: a walk while it moves, a beat until it is done, its one pointed remark, pointing once it stands at a tab, or the held state's clip
function current() {
    if (leaving.value) return {clip: clipNamed("exit"), facing: 0, once: true, departure: true};
    if (arriving.value) return {clip: clipNamed("enter"), facing: 0, once: true, arrival: true};
    if (moving.value?.hopping) return {clip: clipNamed(moving.value.clip), facing: 0};
    if (landing.value) return {clip: clipNamed("land"), facing: 0, once: true, landed: true};
    if (moving.value) return {clip: clipNamed("walk"), facing: moving.value.way > 0 ? 90 : 270};
    if (beats.value.length) return {clip: clipNamed(beats.value[0].clip), facing: facingCard(beats.value[0].card), once: true};
    // pointing is a pose, so it plays only while the agent itself waits on the user; at work, it stands at the tab doing the work
    if (target.value.view && held.value.state === "asking") return {clip: clipNamed("point"), facing: 0};
    if (perch?.kind === HANGS && !moving.value) return {clip: clipNamed(`hang_${perch.grip}`), facing: 0};
    const clip = clipNamed(heldClip());
    return {clip, facing: clip.name === "sit_on_edge" ? target.value.face ?? 0 : 0};
}

// the clip the held state shows: a working state is sometimes a laptop on the lap, rolled once for the stretch of that state
function heldClip() {
    const {state} = held.value;
    if (worked.state !== state) worked = {state, clip: workClip(state, clipOf(state), Math.random)};
    return worked.clip;
}

// the way the figure turns to look at a chat mark, to its right or its left, or toward the viewer when the mark is not on the page
function facingCard(key) {
    const mark = key && document.querySelector(`[data-figure-mark="${CSS.escape(key)}"]`);
    if (!mark) return 0;
    const box = mark.getBoundingClientRect();
    return box.left + box.width / 2 > at.value.x + SIZE / 2 ? 90 : 270;
}

const keyOf = (shown) => `${shown.clip.name}/${shown.facing}`;
const frameOf = (clip) => Math.floor(((performance.now() - playing.started) / 1000) * clip.fps);

// A clip plays out before another starts, so the figure never reads as cut off: one that plays once leaves at its end, a loop at the end
// of its cycle, or of the stretch the clip names as `leaves`. It is the one rule every clip goes through, so no clip needs its own check.
function playedOut() {
    if (!playing.shown) return true;
    const {clip} = playing.shown;
    const index = frameOf(clip);
    if (!clip.loops) return index >= clip.frames;
    const unit = clip.leaves || clip.frames;
    return Math.floor(index / unit) > Math.floor(playing.index / unit);
}

function step() {
    clearTimeout(frameTimer);
    if (!player || document.hidden) return;
    const wanted = current();
    const shown = keyOf(wanted) === playing.name || playedOut() ? wanted : playing.shown;
    const key = keyOf(shown);
    if (playing.name !== key) playing = {name: key, started: performance.now(), shown, index: 0};
    shownClip.value = shown.clip;
    const index = frameOf(shown.clip);
    playing.index = index;
    if (shown.once && index >= shown.clip.frames) {
        if (shown.departure) {
            leaving.value = false;
            here.value = false;
            return;
        }
        if (shown.arrival) arriving.value = false;
        else if (shown.landed) landing.value = false;
        else beats.value = beats.value.slice(1);
        playing = {name: "", started: 0, shown: null, index: 0};
        return step();
    }
    player.show(shown.clip, shown.clip.loops ? index % shown.clip.frames : Math.min(index, shown.clip.frames - 1), shown.facing);
    frameTimer = setTimeout(step, 1000 / shown.clip.fps);
}

// the figure's feet on a spot: its picture's left and top in the window
const figureSize = () => ({size: SIZE, below: ground});
const placed = (spot) => {
    const box = boxAt(spot, figureSize());
    return {x: box.left, y: box.top};
};

function moveTo(spot) {
    const from = at.value;
    const to = placed(spot);
    destination = spot;
    if (Math.hypot(to.x - from.x, to.y - from.y) < 2) {
        settle();
        return;
    }
    footing = null;
    const walk = (Math.abs(to.x - from.x) / WALK_SPEED) * 1000;
    const height = Math.abs(to.y - from.y);
    const up = to.y < from.y;
    const flip = up && flips(height, SIZE, Math.random);
    const air = up ? JUMP_AIR_MS + Math.min(height, 400) * JUMP_AIR_PER_PIXEL : Math.sqrt((2 * height) / GRAVITY) * 1000;
    const hop = {
        x: to.x,
        y: to.y,
        ms: height > 2 ? (flip ? FLIP_AIR_MS : air) : 0,
        lead: flip ? FLIP_CROUCH_MS : up ? JUMP_CROUCH_MS : 0,
        easing: up ? JUMP_EASING : FALL_EASING,
        hopping: true,
        clip: flip ? "backflip" : up ? "jump" : "fall",
    };
    const stroll = {x: to.x, y: up ? from.y : to.y, ms: walk, lead: 0, easing: "linear"};
    // up to a perch it walks to below it and then jumps; down from one it falls first and then walks, never walking on air
    moving.value = {way: Math.sign(to.x - from.x) || 1, legs: up ? [stroll, hop] : [{...hop, x: from.x}, stroll]};
    nextLeg();
}

const leg = ref({x: 0, y: 0, ms: 0, lead: 0, easing: "linear"});

let legTimer = 0;

function nextLeg() {
    clearTimeout(legTimer);
    landing.value = Boolean(moving.value?.hopping) && perch?.kind !== HANGS;
    const legs = moving.value?.legs || [];
    const next = legs.find((each) => each.ms > 0);
    if (!next) {
        moving.value = null;
        settle();
        return step();
    }
    if (!playedOut()) {
        legTimer = setTimeout(nextLeg, 50);
        return step();
    }
    moving.value = {...moving.value, hopping: Boolean(next.hopping), clip: next.clip, legs: legs.slice(legs.indexOf(next) + 1)};
    leg.value = next;
    at.value = {x: next.x, y: next.y};
    step();
}

// the figure comes to rest on what it was going to: where it is on that element is what it keeps as the element moves
function settle() {
    const element = destination?.on;
    if (!element?.isConnected) {
        footing = null;
        return;
    }
    const box = element.getBoundingClientRect();
    footing = {element, dx: at.value.x - box.left, dy: at.value.y - box.top};
}

// The ground is real: each frame, what the figure rests on carries it along if it moves, and if it is gone the figure falls at once,
// from wherever it is to whatever ground there is now. It does not wait for its clip, as gravity does not.
function watchFooting() {
    footFrame = requestAnimationFrame(watchFooting);
    if (!footing || moving.value || !here.value || document.hidden) return;
    const {element, dx, dy} = footing;
    const box = element.isConnected ? element.getBoundingClientRect() : null;
    if (!box?.width) return dropped();
    const to = {x: box.left + dx, y: box.top + dy};
    if (Math.hypot(to.x - at.value.x, to.y - at.value.y) > 0.3) at.value = to;
}

function dropped() {
    footing = null;
    letGo();
    clearTimeout(legTimer);
    playing = {name: "", started: 0, shown: null, index: 0};
    beats.value = [];
    landing.value = false;
    target.value = seatOf(figureSize(), {x: at.value.x + SIZE / 2, y: at.value.y + (1 - ground) * SIZE});
    moveTo(target.value);
}

const seatedCalm = () => heldClip() === "sit_on_edge" && !beats.value.length && !arriving.value && !leaving.value;

// the thread the main chat shows, whose bubbles the figure may perch on
const threadScroll = () => document.querySelector(HOME)?.closest(".thread")?.querySelector(".thread-scroll") ?? null;

const letGo = () => {
    perch = null;
    perchedAt = now.value;
};

// where the figure goes: its perch on a bubble while it has one and is calm, now and then a new one after a settled stretch on the compose
// box's edge, otherwise the edge's corner when it is seated, or the spot its work or what it points at gives
function targetFor(feet) {
    const thread = threadScroll();
    if (perch) {
        const spot = thread && perchSpot(perch, thread, figureSize());
        if (spot && seatedCalm() && now.value - perchedAt < perch.stay) return {...spot, view: null};
        letGo();
    }
    if (thread && seatedCalm() && now.value - perchedAt > SETTLED_SECONDS && Math.random() * ODDS < 1) {
        perch = perchOn([...thread.querySelectorAll(BUBBLE)], thread, figureSize(), hands, Math.random);
        perchedAt = now.value;
        if (perch) return {...perchSpot(perch, thread, figureSize()), view: null};
    }
    return SEATED.includes(heldClip()) ? seatOf(figureSize(), feet) : spotOf(pointedView(counts.value, openTabs()), figureSize(), feet);
}

function look() {
    clearTimeout(lookTimer);
    now.value = Date.now() / 1000;
    const waiting = counts.value.question + counts.value.waiting + counts.value.suggestion > 0;
    waitingSince.value = waiting ? waitingSince.value || now.value : 0;
    const happened = [...beatsAfter(agent.value, seenAt), ...testResultsAfter(agent.value, testStates), ...facesAfter(rows("reaction"), seenAt)];
    if (happened.length) seenAt = Math.max(seenAt, ...happened.map((fire) => fire.at));
    const fresh = [...happened, ...momentsOfWork()];
    const waited = {state: held.value.state, since: held.value.since, lasted: now.value - held.value.since};
    const eggs = [...fresh.map((fire) => eggOf(fire) || reactionClip(fire)), eggOf(waited), ambientClip(waited)];
    beats.value = [...beats.value, ...eggs.filter(Boolean)];
    const feet = {x: at.value.x + SIZE / 2, y: at.value.y + (1 - ground) * SIZE};
    target.value = targetFor(feet);
    if (!moving.value && !arriving.value) moveTo(target.value);
    if (!document.hidden) lookTimer = setTimeout(look, LOOK_EVERY);
}

// the moments of the agent's work and of the user at the compose box: typing, and the end of a stretch of work
function momentsOfWork() {
    const moments = [];
    if (typed) moments.push({beat: "typing", at: now.value});
    typed = false;
    const working = WORKING.has(held.value.state);
    if (working && !workBegan) workBegan = now.value;
    if (!working && workBegan) {
        if (now.value - workBegan >= WORKED_SECONDS) moments.push({beat: "work_done", at: now.value});
        workBegan = 0;
    }
    return moments;
}

const onType = (event) => {
    if (event.target.closest?.(HOME)) typed = true;
};

// the clip the figure reacts to a beat with, when it reacts to it at all, as a beat to play, facing the chat mark that caused it if it should
function reactionClip(fire) {
    const reaction = reactionTo(fire.beat, reacted, now.value, Math.random);
    return reaction && hasClip(reaction.clip) ? {clip: reaction.clip, card: reaction.toward === "card" ? fire.card || "" : ""} : null;
}

// what it does by itself while it sits at rest, now and then
function ambientClip(waited) {
    if (!seatedCalm() || perch) return null;
    const clip = ambientFor(waited.state, waited.lasted, ambientDue, now.value, Math.random);
    return clip && hasClip(clip) ? {clip, card: ""} : null;
}

// the egg that belongs to a moment, kept as played, when the voice has its clip
function eggOf(moment) {
    const egg = eggFor(voice.value, moment, played);
    if (!egg || !hasClip(egg.clip)) return null;
    played.push(egg);
    return {clip: egg.clip, card: ""};
}

// the environment's agent arriving or going: the figure enters, or makes its exit and is gone
function present(live) {
    if (!player || live === here.value) return;
    if (live) {
        here.value = true;
        at.value = placed(spotOf(null, figureSize()));
    }
    leaving.value = !live;
    arriving.value = live;
    step();
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
        hands = Object.keys(module.SIDES).filter((side) => !figure.stance.busy.has(side) && !figure.stance.level.has(side));
        testResultsAfter(agent.value, testStates);
        ground = module.GROUND;
        below.value = module.GROUND;
        canvas.value.width = canvas.value.height = Math.round(SIZE * (window.devicePixelRatio || 1));
        player = new FigurePlayer(figure, canvas.value);
        at.value = placed(spotOf(null, figureSize()));
        here.value = Boolean(agent.value);
        arriving.value = here.value;
        figureStatus.value = "shown";
        cancelAnimationFrame(footFrame);
        footFrame = requestAnimationFrame(watchFooting);
        look();
        step();
    } catch (error) {
        console.error(error);
        figureStatus.value = "failed";
    }
}

watch(voice, load);
watch([here, figureStatus], () => (figureRise.value = here.value && figureStatus.value === "shown" ? seatRise(figureSize()) : 0));
watch(() => Boolean(agent.value), present);
onMounted(() => {
    document.addEventListener("visibilitychange", seen);
    document.addEventListener("input", onType, true);
    window.addEventListener("resize", look);
    load(voice.value);
});
onUnmounted(() => {
    cancelAnimationFrame(footFrame);
    clearTimeout(legTimer);
    figureRise.value = 0;
    clearTimeout(frameTimer);
    clearTimeout(lookTimer);
    document.removeEventListener("visibilitychange", seen);
    document.removeEventListener("input", onType, true);
    window.removeEventListener("resize", look);
});

const chasing = computed(() => shownClip.value?.name === "squire_chase");
// the laptop on its lap while it types
const typing = computed(() => shownClip.value?.name === "type");
// the hearts that rise from its head while it answers a heart
const hearted = computed(() => shownClip.value?.name === "hearts");
// during an entrance or exit what is below the edge the figure stands on is hidden, as the box it climbs over or drops past would hide it
const passing = computed(() => ["enter", "exit"].includes(shownClip.value?.name));
const below = ref(0);
const chaseMs = computed(() => (chasing.value ? (shownClip.value.frames / shownClip.value.fps) * 1000 : 0));

const style = computed(() => ({
    width: `${SIZE}px`,
    height: `${SIZE}px`,
    transform: `translate(${at.value.x}px, ${at.value.y}px)`,
    transition: moving.value ? `transform ${leg.value.ms}ms ${leg.value.easing} ${leg.value.lead}ms` : "none",
}));
</script>

<template>
    <div v-show="figureStatus === 'shown' && here" class="voice-figure" :style="style" aria-hidden="true" @transitionend="nextLeg">
        <div :class="['voice-figure-actor', {chasing}]" :style="chasing ? {animationDuration: `${chaseMs}ms`} : null">
            <canvas ref="canvas" class="voice-figure-canvas" :style="passing ? {clipPath: `inset(0 0 ${below * 100}% 0)`} : null" />
            <template v-if="hearted">
                <template v-for="n in 3" :key="n">
                    <svg :class="['voice-figure-heart', `heart-${n}`]" viewBox="0 0 16 14" width="14" height="12">
                        <path d="M8 13C-4 5 3-2 8 3c5-5 12 2 0 10z" fill="#ff6b9a" />
                    </svg>
                </template>
            </template>
            <template v-if="typing">
                <svg class="voice-figure-laptop" viewBox="0 0 44 28" width="44" height="28">
                    <rect x="2" y="1" width="40" height="22" rx="3" fill="#2b2e38" stroke="#8b8e97" stroke-width="1.2" />
                    <circle cx="22" cy="12" r="3" fill="#5e64c9" />
                    <path d="M0 25h44l-3 3H3z" fill="#474a52" />
                </svg>
            </template>
            <template v-if="chasing">
                <svg class="voice-figure-bug" :style="{animationDuration: `${chaseMs}ms`}" viewBox="0 0 16 12" width="16" height="12">
                    <path d="M3 3 1 1M3 6H0M3 9 1 11M13 3l2-2M13 6h3M13 9l2 2" stroke="currentColor" stroke-width="1.2" />
                    <ellipse cx="8" cy="6" rx="5" ry="4" fill="currentColor" />
                </svg>
            </template>
        </div>
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

/* one thin edge in the page's own text colour, so the figure reads on a dark page and a light one alike; a wider
   second shadow reads as a halo around it rather than an edge on it */
.voice-figure-canvas {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 1px color-mix(in srgb, var(--text) 45%, transparent));
}

.voice-figure-actor {
    width: 100%;
    height: 100%;
}

/* three hearts float up from the figure's head, one after the other */
.voice-figure-heart {
    position: absolute;
    top: 14%;
    left: 50%;
    opacity: 0;
    animation: voice-figure-heart 1.4s ease-out forwards;
}

.voice-figure-heart.heart-1 {
    margin-left: -26px;
}

.voice-figure-heart.heart-2 {
    margin-left: 8px;
    animation-delay: 0.3s;
}

.voice-figure-heart.heart-3 {
    margin-left: -9px;
    animation-delay: 0.6s;
}

@keyframes voice-figure-heart {
    0% {
        transform: translateY(0) scale(0.5);
        opacity: 0;
    }

    20% {
        opacity: 1;
    }

    100% {
        transform: translateY(-34px) scale(1);
        opacity: 0;
    }
}

/* the laptop open on its lap, its lid towards the viewer */
.voice-figure-laptop {
    position: absolute;
    left: 50%;
    bottom: 14%;
    transform: translateX(-50%);
}

/* the squire runs out across the pane after the bug and comes back */
.voice-figure-actor.chasing {
    animation-name: voice-figure-chase;
    animation-timing-function: ease-in-out;
}

@keyframes voice-figure-chase {
    0%,
    100% {
        transform: none;
    }

    50% {
        transform: translateX(160px);
    }
}

/* the bug runs off ahead of the squire and gets away while he turns back */
.voice-figure-bug {
    position: absolute;
    bottom: 8%;
    left: 60%;
    color: var(--text);
    animation-name: voice-figure-bug;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
}

@keyframes voice-figure-bug {
    0% {
        transform: translateX(0);
        opacity: 1;
    }

    45% {
        transform: translateX(120%) translateX(60px);
        opacity: 1;
    }

    60% {
        transform: translateX(120%) translateX(90px);
        opacity: 0;
    }

    100% {
        transform: translateX(120%) translateX(90px);
        opacity: 0;
    }
}
</style>
