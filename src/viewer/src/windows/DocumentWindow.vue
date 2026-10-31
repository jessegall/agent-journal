<script setup>
import {ref} from "vue";
import Dashboard from "../kit/Dashboard.vue";
import {useWindow} from "./windowContext.js";

const props = defineProps({line: {type: String, required: true}});
const context = useWindow();
const answer = ref(null);

async function load() {
    answer.value = await context.read(props.line);
}

context.follow(["*.*"], load);
load();
</script>

<template>
    <p v-if="answer && !answer.ok" class="window-failure">{{ answer.error }}</p>
    <Dashboard v-else-if="answer" :document="answer.value" />
</template>
