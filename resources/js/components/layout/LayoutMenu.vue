<script setup lang="ts">
import RecordMenu from '@/components/kit/RecordMenu.vue';
import type { LayoutPartData } from '@/generated/types/core';

// A record's actions menu in a declared layout, such as a publication's header: the kit's menu with its actions
// button, bound to the record the server built it for.
defineProps<{ part: LayoutPartData }>();
</script>

<template>
    <template v-if="part.menu !== undefined">
        <RecordMenu :menu="part.menu" />
    </template>
</template>
