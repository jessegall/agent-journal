<script setup>
import {capitalised, helperCount, helperWord} from "../composables/helperWords.js";
import {agentCounts, agentsInOrder, FINISHED_STATES} from "../domain/helpers.js";
import {counted} from "../format/number.js";
import {computed, nextTick, ref, watch} from "vue";
import PhoneAtWorkRow from "./PhoneAtWorkRow.vue";
import PhoneHelperDetail from "./PhoneHelperDetail.vue";
import PhoneSheet from "./PhoneSheet.vue";
import {useEdgeBack} from "./edge.js";

const props = defineProps({environment: {type: String, required: true}, live: {type: Object, default: () => ({})}});
const emit = defineEmits(["close", "changed", "read"]);
const helpers = computed(() => props.live.helpers || []);
const subagents = computed(() => props.live.subagents || []);
const counts = computed(() => agentCounts(helpers.value, subagents.value));
const summary = computed(() =>
    [
        counts.value.needs ? counted(counts.value.needs, "needs you", "need you") : "",
        counts.value.working ? `${helperCount(counts.value.working)} at work` : "",
        counts.value.reported ? counted(counts.value.reported, "reported", "reported") : "",
        counts.value.finished ? counted(counts.value.finished, "finished", "finished") : "",
    ]
        .filter(Boolean)
        .join(" · ")
);
const all = computed(() => [
    ...helpers.value.map((row) => ({...row, key: `helper:${row.n}`, kind: "helper"})),
    ...subagents.value.map((row) => ({...row, key: `subagent:${row.id || row.session}`, kind: "subagent"})),
]);
const finished = computed(() => agentsInOrder(all.value.filter((row) => FINISHED_STATES.has(row.state))));
const older = ref(false);
const visible = computed(() => {
    const keys = new Set((older.value ? finished.value : finished.value.slice(0, 3)).map((row) => row.key));
    return all.value.filter((row) => !FINISHED_STATES.has(row.state) || keys.has(row.key));
});
const needs = computed(() => agentsInOrder(visible.value.filter((row) => row.state === "needs")));
const listedHelpers = computed(() => agentsInOrder(visible.value.filter((row) => row.kind === "helper" && row.state !== "needs")));
const listedSubagents = computed(() => agentsInOrder(visible.value.filter((row) => row.kind === "subagent")));
const olderCount = computed(() => Math.max(0, finished.value.length - 3));
const selected = ref(0);
const helper = computed(() => helpers.value.find((row) => row.n === selected.value));
const stack = ref(null);
const edge = useEdgeBack(stack, {depth: () => (selected.value ? 1 : 0), back: () => (selected.value = 0)});
const stackStyle = computed(() => ({"--settle": `${edge.settle.value}ms`}));

watch(selected, (value) => {
    if (!value) nextTick(() => edge.landed(0));
});

function read(target) {
    emit("close");
    nextTick(() => emit("read", target));
}
</script>

<template>
    <PhoneSheet label="At work" tall @close="emit('close')">
        <div ref="stack" :class="['at-work-stack', {dragging: edge.dragging.value, settling: edge.settle.value > 0}]" :style="stackStyle">
            <section :class="['at-work-layer', 'at-work-list', {beneath: selected}]" :inert="Boolean(selected)">
                <header class="at-work-head">
                    <h2>At work in {{ environment }}</h2>
                    <p>{{ summary }}</p>
                </header>
                <div class="at-work-scroll">
                    <template v-if="needs.length">
                        <section class="at-work-group needs-group">
                            <h3>Needs you</h3>
                            <div class="at-work-rows needs-rows">
                                <template v-for="row in needs" :key="row.key">
                                    <PhoneAtWorkRow :row="row" :kind="row.kind" @open="selected = $event.n" @read="read" />
                                </template>
                            </div>
                        </section>
                    </template>
                    <template v-if="listedHelpers.length">
                        <section class="at-work-group">
                            <header>
                                <h3>{{ capitalised(helperWord(2)) }}</h3>
                                <span>Separate agents, one job each</span>
                            </header>
                            <div class="at-work-rows">
                                <template v-for="row in listedHelpers" :key="row.key">
                                    <PhoneAtWorkRow :row="row" kind="helper" @open="selected = $event.n" @read="read" />
                                </template>
                            </div>
                        </section>
                    </template>
                    <template v-if="listedSubagents.length">
                        <section class="at-work-group">
                            <header>
                                <h3>{{ capitalised(helperWord(2)) }} inside the agent</h3>
                                <span>Short errands for the main agent</span>
                            </header>
                            <div class="at-work-rows">
                                <template v-for="row in listedSubagents" :key="row.key">
                                    <PhoneAtWorkRow :row="row" kind="subagent" @read="read" />
                                </template>
                            </div>
                        </section>
                    </template>
                    <template v-if="olderCount && !older">
                        <button type="button" class="at-work-older" @click="older = true">Show {{ olderCount }} older</button>
                    </template>
                </div>
                <footer class="at-work-foot"><button type="button" @click="emit('close')">Close</button></footer>
            </section>
            <template v-if="helper">
                <section :class="['at-work-layer', 'at-work-detail', {departing: edge.leaving.value}]">
                    <PhoneHelperDetail :row="helper" @back="selected = 0" @changed="emit('changed')" @read="read" />
                </section>
            </template>
        </div>
    </PhoneSheet>
</template>

<style scoped>
.at-work-stack {
    --dx: 0px;
    --p: 0;
    position: relative;
    min-height: calc(92dvh - 44px);
    margin: -4px calc(-1 * var(--side)) -14px;
    max-width: none;
    overflow: hidden;
}

.at-work-layer {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    padding: 0 var(--side) max(14px, env(safe-area-inset-bottom));
    background: var(--raised);
    transition: transform var(--pop) var(--push);
}

.at-work-list.beneath {
    transform: translateX(calc(-30% + var(--dx) * 0.3));
}

.at-work-detail {
    z-index: 1;
    overflow-y: auto;
    box-shadow: -8px 0 24px var(--shade);
    transform: translateX(var(--dx));
    animation: at-work-push var(--push-in) var(--push);
}

.at-work-detail.departing {
    pointer-events: none;
}

.at-work-stack.dragging .at-work-layer {
    transition: none;
}

.at-work-stack.settling .at-work-layer {
    transition-duration: var(--settle);
}

.at-work-head {
    flex: none;
    text-align: center;
}

.at-work-head h2 {
    margin: 3px 0 2px;
    font-size: 1rem;
}

.at-work-head p {
    margin: 0 0 14px;
    color: var(--text-3);
    font-size: 0.824rem;
}

.at-work-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
}

.at-work-group {
    margin-bottom: 14px;
}

.at-work-group > header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding: 0 4px 6px;
}

.at-work-group h3 {
    margin: 0;
    color: var(--text-2);
    font-size: 0.824rem;
}

.at-work-group header span {
    color: var(--text-3);
    font-size: 0.765rem;
    text-align: right;
}

.needs-group > h3 {
    margin: 0;
    padding: 0 4px 6px;
    color: var(--tone-warn);
    font-size: 0.824rem;
}

.at-work-rows {
    overflow: hidden;
    border-radius: 12px;
    background: var(--hover);
}

.needs-rows {
    border: 1px solid var(--tone-warn);
}

.at-work-older,
.at-work-foot button {
    width: 100%;
    min-height: 50px;
    border: 0;
    border-radius: 12px;
    background: var(--hover);
    color: var(--text);
    font: inherit;
    font-weight: 600;
}

.at-work-older {
    margin-bottom: 14px;
    color: var(--accent-text);
}

.at-work-foot {
    flex: none;
    padding-top: 12px;
}

@keyframes at-work-push {
    from {
        transform: translateX(100%);
    }
}
</style>
