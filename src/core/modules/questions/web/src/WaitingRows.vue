<script setup>
import {computed} from "vue";
import {RowList, useRows} from "@journal/window-kit";

const {rows: waits, failure} = useRows("wait list", ["wait.*"]);
const {rows: targets} = useRows("wait-target list", ["wait_target.*"]);
const rows = computed(() => waits.value.map((wait) => ({
    id: wait.id,
    label: wait.focus,
    status: wait.state,
    where: targets.value.filter((target) => target.wait_id === wait.id).map((target) => `${target.row_table}:${target.row_id}`).join(", "),
})));
</script>

<template>
    <RowList :rows="rows" :failure="failure" empty="Nothing is waiting">
        <template #default="{row}">
            <span class="label">{{ row.label }}</span>
            <span class="status">{{ row.status }}</span>
            <span class="where">{{ row.where }}</span>
        </template>
    </RowList>
</template>

<style scoped>
.label {
    flex: 1;
}

.status,
.where {
    color: var(--text-3);
    font-size: 12px;
}
</style>
