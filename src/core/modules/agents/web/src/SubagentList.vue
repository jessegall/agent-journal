<script setup>
import {RowList, useRows, useWindow} from "@journal/window-kit";

const {rows, failure} = useRows(`agent list --parent ${useWindow().agent}`, ["agent.*"]);
</script>

<template>
    <RowList :rows="rows" :failure="failure" empty="No subagents yet">
        <template #default="{row}">
            <span class="main">{{ row.role }}</span>
            <span class="note">{{ row.session }}</span>
            <span class="note">{{ row.program }}</span>
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
