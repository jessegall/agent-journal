<script setup>
import {computed, ref} from "vue";
import {Btn, FilterBar, ListReaderLayout, PageHeader, Skeleton, applyFilter, defaultFilter, useWindow} from "@journal/window-kit";
import MemoryEdit from "./MemoryEdit.vue";
import MemoryReader from "./MemoryReader.vue";
import {READER_WEIGHTS, memoryItems} from "./MemoryRow.js";
import {memoryFilters, ownerName} from "./memoryWords.js";
import {usePagedRead} from "./usePagedRead.js";

// the memories of the environment as a list and a reader: a row is its words, the agent and the weight under them, and the number of the task it belongs to at the right edge under a Task column.
// The filters start on the active memories. There is no New memory here: an agent makes its own
const LIST_WIDTH = 460;
const PAGE_ROWS = 100;
const view = useWindow();
const memories = usePagedRead("memories", (limit) => ({environment: view.environment, removed: true, order: "newest", limit}), PAGE_ROWS, ["memory.*"]);
const agents = computed(() => view.props.memories.data.value?.agents ?? []);
const fields = computed(() => memoryFilters(memories.rows.value, agents.value));
const filter = ref(defaultFilter(fields.value));
const words = ref("");
const shown = computed(() => applyFilter(memories.rows.value, fields.value, filter.value, words.value, ["text", "reason"]));
const items = computed(() => shown.value.map((row) => ({id: row.id, title: row.text, desc: `${ownerName(row, agents.value)} · weight ${row.weight}`, row, owner: ownerName(row, agents.value)})));
const chosen = ref(null);
const editing = ref(null);
const itemsOf = (row, options = {}) => memoryItems(row, {run: view.run, ask: () => (editing.value = row), ...options});
const place = (item) => ({head: `Memory ${item.id}`, items: itemsOf(item.row, {})});
const emptyTitle = computed(() => (memories.rows.value.length ? "No memory here matches" : "No memories yet"));
</script>

<template>
    <ListReaderLayout v-model:chosen="chosen" :items="items" :list-width="LIST_WIDTH" :place="place" :empty-title="emptyTitle" pick-line="Choose a memory" open-first data-memories>
        <template #top>
            <PageHeader title="Memories" :count="memories.total.value" />
            <FilterBar v-model="filter" v-model:words="words" :fields="fields" :rows="memories.rows.value" :shown="shown.length" placeholder="Search memories" />
            <template v-if="memories.hasMore.value">
                <p class="more" data-memories-more>Showing {{ memories.rows.value.length }} of {{ memories.total.value }} <Btn small bordered @click="memories.more()">Show more</Btn></p>
            </template>
            <template v-if="memories.failure.value">
                <p class="failure" role="alert" data-memories-failure>{{ memories.failure.value }}</p>
            </template>
            <template v-if="editing"><MemoryEdit :row="editing" @close="editing = null" /></template>
        </template>
        <template #empty>
            <template v-if="!memories.loaded.value"><Skeleton shape="rows" /></template>
            <template v-else-if="!memories.rows.value.length">Memories you or the agent save appear here.</template>
            <template v-else>Try other words or filters.</template>
        </template>
        <template #meta="{item}">
            <span class="task" :title="item.row.task_id ? `Task ${item.row.task_id}` : ''" data-memory-task>{{ item.row.task_id ?? "" }}</span>
        </template>
        <template #reader="{item}">
            <MemoryReader :row="item.row" :owner="item.owner" :items="itemsOf(item.row, {weights: READER_WEIGHTS, openLabel: 'Open in inspector'})" />
        </template>
    </ListReaderLayout>
</template>

<style scoped>
.more {
    margin: 0;
    padding: 4px 16px;
    color: var(--text-3);
    font-size: 12px;
}

.task {
    color: var(--text-3);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
}

.failure {
    margin: 0;
    padding: 6px var(--inset);
    color: var(--bad, var(--text-2));
    font-size: 12px;
}
</style>
