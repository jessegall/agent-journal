<script setup>
import {computed} from "vue";
import {approvePlan} from "../actions/plans.js";
import {phaseCount, planButton, planTone, sizeOf, standingOf, waitingLabel} from "../domain/plans.js";
import {counted} from "../format/number.js";
import {peek} from "../route.js";
import {rows} from "../sync/rows.js";

// A plan waiting to start, as the Plans window draws it: a quiet row with its state, its size or how far it came, and a thin bar the full width beneath.
const props = defineProps({plan: {type: Object, required: true}});
const emit = defineEmits(["failed"]);
const standing = computed(() => standingOf(props.plan, rows("tasks")));
const size = computed(() => (standing.value.done ? `${standing.value.done} of ${standing.value.rows} tasks done · ${counted(phaseCount(props.plan), "phase")}` : sizeOf(props.plan)));
const approvable = computed(() => Boolean(planButton(props.plan)));

async function approve() {
    try {
        await approvePlan(props.plan);
    } catch (e) {
        emit("failed", e.message);
    }
}
</script>

<template>
    <div :class="['wait', `tone-${planTone(plan)}`]" :title="`Plan ${plan.id}: ${plan.title}`" @click="peek('plans', plan.id)">
        <div class="wait-top">
            <span class="number">{{ plan.id }}</span>
            <span class="wait-title">{{ plan.title }}</span>
            <template v-if="approvable">
                <span class="acts">
                    <button type="button" class="act approve" title="Approve the plan so the agent starts it" @click.stop="approve">
                        <svg viewBox="0 0 12 12"><path d="M2.2 6.4 4.8 9l5-6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
                        Approve
                    </button>
                </span>
            </template>
        </div>
        <div class="wait-meta">
            <span class="state-name"><i class="dot" />{{ waitingLabel(plan) }}</span>
            <span class="size">{{ size }}</span>
        </div>
        <div class="bar"><i :style="{width: `${standing.donePart}%`}" /></div>
    </div>
</template>

<style scoped>
.wait {
    display: grid;
    gap: 4px;
    padding: 9px 24px 11px;
    cursor: pointer;
}

.wait:hover {
    background: var(--hover);
}

.wait-top {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-height: 22px;
}

.number {
    flex: none;
    color: var(--text-4);
    font-size: 12.5px;
    font-variant-numeric: tabular-nums;
}

.wait-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
}

.wait-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 2px 12px;
    color: var(--text-3);
    font-size: 12px;
}

.state-name {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--tone);
}

.dot {
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1.5px var(--tone);
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

.tone-blocked {
    --tone: var(--blocking);
}

.tone-working,
.tone-workers,
.tone-asks {
    --tone: var(--progress);
}

.size {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

.acts {
    display: flex;
    align-self: center;
    opacity: 0;
    transition: opacity 0.15s;
}

.wait:hover .acts,
.wait:focus-within .acts {
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
    color: var(--accent-text);
    font: inherit;
    font-size: 11.5px;
    cursor: pointer;
}

.act:hover {
    background: var(--sel);
}

.act svg {
    width: 12px;
    height: 12px;
}

.bar {
    height: 2px;
    margin-top: 3px;
    border-radius: 1px;
    background: var(--border);
    overflow: hidden;
}

.bar > i {
    display: block;
    height: 100%;
    background: var(--accent);
}
</style>
