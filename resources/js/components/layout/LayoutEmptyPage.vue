<script setup lang="ts">
import { computed } from 'vue';
import Icon, { type IconName } from '@/components/kit/Icon.vue';
import LayoutPart from '@/components/layout/LayoutPart.vue';
import type { LayoutPartData } from '@/generated/types/core';

// A page that holds nothing yet: its subject's icon on a tile, the title, one sentence and the action that makes the
// first one, centred in all of the page under its header.
const props = defineProps<{ part: LayoutPartData }>();
const firstSlots = new Set(['icon', 'empty']);
const firstActions = computed(() => props.part.children.filter((child) => !firstSlots.has(child.key)));

function partNamed(key: string): LayoutPartData | undefined {
    return props.part.children.find((child) => child.key === key);
}
</script>

<template>
    <div
        data-layout-box="page-empty"
        role="region"
        :aria-label="partNamed('empty')?.text ?? ''"
        class="flex min-h-0 flex-1 items-center justify-center overflow-auto p-6"
    >
        <div class="flex max-w-[360px] flex-col items-center text-center text-empty text-text-3">
            <span
                class="mb-3.5 flex size-10 items-center justify-center rounded-card border border-line bg-bg-2 text-text-4"
            >
                <Icon :name="(partNamed('icon')?.text ?? 'info') as IconName" :size="20" />
            </span>
            <p class="mb-1 font-medium text-text-2">{{ partNamed('empty')?.text }}</p>
            <p>{{ partNamed('empty')?.detail }}</p>
            <template v-if="firstActions.length > 0">
                <div class="mt-4 flex items-center gap-2">
                    <template v-for="child in firstActions" :key="child.key">
                        <LayoutPart :part="child" />
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>
