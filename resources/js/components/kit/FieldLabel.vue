<script setup lang="ts">
/** The label above a field: --text-badge in --text-3, 4 px above the input. It names the input by `for`. */
defineProps<{ for?: string }>();
</script>

<template>
    <label :for="$props.for" class="mb-1 block text-badge text-text-3"><slot /></label>
</template>
