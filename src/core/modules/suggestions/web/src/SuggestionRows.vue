<script setup>
import {RowList, useRows} from "@journal/window-kit";

const {rows, failure, loaded} = useRows("suggestion list", ["suggestion.*"]);

const answerText = (row) => (row.answer ? `Answer: ${row.answer}` : "Answer: none yet");
</script>

<template>
    <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No suggestions yet">
        <template #default="{row}">
            <div class="suggestion" :data-row="row.id">
                <span class="title">{{ row.title }}</span>
                <span class="answer">{{ answerText(row) }}</span>
            </div>
        </template>
    </RowList>
</template>

<style scoped>
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
