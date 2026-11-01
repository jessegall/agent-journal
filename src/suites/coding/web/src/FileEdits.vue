<script setup>
import {computed, ref} from "vue";
import {RowList, useRows} from "@journal/window-kit";

const {rows, failure, loaded, older} = useRows("file-edit list", ["file_edit.create"], {incremental: true});
const filter = ref("");
const shown = computed(() => {
    const wanted = filter.value.trim().toLowerCase();
    return wanted ? rows.value.filter((row) => row.path.toLowerCase().includes(wanted)) : rows.value;
});
</script>

<template>
    <input v-model="filter" class="filter" type="search" placeholder="Filter files" aria-label="Filter files" data-edits-filter @keydown.esc="filter = ''">
    <RowList :rows="shown" :failure="failure" :loaded="loaded" :older="filter ? null : older" :empty="filter ? 'No file matches' : 'No edits yet'">
        <template #default="{row}">
            <span class="main">{{ row.path }}</span>
            <span class="note">+{{ row.added }}</span>
            <span class="note">-{{ row.removed }}</span>
            <span class="note">agent {{ row.agent_id }}</span>
        </template>
    </RowList>
</template>

<style scoped>
.filter {
    box-sizing: border-box;
    width: 100%;
    max-width: 320px;
    margin-bottom: 8px;
    padding: 5px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
}

.main {
    flex: 1;
}

.note {
    color: var(--text-3);
    font-size: 12px;
}
</style>
