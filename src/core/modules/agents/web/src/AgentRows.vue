<script setup>
import {RowList, useRows} from "@journal/window-kit";

const props = defineProps({line: {type: String, required: true}, empty: {type: String, required: true}});
const {rows, failure} = useRows(props.line, ["agent.*"]);
</script>

<template>
    <RowList :rows="rows" :failure="failure" :empty="empty">
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
