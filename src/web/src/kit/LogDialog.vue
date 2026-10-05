<script setup>
import Btn from "./Btn.vue";
import Console from "./Console.vue";
import Dialog from "./Dialog.vue";

defineProps({title: {type: String, required: true}, logged: {type: String, default: ""}, busy: {type: Boolean, default: false}});
const emit = defineEmits(["close", "clear"]);
</script>

<template>
    <Dialog :title="title" follow @close="emit('close')">
        <Console fill :text="logged || (busy ? 'Starting…' : 'Nothing is logged yet.')" />
        <template #foot>
            <Btn small :disabled="!logged" @click="emit('clear')">Clear</Btn>
        </template>
    </Dialog>
</template>
