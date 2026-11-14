<script setup>
import {computed, ref} from "vue";
import ProcessQueueBand from "./ProcessQueueBand.vue";
import ExecutionLane from "./ExecutionLane.vue";
import {span} from "../format/time.js";

// every lane of the journal as its own block, in the order instant, short, long, then how long each priority waited over
// the last hour; the class and starter filters hide rows only, the lanes' strips and counts stay whole
const props = defineProps({execution: {type: Object, required: true}, environment: {type: String, required: true}, pausable: Boolean});
const emit = defineEmits(["pause", "resume"]);
const className = ref("");
const starter = ref("");
const entries = computed(() => props.execution.lanes.flatMap((lane) => [...lane.running, ...lane.waiting]));
const runningCount = computed(() => props.execution.lanes.reduce((count, lane) => count + lane.running.length, 0));
const classes = computed(() => [...new Set(entries.value.map((entry) => entry.class))].sort());
const starters = computed(() => [...new Set(entries.value.map((entry) => entry.starter))].sort());
const kept = (entry) => (!className.value || entry.class === className.value) && (!starter.value || entry.starter === starter.value);
const shownCount = computed(() => entries.value.filter(kept).length);
const waits = computed(() => props.execution.waits.filter((wait) => wait.runs));
</script>

<template>
    <section class="lanes" data-execution-lanes>
        <div class="tools">
            <span class="sum" data-lanes-count>{{ runningCount }} running · {{ entries.length - runningCount }} waiting<template v-if="className || starter"> · showing {{ shownCount }} of {{ entries.length }}</template></span>
            <label>Class <select v-model="className" data-lanes-class><option value="">Every class</option><template v-for="name in classes" :key="name">
  <option :value="name">{{ name }}</option>
</template></select></label>
            <label>Started by <select v-model="starter" data-lanes-starter><option value="">Anyone</option><template v-for="name in starters" :key="name">
  <option :value="name">{{ name }}</option>
</template></select></label>
        </div>
        <template v-for="lane in execution.lanes" :key="lane.lane">
            <ExecutionLane :lane="lane" :kept="kept" :environment="environment" :pausable="pausable && lane.lane === 'long'" @pause="emit('pause', $event)" @resume="emit('resume')" />
        </template>
        <div data-lanes-waits>
            <ProcessQueueBand icon="clock">Waits, last hour</ProcessQueueBand>
            <template v-if="!waits.length">
                <p class="empty">No run started in the last hour.</p>
            </template>
            <template v-else>
                <table class="waits">
                    <thead><tr><th scope="col">Priority</th><th scope="col">Started</th><th scope="col">Longest wait</th><th scope="col">Average wait</th></tr></thead>
                    <tbody><template v-for="wait in waits" :key="wait.priority"><tr><td>{{ wait.priority }}</td><td>{{ wait.runs }}</td><td>{{ span(wait.longest_seconds, true) }}</td><td>{{ span(wait.average_seconds, true) }}</td></tr></template></tbody>
                </table>
            </template>
        </div>
    </section>
</template>

<style scoped>
.lanes { border-top: 1px solid var(--border); }
.tools { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 8px 14px; border-bottom: 1px solid var(--border); }
.sum { flex: 1; min-width: 140px; color: var(--text-3); font-size: 12px; font-variant-numeric: tabular-nums; }
.tools label { display: flex; align-items: center; gap: 6px; color: var(--text-3); font-size: 12px; }
.tools select { font: inherit; }
.empty { margin: 0; padding: 8px 14px; color: var(--text-3); font-size: 12px; }
.waits { width: calc(100% - 28px); margin: 6px 14px 16px; border-collapse: collapse; font-size: 12px; font-variant-numeric: tabular-nums; }
.waits th { padding: 5px 0; border-bottom: 1px solid var(--border); color: var(--text-3); font-weight: 500; text-align: right; }
.waits td { padding: 5px 0; border-bottom: 1px solid color-mix(in oklab, var(--border) 70%, transparent); color: var(--text-2); text-align: right; }
.waits th:first-child, .waits td:first-child { text-align: left; }
.waits td:first-child { color: var(--text); }
</style>
