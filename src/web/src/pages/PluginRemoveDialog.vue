<script setup>
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";

defineProps({title: {type: String, required: true}});
const emit = defineEmits(["close", "remove"]);
</script>

<template>
    <Dialog :title="`Remove ${title}`" fits @close="emit('close')">
        <p class="remove-lead">
            Its services stop, its hooks and refusals no longer run, and its folder is taken away. What it kept of its own — settings,
            caches, anything it wrote in its data folder — can stay, in case you install it again, or go with it.
        </p>
        <template #foot>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn @click="emit('remove', false)">Remove, keep what it kept</Btn>
            <Btn kind="danger" @click="emit('remove', true)">Remove everything</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.remove-lead {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
