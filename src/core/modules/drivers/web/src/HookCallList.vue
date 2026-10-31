<script setup>
import {RowList, useRows, useWindow} from "@journal/window-kit";

const {rows, failure, loaded} = useRows(`hook-call list --agent ${useWindow().agent}`, ["hook_call.create"]);
</script>

<template>
    <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="Nothing recorded for this agent yet">
        <template #default="{row}">
            <span class="note">{{ row.hook }}</span>
            <span class="main">{{ row.tool }} {{ row.summary }}</span>
            <span class="note">{{ row.refusal || row.answer }}</span>
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
