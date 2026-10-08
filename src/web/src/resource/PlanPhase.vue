<script setup>
import {computed, inject} from "vue";
import Icon from "../kit/Icon.vue";
import {useScope} from "../composables/scope.js";
import HolderTag from "../kit/HolderTag.vue";
import PlanRowLine from "./PlanRowLine.vue";
import SkeletonLine from "../kit/SkeletonLine.vue";
import {FINISHED_STATES, grouped, helperName, helperState, helperTag, helpersHolding, holdingRuns} from "../domain/helpers.js";
import {peek, peekThere} from "../route.js";

const props = defineProps({
    phase: {type: Object, default: null},
    current: {type: Boolean, default: false},
    boning: {type: Boolean, default: false},
    skeleton: {type: Boolean, default: false},
    helpers: {type: Array, default: () => []},
    helpersLoaded: {type: Boolean, default: true},
});
const emit = defineEmits(["inspect"]);
const talk = inject("talk", null);
const scope = useScope();
const open = (row) => (scope.env ? peekThere(scope.env, row.type, row.n) : peek(row.type, row.n));
const rows = computed(() => props.phase?.rows || []);
const done = computed(() => rows.value.length > 0 && rows.value.every((t) => t.completed));
const closed = computed(() => rows.value.filter((t) => t.completed).length);
const holders = computed(() => helpersHolding(rows.value, props.helpers));
const runs = computed(() => holdingRuns(rows.value, props.helpers));
const closedHolder = (helper) => FINISHED_STATES.has(helperState(helper));
const loading = computed(() => props.phase?.waiting || 0);
const bones = computed(() => Math.max(loading.value, props.boning ? 3 - rows.value.length : 0));
const holdersLoading = computed(() => !props.helpersLoaded && rows.value.some((t) => t.data?.assigned));
const TITLE_BARS = [{width: "42%", height: 11}];
const ROW_BARS = [{width: "58%", height: 11}];
const HOLDER_BARS = [{width: "64px", height: 14}];
</script>

<template>
    <template v-if="skeleton">
        <li class="phase skeleton" aria-hidden="true">
            <div class="phead">
                <span class="mark"><Icon name="circle" :size="14" /></span>
                <SkeletonLine class="ptitle" :bars="TITLE_BARS" />
            </div>
        </li>
    </template>
    <template v-else>
        <li :class="['phase', {current, done}]">
            <div class="phead">
                <span class="mark"><Icon :name="done ? 'check' : 'circle'" :size="14" /></span>
                <span class="ptitle">{{ phase.i }}. {{ phase.title }}</span>
                <template v-if="talk">
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
                    <template v-for="h in holders" :key="h.n">
                        <HolderTag :name="helperName(h)" :state="helperTag(h).state" :word="helperTag(h).word" :closed="closedHolder(h)" @open="emit('inspect', h)" />
                    </template>
                </div>
            </template>
            <template v-if="phase.when">
                <div class="when">complete when {{ phase.when }}</div>
            </template>
            <template v-for="run in runs" :key="`${run.rows[0].type}-${run.rows[0].n}`">
                <template v-if="grouped(run)">
                    <div :class="['held', 'group', {closed: closedHolder(run.holder)}]">
                        <div class="held-rows">
                            <template v-for="t in run.rows" :key="`${t.type}-${t.n}`">
                                <PlanRowLine :todo="t" @open="open" />
                            </template>
                        </div>
                        <span class="bracket" aria-hidden="true" />
                        <div class="held-tag">
                            <HolderTag
                                :name="helperName(run.holder)"
                                :state="helperTag(run.holder).state"
                                :word="helperTag(run.holder).word"
                                :closed="closedHolder(run.holder)"
                                @open="emit('inspect', run.holder)"
                            />
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="held">
                        <div class="held-rows"><PlanRowLine :todo="run.rows[0]" @open="open" /></div>
                        <span aria-hidden="true" />
                        <template v-if="run.holder">
                            <div class="held-tag">
                                <HolderTag
                                    :name="helperName(run.holder)"
                                    :state="helperTag(run.holder).state"
                                    :word="helperTag(run.holder).word"
                                    :closed="closedHolder(run.holder)"
                                    @open="emit('inspect', run.holder)"
                                />
                            </div>
                        </template>
                    </div>
                </template>
            </template>
            <template v-for="j in bones" :key="`row-bone-${j}`">
                <div class="line bones" aria-hidden="true"><SkeletonLine class="row-bone" :bars="ROW_BARS" /></div>
            </template>
        </li>
    </template>
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
