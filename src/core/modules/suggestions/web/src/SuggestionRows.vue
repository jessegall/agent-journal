<script setup>
import {RowList, useListTools, ListTools, peekRef, useRows} from "@journal/window-kit";

const {rows, failure, loaded} = useRows("suggestion list", ["suggestion.*"]);
const tools = useListTools(rows, {title: (row) => row.title});

const answerText = (row) => (row.answer ? `Answer: ${row.answer}` : "Answer: none yet");
</script>

<template>
    <ListTools :tools="tools" />
    <RowList :rows="tools.shown.value" :failure="failure" :loaded="loaded" empty="No suggestions yet" hint="A suggestion the journal makes, such as a server to install, shows here for you to accept or decline." :searching="tools.filtering.value">
        <template #default="{row}">
            <div class="suggestion" :data-row="row.id">
                <button type="button" class="title" :data-suggestion-open="row.id" @click="peekRef(`suggestions:${row.id}`)">{{ row.title }}</button>
                <span class="answer">{{ answerText(row) }}</span>
            </div>
        </template>
    </RowList>
</template>

<style scoped>
button.title {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.suggestion {
    display: flex;
    flex: 1;
    align-items: baseline;
    gap: 10px;
    font-size: 13px;
}

.title {
    flex: 1;
}

.answer {
    color: var(--text-3);
    font-size: 12px;
}
</style>
