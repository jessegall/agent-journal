<script setup>
import {computed, ref} from "vue";

// every lane of the journal: its room in use against its capacity, what runs and what waits in it and why, and how long
// each priority waited over the last hour
const props = defineProps({execution: {type: Object, required: true}});
const className = ref("");
const starter = ref("");
const classes = computed(() => [...new Set(props.execution.lanes.flatMap((lane) => [...lane.running, ...lane.waiting].map((entry) => entry.class)))].sort());
const starters = computed(() => [...new Set(props.execution.lanes.flatMap((lane) => [...lane.running, ...lane.waiting].map((entry) => entry.starter)))].sort());
const kept = (entry) => (!className.value || entry.class === className.value) && (!starter.value || entry.starter === starter.value);
const lanes = computed(() => props.execution.lanes.map((lane) => ({...lane, running: lane.running.filter(kept), waiting: lane.waiting.filter(kept)})));
const waits = computed(() => props.execution.waits.filter((wait) => wait.runs));
const titled = (lane) => `${lane.lane[0].toUpperCase()}${lane.lane.slice(1)} lane`;
const seconds = (value) => (value < 60 ? `${value} s` : `${Math.round(value / 60)} min`);
</script>

<template>
    <section class="lanes" data-execution-lanes>
        <div class="filters">
            <label>Class <select v-model="className" data-lanes-class><option value="">Every class</option><option v-for="name in classes" :key="name" :value="name">{{ name }}</option></select></label>
            <label>Started by <select v-model="starter" data-lanes-starter><option value="">Anyone</option><option v-for="name in starters" :key="name" :value="name">{{ name }}</option></select></label>
        </div>
        <div v-for="lane in lanes" :key="lane.lane" class="lane" :data-lane="lane.lane">
            <h2>{{ titled(lane) }} <span class="room" :class="{over: lane.over_capacity}">{{ lane.used }} of {{ lane.capacity }} in use<template v-if="lane.over_capacity">, over capacity</template><template v-if="lane.halted">, halted</template></span></h2>
            <p v-if="!lane.running.length && !lane.waiting.length" class="empty">Nothing runs or waits here.</p>
            <ul>
                <li v-for="(entry, index) in lane.running" :key="`run:${index}`" :class="{child: entry.parent_line}" data-lane-entry="running">
                    <span class="line">{{ entry.line }}</span>
                    <span class="facts">{{ entry.class }}, {{ entry.priority }}, {{ entry.starter }}, running {{ seconds(entry.seconds) }}<template v-if="entry.parent_line">, for {{ entry.parent_line }}</template></span>
                </li>
                <li v-for="(entry, index) in lane.waiting" :key="`wait:${index}`" class="waiting" data-lane-entry="waiting">
                    <span class="line">{{ entry.line }}</span>
                    <span class="facts">{{ entry.class }}, {{ entry.priority }}, {{ entry.starter }}, waiting {{ seconds(entry.seconds) }}: {{ entry.reason }}<template v-if="entry.raised_from">. Raised from {{ entry.raised_from }}</template></span>
                </li>
            </ul>
        </div>
        <div class="waits" data-lanes-waits>
            <h2>Waits over the last hour</h2>
            <p v-if="!waits.length" class="empty">No run started in the last hour.</p>
            <p v-for="wait in waits" :key="wait.priority" class="wait">{{ wait.priority }}: {{ wait.runs }} started, longest wait {{ seconds(wait.longest_seconds) }}, average {{ seconds(wait.average_seconds) }}</p>
        </div>
    </section>
</template>

<style scoped>
.lanes { border-top: 1px solid var(--border); }
.filters { display: flex; flex-wrap: wrap; gap: 12px; padding: 8px 14px; color: var(--text-3); font-size: 12px; }
.filters select { margin-left: 4px; font: inherit; }
.lane, .waits { padding: 8px 14px; border-top: 1px solid var(--border); }
h2 { margin: 0 0 4px; color: var(--text); font-size: 12px; font-weight: 600; }
.room { margin-left: 6px; color: var(--text-3); font-weight: 400; }
.room.over { color: var(--danger); }
ul { margin: 0; padding: 0; list-style: none; }
li { display: flex; flex-direction: column; padding: 4px 0; font-size: 12px; }
li.child { padding-left: 14px; }
.line { color: var(--text); font-family: var(--mono, monospace); overflow-wrap: anywhere; }
.facts, .empty, .wait { margin: 0; color: var(--text-3); font-size: 12px; }
.waiting .facts { color: var(--text-2); }
</style>
