<script setup lang="ts">
import LayoutPart from '@/components/layout/LayoutPart.vue';
import ListReaderLayout from '@/components/kit/ListReaderLayout.vue';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import type { LayoutPartData } from '@/generated/types/core';

// A box of a declared layout: a divider, a row, a stack of its children, or a split of its first child as a list
// beside the rest as its reader.
defineProps<{ part: LayoutPartData }>();
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
        <template #split>
            <ListReaderLayout>
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
