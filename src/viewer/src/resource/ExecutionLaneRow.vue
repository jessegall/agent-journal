<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import {span} from "../format/time.js";
import {kindWord, takes} from "./executionLanes.js";

// one run of a lane, running or waiting, in one 30 px row; a click folds it open to its facts and a link to its output
const props = defineProps({
    entry: {type: Object, required: true},
    waiting: Boolean,
    position: {type: Number, required: true},
    waitCount: {type: Number, required: true},
    why: {type: String, required: true},
    laneName: {type: String, required: true},
    environment: {type: String, required: true},
});
const open = ref(false);
const isReaderWait = computed(() => props.entry.reason === "waits for a reader");
const facts = computed(() => [
    ["Class", props.entry.class],
    ["Priority", props.entry.raised_from ? `${props.entry.priority}, moved up from ${props.entry.raised_from} after a long wait` : props.entry.priority],
    ["Started by", props.entry.starter],
    [props.waiting ? "Waiting for" : "Running for", span(props.entry.seconds, true)],
    ["Takes", takes(props.entry.slot_cost)],
    ...(props.waiting ? [["Place", `${props.position} of ${props.waitCount} in the ${props.laneName.toLowerCase()}`], ["Why it waits", isReaderWait.value ? "Waits for a reader" : props.why]] : []),
    ...(props.entry.parent_line ? [["For", props.entry.parent_line]] : []),
]);
</script>

<template>
    <div class="run" :class="{open}" :data-lane-entry="waiting ? 'waiting' : 'running'">
        <button type="button" class="line" :aria-expanded="open" @click="open = !open">
            <span class="lead"><template v-if="waiting"><span data-lane-position>{{ position }}</span></template><template v-else><span class="dot" :class="{free: !entry.slot_cost}" :title="entry.slot_cost ? 'In a slot' : 'Without a slot'" /></template></span>
            <span class="kind" data-lane-kind>{{ kindWord(entry.kind) }}</span>
            <span class="command"><span class="text">{{ entry.line }}</span>
                <template v-if="waiting && entry.raised_from"><em class="up" :title="`Moved up from ${entry.raised_from} after a long wait`">moved up</em></template>
                <template v-if="isReaderWait"><em title="Waits for a reader">reader</em></template>
                <template v-if="entry.parent_line"><em :title="`Runs for ${entry.parent_line}`">for {{ entry.parent_line }}</em></template>
            </span>
            <span class="cost" data-lane-takes>{{ takes(entry.slot_cost) }}</span>
            <span class="who">{{ entry.starter }}</span>
            <span class="time">{{ span(entry.seconds, true) }}</span>
            <Icon class="chevron" name="chevronRight" facing="down" :size="11" />
        </button>
        <template v-if="open">
            <div class="facts" data-lane-facts>
                <dl><template v-for="[term, value] in facts" :key="term"><dt>{{ term }}</dt><dd>{{ value }}</dd></template></dl>
                <template v-if="entry.run_id"><a class="output" :href="`?page=processes.output&output=${entry.run_id}&environment=${encodeURIComponent(environment)}`" target="_blank" rel="noopener" data-lane-output>Open its output</a></template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.run { border-top: 1px solid color-mix(in oklab, var(--border) 70%, transparent); }
.line { display: grid; grid-template-columns: 14px 58px minmax(0, 1fr) 52px 96px 64px 12px; align-items: center; gap: 10px; box-sizing: border-box; width: 100%; height: 30px; padding: 0 12px 0 14px; border: 0; background: none; color: var(--text); font: inherit; text-align: left; cursor: pointer; }
.line:hover { background: var(--hover); }
.line:focus-visible { outline: 0; box-shadow: inset 0 0 0 1px var(--accent); }
.open > .line { background: var(--raised); }
.lead { display: grid; place-items: center; color: var(--text-3); font-size: 12px; font-variant-numeric: tabular-nums; }
.dot { width: 7px; height: 7px; box-sizing: border-box; border-radius: 50%; background: var(--accent); }
.dot.free { border: 1.5px solid var(--text-3); background: none; }
.kind { overflow: hidden; color: var(--text-3); font-size: 11.5px; text-overflow: ellipsis; white-space: nowrap; }
.command { display: flex; align-items: center; gap: 6px; min-width: 0; }
.text { overflow: hidden; font: 12px var(--mono); text-overflow: ellipsis; white-space: nowrap; }
em { flex: none; height: 16px; padding: 0 5px; border-radius: 4px; background: var(--chip); color: var(--text-2); font-size: 10.5px; font-style: normal; line-height: 16px; white-space: nowrap; }
em.up { color: var(--accent-text); }
.cost { color: var(--text-4); font-size: 11px; text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
.who { overflow: hidden; color: var(--text-3); font-size: 11.5px; text-align: right; text-overflow: ellipsis; white-space: nowrap; }
.time { color: var(--text-2); font-size: 12px; text-align: right; font-variant-numeric: tabular-nums; }
.chevron { color: var(--text-4); transition: transform 200ms; }
.open .chevron { transform: rotate(180deg); color: var(--text-2); }
.facts { padding: 8px 14px 10px 40px; border-top: 1px solid color-mix(in oklab, var(--border) 70%, transparent); background: var(--bg-2); }
dl { display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 3px 12px; margin: 0; font-size: 12px; }
dt { color: var(--text-3); }
dd { margin: 0; color: var(--text-2); overflow-wrap: anywhere; }
.output { display: inline-block; margin-top: 6px; color: var(--accent-text); font-size: 12px; text-decoration: none; }
.output:hover { text-decoration: underline; }
/* narrow: who started it drops from the row; the folded facts still name it */
@media (max-width: 620px) {
    .line { grid-template-columns: 14px 46px minmax(0, 1fr) 44px 56px 12px; }
    .who { display: none; }
}
@media (prefers-reduced-motion: reduce) { .chevron { transition: none; } }
</style>
