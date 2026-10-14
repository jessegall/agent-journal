<script setup>
import Btn from "../kit/Btn.vue";
import PhoneReaderChips from "./PhoneReaderChips.vue";

defineProps({title: {type: String, required: true}, approving: {type: Boolean, default: false}});
const confirming = defineModel("confirming", {type: Boolean, default: false});
const emit = defineEmits(["approve", "reply"]);
const CHANGES = ["Make it smaller: ", "Change the order of the phases: ", "Add more detail to ", "Something is missing: "].map((start) => ({
    key: start,
    label: start.replace(/[: ]+$/, ""),
}));
</script>

<template>
    <template v-if="confirming">
        <p class="reader-told">Approve "{{ title }}"? The agent starts working on it.</p>
        <Btn kind="primary" large :busy="approving" @click="emit('approve')">Yes, approve the plan</Btn>
        <Btn kind="plain" large @click="confirming = false">Not yet</Btn>
    </template>
    <template v-else>
        <Btn kind="primary" large @click="confirming = true">Approve the plan</Btn>
        <Btn large @click="emit('reply')">Ask for changes</Btn>
        <PhoneReaderChips :options="CHANGES" @pick="(start) => emit('reply', start)" />
    </template>
</template>

<style scoped>
.reader-told {
    margin: 0;
    color: var(--text-2);
}
</style>
