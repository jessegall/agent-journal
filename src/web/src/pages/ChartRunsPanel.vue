<script setup>
import {ago} from "../format/time.js";
import SidePanel from "../kit/SidePanel.vue";

defineProps({runs: {type: Array, required: true}});
const emit = defineEmits(["close", "open"]);
</script>

<template>
    <SidePanel
        title="Recent runs"
        abstract="The last ten runs across every workflow, newest first. A run opens its workflow with the steps it took lit."
        @close="emit('close')"
    >
        <template v-if="!runs.length">
            <p class="chart-runs-empty">No runs yet.</p>
        </template>
        <template v-else>
            <ul class="chart-runs">
                <template v-for="run in runs" :key="run.at">
                    <li>
                        <button type="button" class="chart-run" @click="emit('open', run)">
                            <span class="chart-run-when">
                                {{ ago(run.at) }}
                                <template v-if="run.failed">
                                    <span class="chart-row-bad">· Failed</span>
                                </template>
                            </span>
                            <span class="chart-run-title">{{ run.titles.join(" and ") }}</span>
                            <span class="chart-run-said">On {{ run.event_title }}</span>
                            <template v-if="run.change">
                                <span class="chart-run-said">{{ run.change }}</span>
                            </template>
                            <template v-if="run.answer">
                                <span class="chart-run-said">{{ run.answer }}</span>
                            </template>
                            <template v-if="run.counts">
                                <span class="chart-run-said">Values: {{ run.counts }}</span>
                            </template>
                        </button>
                    </li>
                </template>
            </ul>
        </template>
    </SidePanel>
</template>

<style scoped>
.chart-row-bad {
    color: var(--danger-soft);
    font-size: 11.5px;
    font-weight: 400;
}

.chart-runs {
    margin: 0;
    padding: 0;
    list-style: none;
}

.chart-runs li + li {
    border-top: 1px solid var(--line);
}

.chart-run {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
    padding: 8px 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.chart-run:hover .chart-run-title {
    color: var(--accent-text);
}

.chart-run-when {
    color: var(--text-3);
    font-size: 11.5px;
}

.chart-run-title {
    font-size: 13px;
    font-weight: 500;
}

.chart-run-said {
    display: -webkit-box;
    overflow: hidden;
    color: var(--text-2);
    font-size: 12px;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
}

.chart-runs-empty {
    margin: 0;
    color: var(--text-3);
}
</style>
