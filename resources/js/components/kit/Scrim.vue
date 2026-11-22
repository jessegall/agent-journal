<script setup lang="ts">
/** The backdrop under a modal dialog. A click on it asks the dialog to close. */
defineEmits<{ close: [] }>();
</script>

<template>
    <div aria-hidden="true" class="absolute inset-0 z-(--z-scrim) bg-scrim" @click="$emit('close')" />
</template>
