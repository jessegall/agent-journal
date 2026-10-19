<script setup>
import {computed, inject} from "vue";
import Icon from "../kit/Icon.vue";
import {useScope} from "../composables/scope.js";
import HolderTag from "../kit/HolderTag.vue";
import PlanRowLine from "./PlanRowLine.vue";
import SkeletonLine from "../kit/SkeletonLine.vue";
import {FINISHED_STATES, grouped, holdingRuns, workerName, workerState, workerTag, workersHolding} from "../domain/workers.js";
import {isClosed} from "../domain/row.js";
import {peek, peekThere} from "../route.js";

const props = defineProps({
    phase: {type: Object, default: null},
    current: {type: Boolean, default: false},
    workers: {type: Array, default: () => []},
    workersLoaded: {type: Boolean, default: true},
});
const emit = defineEmits(["inspect"]);
const talk = inject("talk", null);
const scope = useScope();
const open = (row) => (scope.env ? peekThere(scope.env, "tasks", row.id) : peek("tasks", row.id));
const rows = computed(() => props.phase.rows);
const done = computed(() => rows.value.length > 0 && rows.value.every(isClosed));
const closed = computed(() => rows.value.filter(isClosed).length);
const holders = computed(() => workersHolding(rows.value, props.workers));
const runs = computed(() => holdingRuns(rows.value, props.workers));
const closedHolder = (worker) => FINISHED_STATES.has(workerState(worker));
const holdersLoading = computed(() => !props.workersLoaded && rows.value.some((t) => t.worker_id));
const ROW_BARS = [{width: "58%", height: 11}];
const HOLDER_BARS = [{width: "64px", height: 14}];
</script>

<template>
    <li :class="['phase', {current, done}]">
        <div class="phead">
            <span class="mark"><Icon :name="done ? 'check' : 'circle'" :size="14" /></span>
            <span class="ptitle">{{ phase.i ? `${phase.i}. ` : "" }}{{ phase.title }}</span>
            <template v-if="talk && phase.i">
                <button type="button" class="say" title="Comment on this phase" @click="talk.say(`Phase ${phase.i}: ${phase.title}`)">
                    <Icon name="bubble" :size="12" />
                </button>
            </template>
            <span class="phead-end">
                <template v-if="phase.checkpoint">
                    <span class="cp">checkpoint</span>
                </template>
                <span class="progress">{{ closed }}/{{ rows.length }}</span>
            </span>
        </div>
        <template v-if="holders.length || holdersLoading">
            <div class="phead-tags">
                <template v-if="holdersLoading">
                    <SkeletonLine class="holders-loading" :bars="HOLDER_BARS" aria-hidden="true" />
                </template>
                <template v-for="h in holders" :key="h.id">
                    <HolderTag :name="workerName(h)" :state="workerTag(h).state" :word="workerTag(h).word" :closed="closedHolder(h)" @open="emit('inspect', h)" />
                </template>
            </div>
        </template>
        <template v-if="phase.complete_when">
            <div class="when">complete when {{ phase.complete_when }}</div>
        </template>
        <template v-for="run in runs" :key="run.rows[0].id">
            <div :class="['held', {group: grouped(run), closed: run.holder && closedHolder(run.holder)}]">
                <div class="held-rows">
                    <template v-for="t in run.rows" :key="t.id">
                        <PlanRowLine :task="t" @open="open" />
                    </template>
                </div>
                <span :class="{bracket: grouped(run)}" aria-hidden="true" />
                <template v-if="run.holder">
                    <div class="held-tag">
                        <HolderTag
                            :name="workerName(run.holder)"
                            :state="workerTag(run.holder).state"
                            :word="workerTag(run.holder).word"
                            :closed="closedHolder(run.holder)"
                            @open="emit('inspect', run.holder)"
                        />
                    </div>
                </template>
            </div>
        </template>
        <template v-for="j in phase.waiting" :key="`row-bone-${j}`">
            <div class="line bones" aria-hidden="true"><SkeletonLine class="row-bone" :bars="ROW_BARS" /></div>
        </template>
    </li>
</template>

<style scoped>
.phase.skeleton {
    opacity: 0.4;
    pointer-events: none;
}

.line.bones {
    height: 26px;
}

.row-bone {
    flex: 1;
    margin-left: 22px;
}

.phase {
    padding: 10px 14px;
    margin-bottom: 8px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
}

.phase.current {
    border-color: var(--accent);
}

.phase.done {
    opacity: 0.7;
}

.phead {
    display: flex;
    align-items: center;
    gap: 10px;
}

.mark {
    color: var(--accent-text);
    display: inline-flex;
}

.ptitle {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.phead-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 4px 0 2px 24px;
}

.phead-end {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
}

.say {
    flex: none;
    display: inline-flex;
    padding: 3px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    opacity: 0;
    cursor: pointer;
}

.phead:hover .say,
.say:focus-visible {
    opacity: 1;
}

.say:hover {
    color: var(--accent-text);
}

.cp {
    color: var(--blocking);
    font-size: 11.5px;
}

.progress {
    color: var(--text-3);
    font-size: 12px;
}

.when {
    margin: 2px 0 6px 24px;
    color: var(--text-3);
    font-size: 12.5px;
}

.phase {
    --tag-column: 170px;
}

.held {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 16px var(--tag-column);
    align-items: center;
    border-radius: 6px;
}

.held-rows {
    min-width: 0;
}

.held-tag {
    min-width: 0;
    display: flex;
    align-items: center;
    padding-right: 6px;
}

.group {
    background: color-mix(in srgb, var(--text) 3%, transparent);
}

.group:hover {
    background: color-mix(in srgb, var(--text) 7%, transparent);
}

.bracket {
    position: relative;
    align-self: stretch;
    margin: 6px 0;
    border: 1px solid var(--border-3);
    border-left: 0;
    border-radius: 0 4px 4px 0;
}

.bracket::after {
    content: "";
    position: absolute;
    top: 50%;
    right: -9px;
    width: 9px;
    border-top: 1px solid var(--border-3);
}

.group.closed .bracket,
.group.closed .bracket::after {
    border-color: var(--border-2);
}

</style>
