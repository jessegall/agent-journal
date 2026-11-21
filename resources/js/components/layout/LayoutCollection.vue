<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import { useWindowQueryChange } from '@/framework/useWindowQuery';
import type { LayoutPartData } from '@/generated/types/core';

// The keyed rows of a declared layout: facts as term and value pairs, or a list whose rows may lead to their own
// window query, the chosen one marked current.
defineProps<{ part: LayoutPartData }>();
const windowQuery = useWindowQueryChange();
</script>

<template>
    <SwitchCase :value="part.style">
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
                    <li>
                        <template v-if="Object.keys(row.query).length > 0">
                            <Link
                                :href="windowQuery(row.query)"
                                preserve-scroll
                                :aria-current="
                                    row.isCurrent ? 'true' : undefined
                                "
                                class="flex justify-between gap-3 px-3 py-2 hover:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                                :class="{ 'bg-sel': row.isCurrent }"
                            >
                                <span class="line-clamp-2 text-text">{{
                                    row.label
                                }}</span>
                                <span class="shrink-0 text-text-2">{{
                                    row.value
                                }}</span>
                            </Link>
                        </template>
                        <template v-else>
                            <span class="flex justify-between gap-3 py-2">
                                <span class="text-text">{{ row.label }}</span>
                                <span class="text-text-2">{{ row.value }}</span>
                            </span>
                        </template>
                    </li>
                </template>
            </ul>
        </template>
    </SwitchCase>
</template>
