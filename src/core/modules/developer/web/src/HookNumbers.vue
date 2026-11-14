<script setup>
import {computed, ref} from "vue";
import {Btn, TableLayout, WindowRoom, useWindow} from "@journal/window-kit";

const view = useWindow();
const costliestFirst = ref(false);
const {data: numbers, failure} = view.props.numbers;
const load = () => view.reload("numbers");
const rows = computed(() => numbers.value?.rows ?? []);
const COLUMNS = [{key: "hook", label: "Hook, reader or route"}, {key: "count", label: "Count"}, {key: "average_points", label: "Average points"}, {key: "most_points", label: "Most points"}];

function sortByCost() {
    costliestFirst.value = !costliestFirst.value;
    view.state["numbers.costliest"] = String(costliestFirst.value);
    load();
}

async function reset() {
    const answer = await view.run(["developer", "reset-numbers"]);
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
                <TableLayout :columns="COLUMNS" :rows="rows" data-numbers-table />
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
</style>
