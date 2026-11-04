<script setup>
import {ListTools, RowList, WindowRoom, useListTools, useRows} from "@journal/window-kit";
import QuestionCard from "./QuestionCard.vue";

const {rows, failure, loaded, load} = useRows("question list --all", ["question.*"]);
const tools = useListTools(rows, {title: (row) => row.text, isOpen: (row) => row.state === "open"});
</script>

<template>
    <WindowRoom padding="0">
        <div class="questions">
            <ListTools :tools="tools" />
            <RowList :rows="tools.shown.value" :failure="failure" :loaded="loaded" empty="No open questions" hint="Unanswered questions from the agent appear here." :searching="tools.filtering.value">
                <template #default="{row}">
                    <QuestionCard :row="row" flush @changed="load" />
                </template>
            </RowList>
        </div>
    </WindowRoom>
</template>

<style scoped>
.questions :deep(.row-list) {
    gap: 0;
}

.questions :deep(.row-list-row) {
    padding: 0;
    border-radius: 0;
}

.questions :deep(.row-list-row:hover) {
    background: none;
}
</style>
