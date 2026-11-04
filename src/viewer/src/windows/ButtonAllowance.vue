<script setup>
import {computed} from "vue";
import AllowancePrompt from "./AllowancePrompt.vue";

const props = defineProps({prompts: {type: Object, default: null}});
const request = computed(() => {
    const current = props.prompts?.current.value;
    return current?.window.startsWith("button:") ? current : null;
});
</script>

<template>
    <template v-if="request">
        <AllowancePrompt :request="request" @answer="prompts.answer($event)" />
    </template>
</template>
