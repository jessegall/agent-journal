<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import { useWindowQueryChange } from '@/framework/useWindowQuery';
import type { LayoutPartData, LayoutRowData } from '@/generated/types/core';

// The keyed rows of a declared layout: facts as term and value pairs, choices that each set the window's query, the
// chosen one marked current, or a list whose rows open their own page or their own window query.
defineProps<{ part: LayoutPartData }>();
const windowQuery = useWindowQueryChange();

function destinationOf(row: LayoutRowData): string | null {
    if (row.href !== undefined) {
        return row.href;
    }

    return Object.keys(row.query).length > 0 ? windowQuery(row.query) : null;
}
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
        <template #choices>
            <ul class="flex flex-wrap gap-1">
                <template v-for="row in part.rows" :key="row.key">
                    <li>
                        <Link
                            :href="windowQuery(row.query)"
                            preserve-scroll
                            :aria-current="row.isCurrent ? 'true' : undefined"
                            class="block rounded-sm border border-line px-2 py-1 text-small hover:bg-hover focus-visible:outline-2 focus-visible:outline-brand"
                            :class="{
                                'bg-sel text-text': row.isCurrent,
                                'text-text-2': !row.isCurrent,
                            }"
                            >{{ row.label }}</Link
                        >
                    </li>
                </template>
            </ul>
        </template>
        <template #default>
            <ul class="flex flex-col divide-y divide-line">
                <template v-for="row in part.rows" :key="row.key">
                    <li>
                        <template v-if="destinationOf(row) !== null">
                            <Link
                                :href="destinationOf(row) ?? ''"
                                preserve-scroll
                                :aria-current="
                                    row.isCurrent ? 'true' : undefined
                                "
                                class="flex justify-between gap-3 px-3 py-2 hover:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                                :class="{ 'bg-sel': row.isCurrent }"
                            >
                                <span class="flex min-w-0 flex-col">
                                    <span class="line-clamp-2 text-text">{{
                                        row.label
                                    }}</span>
                                    <template v-if="row.detail !== undefined">
                                        <span
                                            class="line-clamp-2 text-small text-text-3"
                                            >{{ row.detail }}</span
                                        >
                                    </template>
                                </span>
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
