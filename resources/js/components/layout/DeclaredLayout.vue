<script setup lang="ts">
import { computed } from 'vue';
import LayoutPart from '@/components/layout/LayoutPart.vue';
import type { DeclaredLayoutData } from '@/generated/types/core';
import { provideLayoutAppend } from './layoutAppend';

// The one renderer of every page a domain declares as a layout: it draws the checked tree its reader built.
// A page runs edge to edge and fills the height, its head fixed and its body scrolling, as the design draws every page;
// any other layout keeps its padded column.
const props = defineProps<{ data: DeclaredLayoutData }>();
const isPage = computed(() => props.data.root.style === 'page');
provideLayoutAppend();
</script>

<template>
    <div :class="isPage ? 'flex h-full min-h-0 flex-col' : 'flex flex-col gap-4 overflow-y-auto p-4'">
        <LayoutPart :part="data.root" />
    </div>
</template>
