<script setup>
import {computed, ref} from "vue";
import {Btn, usePoll, useReadLine, useWindow} from "@journal/window-kit";

// what each kind of hook has cost since the counts began, read again every few seconds: by name or slowest first, and a reset
const context = useWindow();
const slowestFirst = ref(false);
const {value: numbers, failure, load} = useReadLine(() => `developer numbers${slowestFirst.value ? " --slowest" : ""}`);
const rows = computed(() => numbers.value?.rows ?? []);

function sortBySlowest() {
    slowestFirst.value = !slowestFirst.value;
    load();
}

async function reset() {
    const answer = await context.run(["developer", "reset-numbers"]);
    failure.value = answer.ok ? "" : answer.error;
    load();
}

usePoll(load, () => true);
</script>

<template>
    <div class="numbers" data-hook-numbers>
        <div class="numbers-tools">
            <Btn small bordered data-numbers-sort @click="sortBySlowest">{{ slowestFirst ? "By name" : "Slowest first" }}</Btn>
            <Btn small bordered data-numbers-reset @click="reset">Reset the counts</Btn>
        </div>
        <template v-if="failure">
            <p class="numbers-note" role="alert">{{ failure }}</p>
        </template>
        <template v-else-if="!rows.length">
            <p class="numbers-note">Nothing counted yet. Hook durations in the developer settings turns the counts on.</p>
        </template>
        <template v-else>
            <table class="numbers-table">
                <thead>
                    <tr><th>Hook, reader or route</th><th>Count</th><th>Average</th><th>Slowest</th><th>Points</th></tr>
                </thead>
                <tbody>
                    <template v-for="row in rows" :key="row.id">
                        <tr data-number-row>
                            <td>{{ row.hook }}</td>
                            <td>{{ row.count }}</td>
                            <td>{{ row.average_ms }} ms</td>
                            <td>{{ row.slowest_ms }} ms</td>
                            <td>{{ row.average_points }}</td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </template>
    </div>
</template>

<style scoped>
.numbers-tools {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
}

.numbers-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.numbers-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12.5px;
}

.numbers-table th,
.numbers-table td {
    padding: 4px 8px;
    border-bottom: 1px solid var(--border);
    text-align: left;
}

.numbers-table th {
    color: var(--text-3);
    font-weight: 500;
}
</style>
