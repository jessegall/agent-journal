<script setup>
import {Btn} from "@journal/window-kit";

// the three buttons of an open question: close it, ask the agent to elaborate, and answer with the words typed
defineProps({elaborated: Boolean});
defineEmits(["close", "elaborate", "answer"]);
</script>

<template>
    <Btn small data-question-close @click="$emit('close')">Close</Btn>
    <Btn small :disabled="elaborated" data-question-elaborate @click="$emit('elaborate')">{{ elaborated ? "Asked to elaborate" : "Elaborate" }}</Btn>
    <Btn variant="primary" small data-question-answer @click="$emit('answer')">Answer</Btn>
</template>
