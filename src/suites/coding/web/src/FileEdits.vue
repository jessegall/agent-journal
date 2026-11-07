<script setup>
import {computed, ref} from "vue";
import {RowList, SearchBar, WindowRoom, useWindow} from "@journal/window-kit";

const view = useWindow();
const {rows, failure, loaded, more, older} = view.props.edits;
const filter = ref("");
const shown = computed(() => {
    const wanted = filter.value.trim().toLowerCase();
    return wanted ? rows.value.filter((row) => row.path.toLowerCase().includes(wanted)) : rows.value;
});
</script>

<template>
    <WindowRoom>
        <SearchBar v-model="filter" data-edits-filter />
        <RowList :rows="shown" :failure="failure" :loaded="loaded" :more="more" :older="filter ? null : older" empty="No edits yet" hint="Files changed by agents appear here." :searching="Boolean(filter)" matches="No file matches">
            <template #default="{row}">
                <span class="main">{{ row.path }}</span>
                <span class="note">+{{ row.added }}</span>
                <span class="note">-{{ row.removed }}</span>
                <span class="note">agent {{ row.session_agent_id }}</span>
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
