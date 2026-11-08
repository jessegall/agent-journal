<script setup>
import Dialog from "./Dialog.vue";

defineProps({text: {type: String, required: true}});
const emit = defineEmits(["close"]);
</script>

<template>
    <Dialog padded title="Action completed" fits @close="emit('close')">
        <pre class="action-output" data-action-output>{{ text }}</pre>
    </Dialog>
</template>

<style scoped>
.action-output {
    margin: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
</style>
