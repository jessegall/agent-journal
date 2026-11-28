<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import type { LayoutRowData } from '@/generated/types/core';

defineProps<{
    items: LayoutRowData[];
    fullUrl: string;
    fullLabel: string;
    heading?: string;
}>();
</script>

<template>
    <div class="min-w-0 p-3 text-sm">
        <template v-if="heading">
            <p class="mb-2 break-words font-medium">{{ heading }}</p>
        </template>
        <ul class="divide-y divide-border">
            <template v-for="item in items" :key="item.key">
                <li class="min-w-0 py-2">
                    <template v-if="item.href">
                        <Link :href="item.href" class="block break-words font-medium hover:underline">
                            {{ item.label }}
                        </Link>
                    </template>
                    <template v-else>
                        <p class="break-words">{{ item.label }}</p>
                    </template>
                    <template v-if="item.detail || item.value">
                        <p class="break-words text-xs text-muted-foreground">
                            {{ [item.detail, item.value].filter(Boolean).join(' · ') }}
                        </p>
                    </template>
                </li>
            </template>
        </ul>
        <Link :href="fullUrl" class="mt-2 inline-flex break-words text-xs font-medium underline">
            {{ fullLabel }}
        </Link>
    </div>
</template>
