<script setup>
import Btn from "../kit/Btn.vue";
import Console from "../kit/Console.vue";
import Dialog from "../kit/Dialog.vue";

defineProps({name: {type: String, required: true}, logged: {type: String, default: ""}, busy: {type: Boolean, default: false}});
const emit = defineEmits(["close", "clear"]);
</script>

<template>
    <Dialog :title="`${name} log`" follow @close="emit('close')">
        <Console fill :text="logged || (busy ? 'Starting…' : 'Nothing is logged yet.')" />
        <template #foot>
            <Btn small :disabled="!logged" @click="emit('clear')">Clear</Btn>
        </template>
    </Dialog>
</template>
