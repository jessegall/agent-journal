<script setup>
import {computed} from "vue";
import AllowancePrompt from "./AllowancePrompt.vue";
import Dialog from "../kit/Dialog.vue";

const props = defineProps({prompts: {type: Object, default: null}});
const request = computed(() => {
    const current = props.prompts?.current.value;
    return current?.window.startsWith("button:") ? current : null;
});
</script>

<template>
    <template v-if="request">
        <Dialog padded title="Allow module buttons" fits small sheet @close="prompts.answer(false)">
            <AllowancePrompt role="group" :request="request" @answer="prompts.answer($event)" />
        </Dialog>
    </template>
</template>
