<script setup>
import {ListTools, RowList, WindowRoom, useListTools, useRows} from "@journal/window-kit";
import QuestionCard from "./QuestionCard.vue";

const {rows, failure, loaded, load} = useRows("question list --all", ["question.*"]);
const tools = useListTools(rows, {title: (row) => row.text, isOpen: (row) => row.state === "open"});
</script>

<template>
    <WindowRoom>
        <div class="questions">
            <ListTools :tools="tools" />
            <RowList :rows="tools.shown.value" :failure="failure" :loaded="loaded" empty="No open questions" hint="A question the agent asks you shows here until you answer it." :searching="tools.filtering.value">
                <template #default="{row}">
                    <QuestionCard :row="row" @changed="load" />
                </template>
            </RowList>
        </div>
    </WindowRoom>
</template>
