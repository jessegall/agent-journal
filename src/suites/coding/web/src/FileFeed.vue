<script setup>
import {RowList, useRows, useWindow} from "@journal/window-kit";

const {rows, failure, loaded} = useRows(`file-edit list --agent ${useWindow().agent}`, ["file_edit.create"]);
</script>

<template>
    <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No edits by this agent yet">
        <template #default="{row}">
            <span class="main">{{ row.path }}</span>
            <span class="note">+{{ row.added }}</span>
            <span class="note">-{{ row.removed }}</span>
        </template>
    </RowList>
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
