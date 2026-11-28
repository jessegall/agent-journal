<script setup lang="ts">
defineProps<{ titles: string[] }>();
</script>

<template><p>{{ titles.join(', ') }}</p></template>
