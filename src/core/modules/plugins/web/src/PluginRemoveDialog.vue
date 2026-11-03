<script setup>
import {Btn, Dialog} from "@journal/window-kit";

// removing a plugin, with or without what it kept, as version 4 asked
defineProps({title: {type: String, required: true}});
const emit = defineEmits(["close", "remove"]);
</script>

<template>
    <Dialog :title="`Remove ${title}`" fits @close="emit('close')">
        <p class="remove-lead">
            Its services stop, its hooks and blocks no longer run, and its folder is taken away. What it kept of its own (settings,
            caches, anything it wrote in its data folder) can stay, in case you install it again, or go with it.
        </p>
        <template #foot>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn data-plugin-remove-keep @click="emit('remove', false)">Remove, keep what it kept</Btn>
            <Btn kind="danger" data-plugin-remove-purge @click="emit('remove', true)">Remove everything</Btn>
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
