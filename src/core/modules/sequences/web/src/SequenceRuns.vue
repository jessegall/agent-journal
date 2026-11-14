<script setup>
import {AgentBadge} from "@journal/window-kit";
import {canAbandon, progress} from "./sequenceWords.js";

// the runs of a sequence that are going now: the agent, a bar of the steps done and the step it is on; the run that can be given up has its button
const props = defineProps({runs: {type: Array, required: true}, all: {type: Array, required: true}});
const emit = defineEmits(["abandon"]);
const stepWords = (run) => `Step ${run.step_number} of ${progress(run).total}${run.step_started ? "" : ", not started yet"}`;
</script>

<template>
    <section class="sequence-runs" data-sequence-runs>
        <template v-if="!runs.length">
            <p class="none" data-runs-none>No run is going now</p>
        </template>
        <template v-for="run in runs" :key="run.id">
            <div class="run" data-run>
                <span class="run-number">{{ run.id }}</span>
                <AgentBadge :name="`Agent ${run.session_agent_id}`" />
                <span class="bar" role="progressbar" :aria-valuenow="progress(run).done" aria-valuemin="0" :aria-valuemax="progress(run).total"><i :style="{width: `${(progress(run).done / progress(run).total) * 100}%`}" /></span>
                <span class="run-words">{{ stepWords(run) }}</span>
                <template v-if="canAbandon(run, all)">
                    <button type="button" class="abandon" data-run-abandon @click="emit('abandon', run)">Abandon</button>
                </template>
            </div>
        </template>
    </section>
</template>

<style scoped>
.run {
    display: flex;
    align-items: center;
    gap: var(--s3);
    padding: 8px 0;
    border-bottom: 1px solid var(--border-inner);
    font-size: 12.5px;
}

.run-number {
    flex: none;
    width: 30px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.bar {
    flex: 1;
    min-width: 40px;
    height: 4px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--border-2);
}

.bar i {
    display: block;
    height: 100%;
    background: var(--accent);
}

.run-words {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
    white-space: nowrap;
}

.abandon {
    flex: none;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.none {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
