<script setup>
import {RowList, useRows} from "@journal/window-kit";

const {rows, failure} = useRows("plan list", ["plan.*", "phase.*"]);
</script>

<template>
    <RowList :rows="rows" :failure="failure" empty="No plans yet">
        <template #default="{row}">
            <span class="title">{{ row.title }}</span>
            <span class="state">{{ row.state }}</span>
        </template>
    </RowList>
</template>

<style scoped>
.title {
    flex: 1;
}

.state {
    color: var(--text-3);
    font-size: 12px;
}
</style>
