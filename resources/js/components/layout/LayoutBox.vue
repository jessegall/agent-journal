<script setup lang="ts">
import LayoutPart from '@/components/layout/LayoutPart.vue';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import type { LayoutPartData } from '@/generated/types/core';

// A box of a declared layout: a divider, a row or a stack of its children.
defineProps<{ part: LayoutPartData }>();
</script>

<template>
    <SwitchCase :value="part.variant">
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
        <template #default>
            <div :data-layout-box="part.variant" class="flex flex-col gap-3">
                <template v-for="child in part.children" :key="child.key">
                    <LayoutPart :part="child" />
                </template>
            </div>
        </template>
    </SwitchCase>
</template>
