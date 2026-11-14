<script setup>
import {Btn, Dialog} from "@journal/window-kit";

// leaving the Settings page with changes that are not saved asks first: keep editing, or leave and lose them
defineProps({count: {type: Number, required: true}});
const emit = defineEmits(["stay", "leave"]);
</script>

<template>
    <Dialog padded title="Leave without saving?" fits small @close="emit('stay')">
        <p class="leave-words" data-leave-words>{{ count }} {{ count === 1 ? "change is" : "changes are" }} not saved. Leaving drops {{ count === 1 ? "it" : "them" }}.</p>
        <template #foot>
            <Btn data-leave-stay @click="emit('stay')">Keep editing</Btn>
            <Btn variant="danger" data-leave-go @click="emit('leave')">Leave without saving</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.leave-words {
    margin: 0;
    color: var(--text-2);
}
</style>
