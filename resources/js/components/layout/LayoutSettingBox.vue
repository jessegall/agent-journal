<script setup lang="ts">
import { computed } from 'vue';
import SettingRow from '@/components/kit/SettingRow.vue';
import LayoutPart from '@/components/layout/LayoutPart.vue';
import type { LayoutPartData } from '@/generated/types/core';

// One setting of a declared layout in the kit's SettingRow: its title and hint are its first parts, its control the
// rest, below the title in a block row and stacked below it on a phone, with long values breaking within their block.
const props = defineProps<{ part: LayoutPartData }>();
const isBlock = computed(() => props.part.style === 'setting-block');
const rowSlots = new Set(['title', 'hint']);
const rowControl = computed(() => props.part.children.filter((child) => !rowSlots.has(child.key)));

function partNamed(key: string): LayoutPartData | undefined {
    return props.part.children.find((child) => child.key === key);
}
</script>

<template>
    <SettingRow
        :block="isBlock"
        :title="partNamed('title')?.text ?? ''"
        :hint="partNamed('hint')?.text ?? undefined"
        :class="isBlock ? undefined : 'max-[760px]:flex-col max-[760px]:items-stretch'"
    >
        <span
            class="flex flex-wrap items-center gap-2 [overflow-wrap:anywhere]"
            :class="
                isBlock ? undefined : 'justify-end max-[760px]:justify-start [&_[data-field-label]]:sr-only'
            "
        >
            <template v-for="child in rowControl" :key="child.key">
                <LayoutPart :part="child" />
            </template>
        </span>
    </SettingRow>
</template>
