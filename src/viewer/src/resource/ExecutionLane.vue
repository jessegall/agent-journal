<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import Btn from "../kit/Btn.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import ExecutionLaneRow from "./ExecutionLaneRow.vue";
import {LANE_CONTENTS, isPaused, kindWord, laneName, takes} from "./executionLanes.js";

// one lane of the process queue: a sticky head with its use and state, what goes in it, the paused or held note, the slot
// strip with the run in each slot, then what runs and what waits in the order it starts; the strip and the counts always
// show the whole lane, a filter hides rows only
const props = defineProps({lane: {type: Object, required: true}, kept: {type: Function, required: true}, environment: {type: String, required: true}, pausable: Boolean});
const emit = defineEmits(["pause", "resume"]);
const pausing = ref(false);
const reason = ref("");
const name = computed(() => laneName(props.lane));
const over = computed(() => Math.max(0, props.lane.used - props.lane.capacity));
const why = computed(() => {
    if (isPaused(props.lane)) return "The lane is paused";
    if (props.lane.halted) return props.lane.halt_type === "update" ? "The lane is held for an update" : "The lane is held for a restart";
    return `No room: ${props.lane.used} of ${props.lane.capacity} slots in use`;
});
const shortWhy = computed(() => (isPaused(props.lane) ? "Paused" : props.lane.halted ? "Held" : why.value));
const running = computed(() => props.lane.running.filter(props.kept));
const waiting = computed(() => props.lane.waiting.map((entry, index) => ({entry, position: index + 1})).filter(({entry}) => props.kept(entry)));
// a run fills as many cells as it takes; the run that crosses the limit is drawn over it
const cells = computed(() => {
    let taken = 0;
    const runs = props.lane.running.filter((entry) => entry.slot_cost > 0).map((entry, index) => {
        taken += entry.slot_cost;
        return {key: `run:${index}`, cost: entry.slot_cost, over: taken > props.lane.capacity, label: entry.slot_cost >= 3 ? kindWord(entry.kind) : "", title: `${entry.line} · ${takes(entry.slot_cost)}`};
    });
    return [...runs, ...Array.from({length: Math.max(0, props.lane.capacity - taken)}, (_, index) => ({key: `free:${index}`, cost: 1, free: true, label: "", title: "Free"}))];
});
function pause() {
    emit("pause", reason.value.trim());
    pausing.value = false;
    reason.value = "";
}
</script>

<template>
    <section class="lane" :class="{stopped: lane.halted}" :data-lane="lane.lane" :aria-label="name">
        <h3 class="head">{{ name }}
            <span class="use" data-lane-use><b>{{ lane.used }}</b> of {{ lane.capacity }} slots<template v-if="lane.waiting.length"> · {{ lane.waiting.length }} waiting</template></span>
            <template v-if="isPaused(lane)"><span class="chip warn" data-lane-state>Paused</span></template>
            <template v-else-if="lane.halted"><span class="chip warn" data-lane-state>Held</span></template>
            <template v-else-if="over"><span class="chip bad" data-lane-state>{{ over }} over</span></template>
            <span class="grow" />
            <template v-if="pausable && isPaused(lane)"><Btn small variant="primary" data-lane-resume @click="emit('resume')">Resume</Btn></template>
            <template v-if="pausable && !lane.halted && !pausing"><Btn small icon="pause" data-lane-pause @click="pausing = true">Pause</Btn></template>
        </h3>
        <p class="contents">{{ LANE_CONTENTS[lane.lane] }}</p>
        <template v-if="pausing && !lane.halted">
            <form class="note" data-lane-pause-form @submit.prevent="pause"><Icon name="pause" :size="13" /><input v-model="reason" class="reason" required placeholder="Why is it paused?" aria-label="Reason" /><Btn small variant="primary" type="submit">Pause</Btn><Btn small @click="pausing = false">Cancel</Btn></form>
        </template>
        <template v-if="lane.halted">
            <div class="note" role="status" data-lane-note><Icon name="pause" :size="13" />
                <SwitchCase :value="lane.halt_type">
                    <template #command><span><b>Paused</b><template v-if="lane.halt_reason"> · {{ lane.halt_reason }}</template>. No waiting run starts here until it is resumed; what runs goes on.</span></template>
                    <template #update><span><b>Waiting for an update.</b> The update waits for the running commands to end. Nothing new starts here until it is done; {{ lane.waiting.length ? `the ${lane.waiting.length} waiting keep their place` : "nothing waits" }}.</span></template>
                    <template #restart><span><b>Waiting for a restart.</b> The server is restarting. {{ lane.waiting.length ? `The ${lane.waiting.length} waiting keep their place and start once it is back` : "Nothing waits" }}.</span></template>
                </SwitchCase>
            </div>
        </template>
        <div class="strip" :class="{fine: lane.capacity > 16}" role="img" :aria-label="`${lane.used} of ${lane.capacity} slots in use`" data-lane-strip>
            <template v-for="cell in cells" :key="cell.key"><i class="cell" :class="{on: !cell.free, over: cell.over}" :style="{flex: cell.cost}" :title="cell.title" :data-lane-cell="cell.free ? 'free' : 'run'">{{ cell.label }}</i></template>
        </div>
        <template v-if="!lane.running.length && !lane.waiting.length">
            <p class="empty" data-lane-empty>Nothing runs or waits here</p>
        </template>
        <template v-else>
            <h4 class="sub">Running <span>{{ lane.running.length }}</span></h4>
            <template v-for="(entry, index) in running" :key="`run:${index}:${entry.line}`">
                <ExecutionLaneRow :entry="entry" :position="index + 1" :wait-count="lane.waiting.length" :why="why" :lane-name="name" :environment="environment" />
            </template>
            <template v-if="!running.length"><p class="empty">{{ lane.running.length ? "None match the filter" : "Nothing runs" }}</p></template>
            <template v-if="lane.waiting.length">
                <h4 class="sub">Waiting, in the order they start <span>{{ lane.waiting.length }}</span><span class="why" data-lane-why>{{ shortWhy }}</span></h4>
                <template v-for="item in waiting" :key="`wait:${item.position}:${item.entry.line}`">
                    <ExecutionLaneRow :entry="item.entry" waiting :position="item.position" :wait-count="lane.waiting.length" :why="why" :lane-name="name" :environment="environment" />
                </template>
                <template v-if="!waiting.length"><p class="empty">None match the filter</p></template>
            </template>
        </template>
    </section>
</template>

<style scoped>
.lane { border-bottom: 1px solid var(--border); }
.lane.stopped { box-shadow: inset 3px 0 0 var(--tone-warn); }
.head { position: sticky; top: 0; z-index: 1; display: flex; align-items: center; gap: 8px; box-sizing: border-box; height: 34px; margin: 0; padding: 0 12px 0 14px; border-bottom: 1px solid var(--border); background: var(--side); color: var(--text); font-size: 12.5px; font-weight: 600; }
.use { color: var(--text-3); font-size: 12px; font-weight: 400; font-variant-numeric: tabular-nums; }
.use b { color: var(--text); font-weight: 600; }
.grow { flex: 1; }
.chip { display: inline-flex; align-items: center; height: 18px; padding: 0 6px; border-radius: 4px; font-size: 11px; font-weight: 500; }
.chip.warn { background: color-mix(in oklab, var(--tone-warn) 15%, transparent); color: var(--tone-warn); }
.chip.bad { background: color-mix(in oklab, var(--danger) 15%, transparent); color: var(--danger); }
.contents { margin: 0; padding: 8px 14px 0; color: var(--text-3); font-size: 12px; }
.note { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 8px; margin: 8px 14px 0; padding: 8px 10px; border-radius: 6px; background: color-mix(in oklab, var(--tone-warn) 10%, transparent); color: var(--text-2); font-size: 12px; line-height: 1.5; }
.note > svg { flex: none; margin-top: 2px; color: var(--tone-warn); }
.note > span { flex: 1; min-width: 200px; }
.note b { color: var(--tone-warn); font-weight: 600; }
form.note { align-items: center; }
form.note > svg { margin-top: 0; }
.reason { flex: 1; min-width: 160px; height: 26px; box-sizing: border-box; padding: 0 8px; border: 1px solid var(--border-2); border-radius: 6px; background: var(--bg); color: var(--text); font: inherit; font-size: 12px; }
.strip { display: flex; gap: 3px; height: 15px; margin: 10px 14px; }
.cell { flex: 1; min-width: 0; overflow: hidden; box-sizing: border-box; border: 1.5px solid var(--border-3); border-radius: 3px; color: var(--on-danger); font-size: 9.5px; font-style: normal; font-weight: 500; line-height: 12px; text-align: center; white-space: nowrap; }
.cell.on { border-color: var(--accent); background: var(--accent); }
.cell.over { border-color: var(--danger); background: var(--danger); }
.stopped .cell:not(.on) { border-color: color-mix(in oklab, var(--tone-warn) 50%, transparent); background: repeating-linear-gradient(135deg, color-mix(in oklab, var(--tone-warn) 32%, transparent) 0 2px, transparent 2px 5px); }
.strip.fine { gap: 2px; height: 11px; }
.strip.fine .cell { border-width: 1px; border-radius: 2px; }
.sub { display: flex; align-items: center; gap: 6px; margin: 0; padding: 6px 14px 4px; color: var(--text-2); font-size: 11px; font-weight: 500; }
.sub span { color: var(--text-4); font-weight: 400; }
.sub .why { margin-left: auto; color: var(--text-3); }
.stopped .sub .why { color: var(--tone-warn); }
/* an empty lane is one row high, so the lanes keep their places */
.empty { display: flex; align-items: center; box-sizing: border-box; height: 31px; margin: 0; padding: 0 14px; border-top: 1px solid color-mix(in oklab, var(--border) 70%, transparent); color: var(--text-3); font-size: 12px; }
</style>
