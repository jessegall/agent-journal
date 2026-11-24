<script setup lang="ts">
import { computed } from 'vue';
import LayoutPart from '@/components/layout/LayoutPart.vue';
import type { LayoutPartData } from '@/generated/types/core';

// A bar of a declared layout: the title, count and views together on the left, the search and creation at the other
// edge; on a phone the title and creation share the first line, and the views and search wrap below.
const props = defineProps<{ part: LayoutPartData }>();
const slotClasses: Record<string, string> = {
    creation: 'order-3 ml-auto @2xl:order-none @2xl:ml-0',
    views: 'order-4 w-full @2xl:order-none @2xl:w-auto',
    search: 'order-5 w-full @2xl:order-none @2xl:w-auto',
};
const firstTool = computed(
    () => props.part.children.find((child) => child.key === 'search' || child.key === 'creation')?.key,
);
</script>

<template>
    <div data-layout-box="bar" class="@container flex flex-wrap items-center gap-x-3 gap-y-2">
        <template v-for="child in part.children" :key="child.key">
            <template v-if="child.key === firstTool">
                <span class="hidden flex-1 @2xl:block"></span>
            </template>
            <div :class="slotClasses[child.key]">
                <LayoutPart :part="child" />
            </div>
        </template>
    </div>
</template>
