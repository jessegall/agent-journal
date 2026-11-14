<script setup>
import {isPaused, laneWord} from "./executionLanes.js";

// one tile per lane: its slots in use against its limit, how many wait, and Paused or Held; a click scrolls to the lane
defineProps({lanes: {type: Array, required: true}});
function scrollTo(event, lane) {
    const block = event.currentTarget.closest("[data-test-queue]").querySelector(`[data-lane="${lane.lane}"]`);
    block.scrollIntoView({block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
}
</script>
<template>
    <div class="tiles" data-queue-controls>
        <template v-for="lane in lanes" :key="lane.lane">
            <button type="button" class="tile" :data-queue-tile="lane.lane" @click="scrollTo($event, lane)">
                <small>{{ laneWord(lane.lane) }}<template v-if="isPaused(lane)"><span class="chip">Paused</span></template><template v-else-if="lane.halted"><span class="chip">Held</span></template></small>
                <b data-queue-tile-use>{{ lane.used }}<span> of {{ lane.capacity }}</span></b>
                <span class="meter" :class="{warn: lane.halted, bad: !lane.halted && lane.over_capacity}"><i :style="{width: `${Math.min(100, (lane.used / lane.capacity) * 100)}%`}" /></span>
                <span class="sub" :class="{on: lane.waiting.length}" data-queue-tile-waiting>{{ lane.waiting.length ? `${lane.waiting.length} waiting` : "Nothing waits" }}</span>
            </button>
        </template>
    </div>
</template>
<style scoped>
.tiles { display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); border-bottom:1px solid var(--border); }
.tile { display:flex; flex-direction:column; gap:2px; min-width:0; padding:10px 14px 11px; border:0; background:none; color:var(--text); font:inherit; text-align:left; cursor:pointer; }
.tile + .tile { border-left:1px solid var(--border); }
.tile:hover { background:var(--hover); }
.tile:focus-visible { outline:0; box-shadow:inset 0 0 0 1px var(--accent); }
small { display:flex; align-items:center; gap:6px; color:var(--text-3); font-size:11px; white-space:nowrap; }
b { font-size:18px; font-weight:600; line-height:1.15; font-variant-numeric:tabular-nums; }
b span { color:var(--text-3); font-size:12px; font-weight:400; }
.chip { display:inline-flex; align-items:center; height:18px; padding:0 6px; border-radius:4px; background:color-mix(in oklab, var(--tone-warn) 15%, transparent); color:var(--tone-warn); font-size:11px; font-weight:500; }
.meter { display:block; height:4px; margin:4px 0 2px; overflow:hidden; border-radius:2px; background:var(--chip); }
.meter i { display:block; height:100%; border-radius:2px; background:var(--accent); transition:width .4s cubic-bezier(.2, .9, .25, 1); }
.meter.warn i { background:var(--tone-warn); }
.meter.bad i { background:var(--danger); }
.sub { color:var(--text-4); font-size:11px; }
.sub.on { color:var(--text-2); }
@media (max-width: 620px) { .tile { padding-inline:12px; } }
@media (prefers-reduced-motion: reduce) { .meter i { transition:none; } }
</style>
