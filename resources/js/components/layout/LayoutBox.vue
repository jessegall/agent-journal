<script setup lang="ts">
import { computed } from 'vue';
import LayoutPart from '@/components/layout/LayoutPart.vue';
import ListReaderLayout from '@/components/kit/ListReaderLayout.vue';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import type { LayoutPartData } from '@/generated/types/core';

// A box of a declared layout: a divider, a row, a stack of its children, a page header bar, or a split of its first
// child as a list beside the rest as its reader. The bar keeps the title, count and views together on the left, the
// search and creation at the other edge; on a phone the title and creation share the first line, and the views and
// search wrap below.
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
    <SwitchCase :value="part.style">
        <template #divider>
            <hr class="border-line" />
        </template>
        <template #row>
            <div
                data-layout-box="row"
                class="flex flex-row flex-wrap items-center gap-3"
            >
                <template v-for="child in part.children" :key="child.key">
                    <LayoutPart :part="child" />
                </template>
            </div>
        </template>
        <template #bar>
            <div
                data-layout-box="bar"
                class="@container flex flex-wrap items-center gap-x-3 gap-y-2"
            >
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
        <template #split>
            <ListReaderLayout
                :list-width="part.split?.listWidth"
                :narrow-shows="part.split?.narrowShows"
                :back="part.split?.back"
                :reader-width="part.split?.readerWidth"
            >
                <template #list>
                    <template
                        v-for="child in part.children.slice(0, 1)"
                        :key="child.key"
                    >
                        <LayoutPart :part="child" />
                    </template>
                </template>
                <template #reader>
                    <template
                        v-for="child in part.children.slice(1)"
                        :key="child.key"
                    >
                        <LayoutPart :part="child" />
                    </template>
                </template>
            </ListReaderLayout>
        </template>
        <template #default>
            <div :data-layout-box="part.style" class="flex flex-col gap-3">
                <template v-for="child in part.children" :key="child.key">
                    <LayoutPart :part="child" />
                </template>
            </div>
        </template>
    </SwitchCase>
</template>
