<script setup>
import {RowList, WindowRoom, useWindow} from "@journal/window-kit";

const STATE_TEXT = {pending: "to do", in_progress: "doing", completed: "done"};

const view = useWindow();
view.state["todos.agent"] = String(view.agent);
const {rows, failure, loaded} = view.props.todos;
</script>

<template>
    <WindowRoom>
        <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="This agent has written no tasks yet" hint="Tasks created by this agent appear here.">
            <template #default="{row}">
                <span class="main">{{ row.text }}</span>
                <span class="note">{{ STATE_TEXT[row.state] || row.state }}</span>
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
