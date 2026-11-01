<script setup>
import {computed, ref} from "vue";
import {peekRef, RowList, Segmented, TextInput, useRows} from "@journal/window-kit";

const SHOWS = [
    {key: "running", label: "Running"},
    {key: "closed", label: "Closed"},
    {key: "all", label: "All"},
];
const props = defineProps({line: {type: String, required: true}, empty: {type: String, required: true}});
const {rows, failure, loaded, older} = useRows(props.line, ["agent.*"], {incremental: true});
const show = ref("all");
const words = ref("");

const kept = (row) => show.value === "all" || (show.value === "running") === !row.ended_at;
const found = (row) => `${row.id} ${row.session} ${row.program} ${row.role}`.toLowerCase().includes(words.value.trim().toLowerCase());
const shown = computed(() => rows.value.filter((row) => kept(row) && found(row)));
const emptyText = computed(() => (rows.value.length ? "Nothing matches" : props.empty));
</script>

<template>
    <div class="agents">
        <div class="agents-bar">
            <TextInput v-model="words" icon="search" class="agents-search" placeholder="Search the agents" data-agents-search />
            <Segmented :options="SHOWS" :value="show" @pick="show = $event" />
        </div>
        <RowList :rows="shown" :failure="failure" :loaded="loaded" :older="older" :empty="emptyText">
            <template #default="{row}">
                <button type="button" class="open" :data-agent-open="row.id" @click="peekRef(`agents:${row.id}`)">Open</button>
                <span class="id">#{{ row.id }}</span>
                <span class="main">{{ row.session }}</span>
                <span class="note">{{ row.program }} · {{ row.role }}</span>
                <span :class="['state', {running: !row.ended_at}]">{{ row.ended_at ? `Closed ${new Date(row.ended_at).toLocaleString()}` : "Running" }}</span>
            </template>
        </RowList>
    </div>
</template>

<style scoped>
.agents {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.open {
    padding: 0 6px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: transparent;
    color: var(--text-2);
    font-size: 12px;
    cursor: pointer;
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

.id {
    flex: none;
    width: 44px;
    color: var(--text-3);
    font-size: 12px;
}

.state {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
}

.state.running {
    color: var(--accent-text);
}

.main {
    flex: 1;
}

.note {
    color: var(--text-3);
    font-size: 12px;
}
</style>
