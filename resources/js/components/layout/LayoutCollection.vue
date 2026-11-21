<script setup lang="ts">
import SwitchCase from '@/components/kit/SwitchCase.vue';
import type { LayoutPartData } from '@/generated/types/core';

// The keyed rows of a declared layout: facts as term and value pairs, or a list.
defineProps<{ part: LayoutPartData }>();
</script>

<template>
    <SwitchCase :value="part.variant">
        <template #facts>
            <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                <template v-for="row in part.rows" :key="row.key">
                    <dt class="text-text-3">{{ row.label }}</dt>
                    <dd class="text-text">{{ row.value }}</dd>
                </template>
            </dl>
        </template>
        <template #default>
            <ul class="flex flex-col divide-y divide-line">
                <template v-for="row in part.rows" :key="row.key">
                    <li class="flex justify-between gap-3 py-2">
                        <span class="text-text">{{ row.label }}</span>
                        <span class="text-text-2">{{ row.value }}</span>
                    </li>
                </template>
            </ul>
        </template>
    </SwitchCase>
</template>
