<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';
import Button from '@kit/Button';
import ListReaderLayout from '@kit/ListReaderLayout';
import PageHeader from '@kit/PageHeader';
import type { PlanFiltersData, PlanListData } from '@generated/types/plans';
import PlanCard from './PlanCard.vue';
import PlanReader from './PlanReader.vue';

/**
 * The plans slice: a search, the card grid, paging and the reader. It takes the slice alone, so Home can reuse it; the
 * page that shows it says where a link to other filters goes, the plans page by default.
 */
const props = defineProps<{
    plans: PlanListData;
    urlForFilters: (filters: PlanFiltersData) => string;
}>();

const search = ref(props.plans.filters.q);
watch(
    () => props.plans.filters.q,
    (q) => (search.value = q),
);

const filters = computed(() => props.plans.filters);
const pagination = computed(() => props.plans.pagination);
const pageText = computed(
    () => `Page ${pagination.value.page} of ${pagination.value.lastPage}`,
);

function urlFor(changes: Partial<PlanFiltersData>): string {
    return props.urlForFilters({ ...filters.value, ...changes });
}

function submitSearch(): void {
    router.get(
        urlFor({ q: search.value, page: 1, plan: undefined }),
        {},
        { preserveScroll: true },
    );
}
</script>

<template>
    <ListReaderLayout>
        <template #top>
            <PageHeader title="Plans" :count="pagination.total" />
            <form
                role="search"
                class="flex items-center gap-2 border-b border-border px-3 py-2"
                @submit.prevent="submitSearch"
            >
                <input
                    v-model="search"
                    type="search"
                    name="q"
                    maxlength="200"
                    placeholder="Search plans"
                    aria-label="Search plans"
                    class="h-[30px] w-56 rounded-control border border-border-2 bg-bg-2 px-2.5 text-body text-text outline-none focus:border-brand"
                />
                <span class="ml-auto text-badge text-text-3 tabular-nums">{{
                    pageText
                }}</span>
            </form>
        </template>
        <template #list>
            <div class="@container p-3">
                <template v-if="plans.rows.length === 0 && (filters.q || filters.state)">
                    <p class="p-3 text-empty text-text-3">
                        No plans match these filters.
                    </p>
                </template>
                <template v-else-if="plans.rows.length === 0">
                    <p class="p-3 text-empty text-text-3">No plans yet</p>
                </template>
                <div
                    class="grid grid-cols-1 gap-2.5 @[600px]:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]"
                >
                    <template v-for="card in plans.rows" :key="card.id">
                        <PlanCard
                            :card="card"
                            :href="urlFor({ plan: card.number })"
                            :selected="filters.plan === card.number"
                        />
                    </template>
                </div>
                <nav class="mt-3 flex items-center" aria-label="Pages">
                    <template v-if="pagination.page > 1">
                        <Button
                            size="small"
                            variant="bordered"
                            :href="urlFor({ page: pagination.page - 1 })"
                            >Previous</Button
                        >
                    </template>
                    <template v-if="pagination.page < pagination.lastPage">
                        <Button
                            size="small"
                            variant="bordered"
                            class="ml-auto"
                            :href="urlFor({ page: pagination.page + 1 })"
                            >Next</Button
                        >
                    </template>
                </nav>
            </div>
        </template>
        <template #reader>
            <PlanReader
                :reader="plans.selected"
                :selection-missing="plans.selectionMissing"
            />
        </template>
    </ListReaderLayout>
</template>
