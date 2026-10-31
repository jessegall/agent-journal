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
    <template v-if="answer && !answer.ok">
        <p class="window-failure">{{ answer.error }}</p>
    </template>
    <template v-else-if="answer">
        <Dashboard :document="answer.value" />
    </template>
</template>
