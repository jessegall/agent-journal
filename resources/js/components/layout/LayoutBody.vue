<script setup lang="ts">
import type { LayoutPartData } from '@/generated/types/core';

// A trusted rich body of a declared layout: HTML the journal's safe Markdown renderer made on the server, the one
// part a layout shows as markup.
defineProps<{ part: LayoutPartData }>();
</script>

<template>
    <div class="prose" v-html="part.body?.html" />
</template>
