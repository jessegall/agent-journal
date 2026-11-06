<script setup>
import {ListTools, RowList, WindowRoom, useListTools, useWindow} from "@journal/window-kit";
import QuestionCard from "./QuestionCard.vue";

const window = useWindow();
window.state.tab = window.shared ? "shared" : "list";
const key = window.shared ? `question.${window.shared.id}` : "questions";
const {rows, failure, loaded, load} = window.props[key];
if (window.shared) window.reload(key);
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
.questions {
    background: var(--side);
}

.questions :deep(.row-list) {
    gap: 16px;
}

.questions :deep(.row-list-row) {
    padding: 0;
    border-radius: 0;
}

.questions :deep(.row-list-row:hover) {
    background: none;
}
</style>
