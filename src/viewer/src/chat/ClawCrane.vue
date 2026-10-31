<script setup>
import {computed} from "vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {CLAW, CUP, MAGNET, prongsOf} from "../figure/parcels.js";

// The crane that now and then takes the server units away in the UFO's place, its grabbers each taking one box (figure/parcels.js
// grabberAt), drawn inside the chat window `box` (its left, top, right and bottom on the page), so a box lifted past its top or pulled
// past its right edge is out of the window. Each of `grabbers` is the same reel with its own grabbing end: on the rail along the window's
// top, its trolley at page `x` and its end hanging `chain` pixels under the rail, `open` 1 wide open and 0 shut on its box, the claw, the
// suction cup or the magnet; or the arm, its reel at page height `y` on the window's right edge and its rod out to its tongs at page `tip`.
const props = defineProps({
    box: {type: Object, required: true},
    grabbers: {type: Array, required: true},
});

// the reel's trolley, the spool on it and its wheels, and where the cable leaves it, in pixels
const TROLLEY = {width: 30, height: 9, wheel: 2.2, spool: 3.2};
// the arm's tongs: how far each jaw reaches in over the box's side and how far above and below the rod it closes, from `open` wider
const TONGS = {reach: 6, closed: 9, open: 5};

const width = computed(() => props.box.right - props.box.left);
const height = computed(() => props.box.bottom - props.box.top);
const style = computed(() => ({left: `${props.box.left}px`, top: `${props.box.top}px`, width: `${width.value}px`, height: `${height.value}px`}));
const reels = computed(() => props.grabbers.filter((grabber) => grabber.kind !== "arm").map((grabber) => ({...grabber, across: grabber.x - props.box.left, hangs: TROLLEY.height + grabber.chain})));
const arms = computed(() => props.grabbers.filter((grabber) => grabber.kind === "arm").map((grabber) => ({...grabber, down: grabber.y - props.box.top, reach: grabber.tip - props.box.left})));

// each prong out from the hub along its bar and down beside the box, its tip out wide while the claw is open and in flat on the box's side
// once it is shut, turned in under a hook (parcels.js prongsOf)
const prongs = (open) => prongsOf(open).map(({way, top, tip, reach}) => `M${way * CLAW.hub} 0H${top}L${tip} ${reach}l${-way * CLAW.hook} ${CLAW.hook}`);
// the rubber cup as a dome open downward, its rim at the bottom, spread and flattened as it is pressed on the box
const cup = (open) => {
    const squash = 1 - CUP.squash * (1 - open);
    const half = (CUP.width / 2) * (2 - squash);
    const top = CUP.rod + CUP.height * (1 - squash);
    return `M${-half} ${CUP.rod + CUP.height}Q${-half} ${top} 0 ${top}Q${half} ${top} ${half} ${CUP.rod + CUP.height}Z`;
};
// the horseshoe, open downward under its block
const horseshoe = () => {
    const [half, inner, top, bottom] = [MAGNET.width / 2, MAGNET.width / 2 - MAGNET.leg, MAGNET.block, MAGNET.block + MAGNET.height];
    return `M${-half} ${bottom}V${top + half}A${half} ${half} 0 0 1 ${half} ${top + half}V${bottom}H${inner}V${top + half}A${inner} ${inner} 0 0 0 ${-inner} ${top + half}V${bottom}Z`;
};
// the tongs' two jaws at the rod's end, reaching in over the box's side above and below the rod, closing as `open` goes to 0
const jaws = (open) => {
    const spread = TONGS.closed + TONGS.open * open;
    return [-1, 1].map((way) => `M0 0L2 ${way * spread}H${-TONGS.reach}`);
};
</script>

<template>
    <div class="claw-crane" :style="style" aria-hidden="true">
        <svg class="claw-crane-drawing" :width="width" :height="height">
            <rect class="claw-crane-rail" x="0" y="0" :width="width" height="3" />
            <template v-if="arms.length">
                <rect class="claw-crane-rail" :x="width - 3" y="0" width="3" :height="height" />
            </template>
            <template v-for="reel in reels" :key="reel.id">
                <g :transform="`translate(${reel.across} 0)`" :data-grabber="reel.kind">
                    <line class="claw-crane-chain" x1="0" :y1="TROLLEY.height" x2="0" :y2="reel.hangs" />
                    <g :transform="`translate(0 ${reel.hangs})`">
                        <SwitchCase :value="reel.kind">
                            <template #claw>
                                <template v-for="(prong, index) in prongs(reel.open)" :key="index">
                                    <path class="claw-crane-prong" :d="prong" />
                                </template>
                                <rect class="claw-crane-hub" :x="-CLAW.hub" y="-3" :width="CLAW.hub * 2" height="5" rx="1.5" />
                            </template>
                            <template #cup>
                                <line class="claw-crane-rod" x1="0" y1="0" x2="0" :y2="CUP.rod + 1" />
                                <path class="claw-crane-cup" :d="cup(reel.open)" />
                            </template>
                            <template #default>
                                <rect class="claw-crane-hub" :x="-MAGNET.width / 4" y="0" :width="MAGNET.width / 2" :height="MAGNET.block" rx="1" />
                                <path class="claw-crane-magnet" :d="horseshoe()" />
                                <rect class="claw-crane-pole" :x="-MAGNET.width / 2" :y="MAGNET.block + MAGNET.height - 2.5" :width="MAGNET.leg" height="2.5" />
                                <rect class="claw-crane-pole" :x="MAGNET.width / 2 - MAGNET.leg" :y="MAGNET.block + MAGNET.height - 2.5" :width="MAGNET.leg" height="2.5" />
                                <template v-if="reel.open < 0.5">
                                    <path class="claw-crane-spark" :d="`M-11 ${MAGNET.block + MAGNET.height - 1}l-3 2M11 ${MAGNET.block + MAGNET.height - 1}l3 2M-9 ${MAGNET.block + MAGNET.height + 2}l-2 3M9 ${MAGNET.block + MAGNET.height + 2}l2 3`" />
                                </template>
                            </template>
                        </SwitchCase>
                    </g>
                    <rect class="claw-crane-trolley" :x="-TROLLEY.width / 2" y="1" :width="TROLLEY.width" :height="TROLLEY.height" rx="2" />
                    <circle class="claw-crane-spool" cx="0" :cy="1 + TROLLEY.height / 2" :r="TROLLEY.spool" />
                    <circle class="claw-crane-wheel" :cx="-TROLLEY.width / 2 + 5" cy="1" :r="TROLLEY.wheel" />
                    <circle class="claw-crane-wheel" :cx="TROLLEY.width / 2 - 5" cy="1" :r="TROLLEY.wheel" />
                </g>
            </template>
            <template v-for="arm in arms" :key="arm.id">
                <g :transform="`translate(0 ${arm.down})`" data-grabber="arm">
                    <line class="claw-crane-chain" :x1="arm.reach" y1="0" :x2="width - TROLLEY.height" y2="0" />
                    <g :transform="`translate(${arm.reach} 0)`">
                        <template v-for="(jaw, index) in jaws(arm.open)" :key="index">
                            <path class="claw-crane-prong" :d="jaw" />
                        </template>
                        <rect class="claw-crane-hub" x="-1" y="-3" width="5" height="6" rx="1.5" />
                    </g>
                    <g :transform="`translate(${width - 1} 0) rotate(90)`">
                        <rect class="claw-crane-trolley" :x="-TROLLEY.width / 2" y="1" :width="TROLLEY.width" :height="TROLLEY.height" rx="2" />
                        <circle class="claw-crane-spool" cx="0" :cy="1 + TROLLEY.height / 2" :r="TROLLEY.spool" />
                    </g>
                </g>
            </template>
        </svg>
    </div>
</template>

<style scoped>
.claw-crane {
    position: fixed;
    z-index: 41;
    overflow: hidden;
    pointer-events: none;
}

.claw-crane-drawing {
    display: block;
    overflow: visible;
    filter: drop-shadow(0 0 1px color-mix(in srgb, var(--text) 45%, transparent));
}

.claw-crane-rail {
    fill: #6b6f7c;
}

.claw-crane-trolley {
    fill: #e8b84a;
    stroke: #272936;
    stroke-width: 0.8;
}

.claw-crane-spool {
    fill: #35374b;
    stroke: #a9adb8;
    stroke-width: 0.8;
}

.claw-crane-wheel {
    fill: #35374b;
    stroke: #a9adb8;
    stroke-width: 0.6;
}

.claw-crane-chain {
    stroke: #a9adb8;
    stroke-width: 1.4;
    stroke-dasharray: 2 1.4;
}

.claw-crane-hub {
    fill: #a9adb8;
    stroke: #272936;
    stroke-width: 0.7;
}

.claw-crane-prong {
    fill: none;
    stroke: #c9ccd4;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.claw-crane-rod {
    stroke: #8b6a3e;
    stroke-width: 2.2;
    stroke-linecap: round;
}

.claw-crane-cup {
    fill: #c0392b;
    stroke: #272936;
    stroke-width: 0.8;
}

.claw-crane-magnet {
    fill: #d64545;
    stroke: #272936;
    stroke-width: 0.8;
}

.claw-crane-pole {
    fill: #c9ccd4;
    stroke: #272936;
    stroke-width: 0.6;
}

.claw-crane-spark {
    fill: none;
    stroke: #6ab0ff;
    stroke-width: 1.2;
    stroke-linecap: round;
}
</style>
