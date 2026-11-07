<script setup>
import {Btn, Dialog} from "@journal/window-kit";

// removing a plugin, with or without what it kept, as version 4 asked
defineProps({title: {type: String, required: true}});
const emit = defineEmits(["close", "remove"]);
</script>

<template>
    <Dialog :title="`Remove ${title}`" fits @close="emit('close')">
        <p class="remove-lead">
            Removing this plugin stops its services and event handlers and deletes its folder. You can keep its settings
            and saved data for a future installation, or delete everything.
        </p>
        <template #foot>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn data-plugin-remove-keep @click="emit('remove', false)">Remove, keep data</Btn>
            <Btn variant="danger" data-plugin-remove-purge @click="emit('remove', true)">Remove everything</Btn>
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
