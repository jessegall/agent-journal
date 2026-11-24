<script setup lang="ts">
import { computed } from 'vue';
import LayoutPart from '@/components/layout/LayoutPart.vue';
import type { LayoutPartData } from '@/generated/types/core';

// A page head as the design draws it: the title, its count and its views at the left, the search and the creation at
// the right edge, in one row of 52 px that does not wrap from a tablet up.
const props = defineProps<{ part: LayoutPartData }>();
const HEAD_LEAD_KEYS = ['title', 'count', 'views'];
const headLead = computed(() => props.part.children.filter((child) => HEAD_LEAD_KEYS.includes(child.key)));
const headTools = computed(() => props.part.children.filter((child) => !HEAD_LEAD_KEYS.includes(child.key)));
</script>

<template>
    <header
        data-layout-box="page-head"
        class="flex min-h-13 flex-none flex-wrap items-center gap-2.5 border-b border-line px-4 py-2 md:h-13 md:flex-nowrap md:py-0"
    >
        <template v-for="child in headLead" :key="child.key">
            <LayoutPart :part="child" />
        </template>
        <div class="ml-auto flex flex-wrap items-center gap-1.5 md:flex-nowrap">
            <template v-for="child in headTools" :key="child.key">
                <LayoutPart :part="child" />
            </template>
        </div>
    </header>
</template>
