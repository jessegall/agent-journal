<script setup>
import {RowList, useRows, useWindow} from "@journal/window-kit";

const STATE_TEXT = {pending: "to do", in_progress: "doing", completed: "done"};

const {rows, failure} = useRows(`todo-item list --agent ${useWindow().agent} --oldest`, ["todo_item.*"]);
</script>

<template>
    <RowList :rows="rows" :failure="failure" empty="This agent has written no to-do list yet">
        <template #default="{row}">
            <span class="main">{{ row.text }}</span>
            <span class="note">{{ STATE_TEXT[row.state] || row.state }}</span>
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
