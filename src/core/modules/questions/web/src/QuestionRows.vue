<script setup>
import {RowList, useListTools, ListTools, useRows} from "@journal/window-kit";
import QuestionCard from "./QuestionCard.vue";

const {rows, failure, loaded, load} = useRows("question list --all", ["question.*"]);
const tools = useListTools(rows, {title: (row) => row.text, isOpen: (row) => row.state === "open"});
</script>

<template>
    <div class="questions">
        <ListTools :tools="tools" placeholder="Search the questions" />
        <RowList :rows="tools.shown.value" :failure="failure" :loaded="loaded" empty="No open questions">
            <template #default="{row}">
                <QuestionCard :row="row" @changed="load" />
            </template>
        </RowList>
    </div>
</template>
