<script setup>
import {computed} from "vue";

// The bug a fixed test run's mallet smashes, drawn in 3D (`bug`, its pictures one for each step of its stride, figure.js Stage.drawBug), on
// the page where it is (`at`, VoiceFigure.vue smashedBug): its feet at `x` and `y` in pixels, climbing up behind the box of its floor,
// whose top edge is at `edge` while it climbs, cut off there so it shows coming over it, turned `turn` degrees head up as it climbs and
// facing the way it walks, `way`, at the step `step` of its stride; smashed, it lies flat, splattered, and fades.
const props = defineProps({
    bug: {type: Object, required: true},
    at: {type: Object, required: true},
});

// how far round its feet the drawing reaches, in pixels
const ROOM = 48;

// the drawing's box on the page, its bottom at the edge the bug climbs over while it climbs
const style = computed(() => {
    const top = (props.at.edge ?? props.at.y) - ROOM;
    const bottom = props.at.edge ?? props.at.y + ROOM;
    return {left: `${props.at.x - ROOM}px`, top: `${top}px`, width: `${2 * ROOM}px`, height: `${bottom - top}px`};
});
const feet = computed(() => ({x: ROOM, y: props.at.y - (props.at.edge ?? props.at.y) + ROOM}));
const picture = computed(() => ({href: props.bug.pictures[props.at.step], x: -props.bug.at.x, y: -props.bug.at.y, width: props.bug.width, height: props.bug.height}));
const splat = computed(() => (props.at.flat > 0 ? props.at.shows : 0));
</script>

<template>
    <div class="fixed-run-bug" :style="style" aria-hidden="true" data-act-bug-box>
        <svg :width="2 * ROOM" height="100%">
            <template v-if="at.whole || at.flat">
                <image
                    :href="picture.href"
                    :x="picture.x"
                    :y="picture.y"
                    :width="picture.width"
                    :height="picture.height"
                    :opacity="at.shows"
                    :transform="`translate(${feet.x} ${feet.y}) rotate(${(at.way > 0 ? -1 : 1) * at.turn}) scale(${(at.way > 0 ? -1 : 1) * (1 + 0.4 * at.flat)} ${1 - 0.78 * at.flat})`"
                    data-act-bug
                />
            </template>
            <template v-if="splat">
                <path :transform="`translate(${feet.x} ${feet.y}) scale(${1.3 - 0.3 * splat})`" :opacity="splat" d="M-9 0q2-6 6-3 1-6 5-2 5-3 5 2 5 1 2 4 3 4-3 3-4 4-7 1-3 0-6-1-6-4-4-3Z" fill="#9bd34a" stroke="#5f8f24" stroke-width="0.8" />
            </template>
        </svg>
    </div>
</template>

<style scoped>
.fixed-run-bug {
    position: fixed;
    z-index: 39;
    overflow: hidden;
    pointer-events: none;
}

.fixed-run-bug svg {
    display: block;
}
</style>
