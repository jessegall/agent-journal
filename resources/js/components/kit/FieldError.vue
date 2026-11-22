<script setup lang="ts">
/** The error under a field: --text-small in --danger, 5 px below the input, read through aria-describedby. */
defineProps<{ id?: string }>();
</script>

<template>
    <p :id="id" class="mt-1.25 text-small text-danger"><slot /></p>
</template>
