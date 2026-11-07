<script setup>
import {computed, watch} from "vue";
import {WindowRoom, useWindow} from "@journal/window-kit";
import QuestionCard from "./QuestionCard.vue";

// a question in the chat: the card itself, read from the row its mark points at
const context = useWindow();
const mark = context.option("row");
const key = computed(() => `question.${mark.value.target_id}`);
const row = computed(() => context.props[key.value].data.value);

const load = () => context.reload(key.value);
watch(key, load, {immediate: true});
</script>

<template>
    <WindowRoom padding="14px 16px">
        <template v-if="row">
            <QuestionCard :row="row" @changed="load" />
        </template>
    </WindowRoom>
</template>
