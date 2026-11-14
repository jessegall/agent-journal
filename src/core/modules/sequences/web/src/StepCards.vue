<script setup>
import {TextList} from "@journal/window-kit";

// the steps of a sequence in order, each written in its own box
defineProps({steps: {type: Array, required: true}});
const emit = defineEmits(["steps"]);
</script>

<template>
    <TextList :items="steps" kind="step" noun="Step" placeholder="What the agent does in this step" add-label="Add a step" @items="emit('steps', $event)" />
</template>
