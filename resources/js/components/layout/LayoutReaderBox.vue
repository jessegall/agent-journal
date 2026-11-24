<script setup lang="ts">
import { computed } from 'vue';
import Reader from '@/components/kit/Reader.vue';
import LayoutPart from '@/components/layout/LayoutPart.vue';
import type { LayoutPartData } from '@/generated/types/core';

// A reader box of a declared layout: its title, metadata line, abstract and actions in the kit Reader, and the rest of
// its parts as the body.
const props = defineProps<{ part: LayoutPartData }>();
const readerSlots = new Set(['title', 'metadata', 'abstract', 'actions']);
const readerBody = computed(() => props.part.children.filter((child) => !readerSlots.has(child.key)));

function partNamed(key: string): LayoutPartData | undefined {
    return props.part.children.find((child) => child.key === key);
}
</script>

<template>
    <Reader :title="partNamed('title')?.text ?? ''" :abstract="partNamed('abstract')?.text ?? undefined">
        <template v-if="partNamed('metadata') !== undefined" #meta>
            <template v-for="child in partNamed('metadata')?.children ?? []" :key="child.key">
                <LayoutPart :part="child" />
            </template>
        </template>
        <template #actions>
            <template v-for="child in partNamed('actions')?.children ?? []" :key="child.key">
                <LayoutPart :part="child" />
            </template>
        </template>
        <div class="flex flex-col gap-3 pt-3">
            <template v-for="child in readerBody" :key="child.key">
                <LayoutPart :part="child" />
            </template>
        </div>
    </Reader>
</template>
