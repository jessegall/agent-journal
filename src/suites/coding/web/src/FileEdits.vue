<script setup>
import {RowList, useRows} from "@journal/window-kit";

const {rows, failure, loaded} = useRows("file-edit list", ["file_edit.create"]);
</script>

<template>
    <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No edits yet">
        <template #default="{row}">
            <span class="main">{{ row.path }}</span>
            <span class="note">+{{ row.added }}</span>
            <span class="note">-{{ row.removed }}</span>
            <span class="note">agent {{ row.agent_id }}</span>
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
