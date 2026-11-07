<script setup>
import {computed, ref} from "vue";
import {Btn, WindowRoom, useWindow} from "@journal/window-kit";

const window = useWindow();
const costliestFirst = ref(false);
const {data: numbers, failure} = window.props.numbers;
const load = () => window.reload("numbers");
const rows = computed(() => numbers.value?.rows ?? []);

function sortByCost() {
    costliestFirst.value = !costliestFirst.value;
    window.state["numbers.costliest"] = String(costliestFirst.value);
    load();
}

async function reset() {
    const answer = await window.run(["developer", "reset-numbers"]);
    failure.value = answer.ok ? "" : answer.error;
    load();
}

</script>

<template>
    <WindowRoom>
        <div class="numbers" data-hook-numbers>
            <div class="numbers-tools">
                <Btn small bordered data-numbers-sort @click="sortByCost">{{ costliestFirst ? "By name" : "Costliest first" }}</Btn>
                <Btn small bordered data-numbers-reset @click="reset">Reset the counts</Btn>
            </div>
            <template v-if="failure">
                <p class="numbers-note" role="alert">{{ failure }}</p>
            </template>
            <template v-else-if="!rows.length">
                <p class="numbers-note">Nothing counted yet. Call costs in the developer settings turns the counts on.</p>
            </template>
            <template v-else>
                <table class="numbers-table">
                    <thead>
                        <tr><th>Hook, reader or route</th><th>Count</th><th>Average points</th><th>Most points</th></tr>
                    </thead>
                    <tbody>
                        <template v-for="row in rows" :key="row.id">
                            <tr data-number-row>
                                <td>{{ row.hook }}</td>
                                <td>{{ row.count }}</td>
                                <td>{{ row.average_points }}</td>
                                <td>{{ row.most_points }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </template>
        </div>
    </WindowRoom>
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
