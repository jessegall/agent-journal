<script setup>
import {computed, ref} from "vue";
import {RowList, Segmented, TextInput, useRows} from "@journal/window-kit";
import AgentCard from "./AgentCard.vue";

const SHOWS = [
    {key: "running", label: "Running"},
    {key: "closed", label: "Closed"},
    {key: "all", label: "All"},
];
const props = defineProps({line: {type: String, required: true}, empty: {type: String, required: true}, only: {type: Function, default: () => true}});
const {rows, failure, loaded, older} = useRows(props.line, ["agent.*"], {incremental: true});
const {rows: facts} = useRows("usage agents", ["agent.*", "task.*"]);
const show = ref("running");
const words = ref("");

const kept = (row) => show.value === "all" || (show.value === "running") === !row.ended_at;
const factsOf = (row) => facts.value.find((fact) => fact.id === row.id) ?? null;
const found = (row) => `${row.id} ${row.session} ${row.program} ${row.role} ${factsOf(row)?.task_title ?? ""}`.toLowerCase().includes(words.value.trim().toLowerCase());
const shown = computed(() => rows.value.filter((row) => props.only(row) && kept(row) && found(row)));
const emptyText = computed(() => (rows.value.some(props.only) ? "Nothing matches" : props.empty));
</script>

<template>
    <div class="agents" data-window-flush>
        <div class="agents-bar">
            <TextInput v-model="words" icon="search" class="agents-search" placeholder="Search the agents" data-agents-search />
            <Segmented :options="SHOWS" :value="show" @pick="show = $event" />
        </div>
        <RowList :rows="shown" :failure="failure" :loaded="loaded" :older="older" :empty="emptyText">
            <template #default="{row}">
                <AgentCard :row="row" :facts="factsOf(row)" />
            </template>
        </RowList>
    </div>
</template>

<style scoped>
.agents {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 400px;
    min-height: 0;
}

.agents :deep(.row-list) {
    gap: 0;
}

.agents :deep(.row-list-row) {
    padding: 0;
}

.agents-bar {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
}

.agents-search {
    flex: 1;
    min-width: 0;
}

</style>
