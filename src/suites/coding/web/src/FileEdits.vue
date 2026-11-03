<script setup>
import {computed, ref} from "vue";
import {RowList, SearchBar, WindowRoom, useRows} from "@journal/window-kit";

const {rows, failure, loaded, more, older} = useRows("file-edit list", ["file_edit.create"], {incremental: true});
const filter = ref("");
const shown = computed(() => {
    const wanted = filter.value.trim().toLowerCase();
    return wanted ? rows.value.filter((row) => row.path.toLowerCase().includes(wanted)) : rows.value;
});
</script>

<template>
    <WindowRoom>
        <SearchBar v-model="filter" data-edits-filter />
        <RowList :rows="shown" :failure="failure" :loaded="loaded" :more="more" :older="filter ? null : older" empty="No edits yet" hint="The files an agent changes show here as it works." :searching="Boolean(filter)" matches="No file matches">
            <template #default="{row}">
                <span class="main">{{ row.path }}</span>
                <span class="note">+{{ row.added }}</span>
                <span class="note">-{{ row.removed }}</span>
                <span class="note">agent {{ row.agent_id }}</span>
            </template>
        </RowList>
    </WindowRoom>
</template>

<style scoped>
.main {
    flex: 1;
}

.note {
    color: var(--text-3);
    font-size: 12px;
}
</style>
