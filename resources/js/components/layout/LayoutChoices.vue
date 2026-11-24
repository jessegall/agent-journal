<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { useWindowQueryChange } from '@/framework/useWindowQuery';
import type { LayoutRowData } from '@/generated/types/core';

// The choices of a declared layout: each sets the window's query or opens its own page, the chosen one marked current.
defineProps<{ rows: LayoutRowData[] }>();
const windowQuery = useWindowQueryChange();
</script>

<template>
    <ul
        class="flex flex-wrap gap-4 border-b border-line px-3 in-data-[layout-box=page-head]:border-0 in-data-[layout-box=page-head]:px-0"
    >
        <template v-for="row in rows" :key="row.key">
            <li class="flex">
                <Link
                    :href="row.href ?? windowQuery(row.query)"
                    preserve-scroll
                    :aria-current="row.isCurrent ? 'true' : undefined"
                    class="block py-[7px] text-badge tracking-[.03em] focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-focus"
                    :class="{
                        'text-text shadow-[inset_0_-1px_0_var(--color-brand)]': row.isCurrent,
                        'text-text-3 hover:text-text-2': !row.isCurrent,
                    }"
                    >{{ row.label }}</Link
                >
            </li>
        </template>
    </ul>
</template>
