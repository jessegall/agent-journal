<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import ListReaderLayout from '@/components/kit/ListReaderLayout.vue';
import PageHeader from '@/components/kit/PageHeader.vue';
import Reader from '@/components/kit/Reader.vue';
import { index } from '@/routes/plans';
import type { PlansPage } from '@/types/generated';

const props = defineProps<{ page: PlansPage }>();

const plans = computed(() => props.page.plans);
const reader = computed(() => plans.value.selected);

function hrefFor(planId: string): string {
    return index.url({
        query: {
            q: plans.value.filters.q || undefined,
            page: plans.value.filters.page,
            plan: planId,
        },
    });
}
</script>

<template>
    <Head title="Plans" />
    <ListReaderLayout>
        <template #top>
            <PageHeader title="Plans" :count="plans.pagination.total" />
        </template>
        <template #list>
            <template v-for="row in plans.rows" :key="row.id">
                <Link
                    :href="hrefFor(row.id)"
                    preserve-scroll
                    class="flex flex-col gap-1 border-b border-border-inner px-4 py-2.5 text-text hover:bg-raised"
                >
                    <span class="truncate text-body font-medium">{{
                        row.title
                    }}</span>
                    <span class="text-small text-text-3"
                        >{{ row.doneTasks }} of {{ row.totalTasks }} tasks
                        done</span
                    >
                </Link>
            </template>
        </template>
        <template #reader>
            <template v-if="reader">
                <Reader :title="reader.card.title" />
            </template>
        </template>
    </ListReaderLayout>
</template>
