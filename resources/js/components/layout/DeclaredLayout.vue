<script setup lang="ts">
import LayoutPart from '@/components/layout/LayoutPart.vue';
import type { DeclaredLayoutData } from '@/generated/types/core';
import { provideLayoutAppend } from './layoutAppend';

// The one renderer of every page a domain declares as a layout: it draws the checked tree its reader built.
defineProps<{ data: DeclaredLayoutData }>();
provideLayoutAppend();
</script>

<template>
    <div class="flex flex-col gap-4 overflow-y-auto p-4">
        <LayoutPart :part="data.root" />
    </div>
</template>
