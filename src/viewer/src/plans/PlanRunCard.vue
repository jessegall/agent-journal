<script setup>
import {computed} from "vue";
import {pausePlan} from "../actions/plans.js";
import {phaseOf, planProgress, planReason, planTone, PLAN_STATES, rowsOf, standingOf, statusOf, workersHolding} from "../domain/plans.js";
import {peek} from "../route.js";
import {rows} from "../sync/rows.js";

// A plan being worked on, as the Plans window draws it: its title, its state and why, the phase in hand, the workers on its tasks or the task in hand, and its progress the full width beneath.
const PAUSABLE = ["started", "waiting", "delegated"];
const props = defineProps({plan: {type: Object, required: true}});
const emit = defineEmits(["failed"]);
const status = computed(() => statusOf(props.plan));
const progress = computed(() => planProgress(props.plan));
const standing = computed(() => standingOf(props.plan, rows("tasks")));
const workers = computed(() => workersHolding(rowsOf(props.plan), {tasks: rows("tasks"), workers: rows("workers")}));
const inHand = computed(() => rows("tasks").find((t) => t.plan_id === props.plan.id && t.state === "started") || null);
const pausable = computed(() => PAUSABLE.includes(status.value));

async function pause() {
    try {
        await pausePlan(props.plan);
    } catch (e) {
        emit("failed", e.message);
    }
}
</script>

<template>
    <article :class="['run', `tone-${planTone(plan)}`]" :title="`Plan ${plan.id}: ${plan.title}`" @click="peek('plans', plan.id)">
        <h3 class="run-title">
            <span class="number">{{ plan.id }}</span>
            <span class="words">{{ plan.title }}</span>
        </h3>
        <div class="state">
            <span class="state-name"><i class="dot ring" />{{ PLAN_STATES[status] }}</span>
            <template v-if="planReason(plan)">
                <span class="state-why">{{ planReason(plan) }}</span>
            </template>
        </div>
        <div class="pairs">
            <div>
                <p class="pair-label">Current phase</p>
                <p class="pair-value">
                    <b>Phase {{ progress.phase }} of {{ progress.total || 1 }}</b>
                    <template v-if="phaseOf(plan)"> · {{ phaseOf(plan) }}</template>
                </p>
            </div>
            <template v-if="workers.length">
                <div>
                    <p class="pair-label">Workers on this plan</p>
                    <template v-for="worker in workers" :key="worker.id">
                        <p class="pair-value worker"><b>{{ worker.name }}</b><span>{{ worker.task }}</span></p>
                    </template>
                </div>
            </template>
            <template v-else-if="inHand">
                <div>
                    <p class="pair-label">Task being worked on</p>
                    <p class="pair-value worker"><b>{{ inHand.id }}</b><span>{{ inHand.title }}</span></p>
                </div>
            </template>
        </div>
        <div class="foot">
            <div class="foot-line">
                <span class="done"><b>{{ standing.done }} of {{ standing.rows }}</b> tasks done</span>
                <span class="acts">
                    <template v-if="pausable">
                        <button type="button" class="act" title="Pause the plan and its open tasks" @click.stop="pause">
                            <svg viewBox="0 0 12 12"><rect x="2.5" y="2" width="2.4" height="8" rx="1" fill="currentColor" /><rect x="7.1" y="2" width="2.4" height="8" rx="1" fill="currentColor" /></svg>
                            Pause
                        </button>
                    </template>
                    <button type="button" class="act" title="Open the plan" @click.stop="peek('plans', plan.id)">
                        <svg viewBox="0 0 12 12"><path d="M2 6h6.2M5.6 2.8 8.8 6l-3.2 3.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><path d="M10.4 2.5v7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" /></svg>
                        Open
                    </button>
                </span>
            </div>
            <div :class="['bar', {stalled: status === 'blocked'}]" role="progressbar" :aria-valuenow="standing.done" :aria-valuemax="standing.rows">
                <i :style="{width: `${standing.donePart}%`}" />
            </div>
        </div>
    </article>
</template>

<style scoped>
.run {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
    margin: 0 10px 8px;
    padding: 12px 14px 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    cursor: pointer;
    transition:
        background 0.15s,
        border-color 0.15s;
}

.run:hover {
    background: var(--hover);
    border-color: var(--border-2);
}

.run-title {
    display: flex;
    gap: 8px;
    align-items: baseline;
    margin: 0;
    font-size: 13.5px;
    font-weight: 500;
    line-height: 1.35;
}

.number {
    flex: none;
    color: var(--text-4);
    font-size: 12.5px;
    font-weight: 400;
    font-variant-numeric: tabular-nums;
}

.words {
    min-width: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.state {
    display: flex;
    align-items: baseline;
    gap: 7px;
    color: var(--text-2);
    font-size: 12px;
}

.state-name {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--tone);
    font-weight: 500;
}

.state-why {
    min-width: 0;
    color: var(--text-2);
}

.dot {
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--tone);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--tone) 22%, transparent);
}

.tone-workers {
    --tone: var(--tone-helper);
}

.tone-working {
    --tone: var(--progress);
}

.tone-asks {
    --tone: var(--asks);
}

.tone-blocked {
    --tone: var(--blocking);
}

.tone-ready {
    --tone: var(--accent-text);
}

.tone-paused {
    --tone: var(--tone-paused);
}

.tone-review {
    --tone: var(--text-3);
}

.pairs {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
}

@container (min-width: 420px) {
    .pairs {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 16px;
    }
}

.pair-label {
    margin: 0 0 2px;
    color: var(--text-4);
    font-size: 11px;
}

.pair-value {
    margin: 0;
    color: var(--text-2);
    font-size: 12.5px;
}

.pair-value b {
    color: var(--text);
    font-weight: 400;
}

.worker {
    display: flex;
    gap: 6px;
    min-width: 0;
    white-space: nowrap;
}

.worker b {
    flex: none;
}

.worker span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text-3);
}

.foot {
    display: grid;
    gap: 6px;
    margin-top: 2px;
}

.foot-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 22px;
}

.done {
    color: var(--text-3);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
}

.done b {
    color: var(--text-2);
    font-weight: 500;
}

.acts {
    display: flex;
    gap: 2px;
    opacity: 0;
    transition: opacity 0.15s;
}

.run:hover .acts,
.run:focus-within .acts {
    opacity: 1;
}

.act {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 22px;
    padding: 0 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11.5px;
    cursor: pointer;
}

.act:hover {
    background: var(--sel);
    color: var(--text);
}

.act svg {
    width: 12px;
    height: 12px;
}

.bar {
    height: 4px;
    border-radius: 2px;
    background: var(--border);
    overflow: hidden;
}

.bar > i {
    display: block;
    height: 100%;
    border-radius: 2px;
    background: var(--accent);
    transition: width 0.4s ease;
}

.bar.stalled > i {
    background: var(--text-4);
}
</style>
