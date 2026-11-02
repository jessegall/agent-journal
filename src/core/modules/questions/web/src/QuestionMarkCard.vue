<script setup>
import {ref} from "vue";
import {useWindow} from "@journal/window-kit";
import QuestionCard from "./QuestionCard.vue";

// a question in the chat: the card itself, read from the row its mark points at
const context = useWindow();
const mark = context.option("row");
const row = ref(null);

async function load() {
    const answer = await context.read(`question show ${mark.value.target_id}`);
    if (answer.ok) row.value = answer.value;
}

context.follow(["question.*"], load);
load();
</script>

<template>
    <template v-if="row">
        <QuestionCard :row="row" @changed="load" />
    </template>
</template>
