<script setup lang="ts">
/** The hint under a field: --text-small in --text-3, read through the input's aria-describedby. */
defineProps<{ id?: string }>();
</script>

<template>
    <p :id="id" class="mt-1.25 text-small text-text-3"><slot /></p>
</template>
