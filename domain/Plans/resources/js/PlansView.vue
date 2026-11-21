<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';
import Button from '@kit/Button';
import EmptyState from '@kit/EmptyState';
import { useHostProp } from '@kit/hostProp';
import ListReaderLayout from '@kit/ListReaderLayout';
import PageHeader from '@kit/PageHeader';
import type { PlanFiltersData, PlanListData } from '@generated/types/plans';
import { rememberOpenedPlan, takeOpenedPlan } from './openedPlans';
import PlanCard from './PlanCard.vue';
import PlanReader from './PlanReader.vue';

/**
 * The plans slice: a search, the card grid, paging and the reader. It takes the slice alone, so Home can reuse it; the
 * page that shows it says where a link to other filters goes, the plans page by default. A read that gets no answer
 * keeps the rows it had, says so and offers Retry of that same read; closing the reader gives the focus back to the
 * row that opened it, on the page it was on.
 */
const props = defineProps<{
    plans: PlanListData;
    urlForFilters: (filters: PlanFiltersData) => string;
}>();

const windowProp = useHostProp();
const list = useTemplateRef<HTMLElement>('list');
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
const isFiltered = computed(
    () => filters.value.q !== '' || filters.value.state !== undefined,
);
const emptyTitle = computed(() =>
    filters.value.q === ''
        ? 'No plans match this filter'
        : `No plans match "${filters.value.q}"`,
);
const isReaderOpen = computed(
    () => props.plans.selected !== undefined || props.plans.selectionMissing,
);
const failedUrl = ref('');

function urlFor(changes: Partial<PlanFiltersData>): string {
    return props.urlForFilters({ ...filters.value, ...changes });
}

function markFailed(url: string): boolean {
    failedUrl.value = url;

    return false;
}

function read(url: string): void {
    router.get(
        url,
        {},
        {
            preserveScroll: true,
            onSuccess: () => {
                failedUrl.value = '';
            },
            onNetworkError: () => markFailed(url),
            onHttpException: () => markFailed(url),
        },
    );
}

function submitSearch(): void {
    read(urlFor({ q: search.value, page: 1, plan: undefined }));
}

function clearFilters(): void {
    read(urlFor({ q: '', state: undefined, page: 1, plan: undefined }));
}

async function followSelection(plan: string | undefined): Promise<void> {
    if (plan !== undefined) {
        rememberOpenedPlan(windowProp, plan);

        return;
    }

    const opened = takeOpenedPlan(windowProp);

    if (opened === undefined) {
        return;
    }

    await nextTick();
    list.value
        ?.querySelector<HTMLElement>(`[data-plan-number="${opened}"] a`)
        ?.focus();
}

onMounted(() => followSelection(filters.value.plan));
watch(() => filters.value.plan, followSelection);
</script>

<template>
    <ListReaderLayout
        :narrow-shows="isReaderOpen ? 'reader' : 'list'"
        :back="{ href: urlFor({ plan: undefined }), label: 'Back to plans' }"
    >
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
            <template v-if="failedUrl !== ''">
                <div
                    role="alert"
                    class="flex items-center gap-3 border-b border-border px-3 py-2 text-small text-text-2"
                >
                    <span class="flex-1"
                        >Showing earlier results. The plans could not be
                        read.</span
                    >
                    <Button
                        variant="bordered"
                        size="small"
                        @click="read(failedUrl)"
                        >Retry</Button
                    >
                </div>
            </template>
        </template>
        <template #list>
            <div ref="list" class="@container p-3">
                <template v-if="plans.rows.length === 0">
                    <template v-if="isFiltered">
                        <EmptyState
                            icon="search"
                            :title="emptyTitle"
                            text="Clear the filters to see every plan."
                        >
                            <Button
                                variant="bordered"
                                size="small"
                                @click="clearFilters"
                                >Clear</Button
                            >
                        </EmptyState>
                    </template>
                    <template v-else>
                        <EmptyState
                            icon="plan"
                            title="No plans yet"
                            text="A plan shows here once someone writes one."
                        />
                    </template>
                </template>
                <div
                    class="grid grid-cols-1 gap-2.5 @[600px]:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]"
                >
                    <template v-for="card in plans.rows" :key="card.id">
                        <PlanCard
                            :card="card"
                            :href="urlFor({ plan: card.number })"
                            :selected="filters.plan === card.number"
                            :data-plan-number="card.number"
                        />
                    </template>
                </div>
                <nav class="mt-3 flex items-center" aria-label="Pages">
                    <template v-if="pagination.page > 1">
                        <Button
                            size="small"
                            variant="bordered"
                            @click="read(urlFor({ page: pagination.page - 1 }))"
                            >Previous</Button
                        >
                    </template>
                    <template v-if="pagination.page < pagination.lastPage">
                        <Button
                            size="small"
                            variant="bordered"
                            class="ml-auto"
                            @click="read(urlFor({ page: pagination.page + 1 }))"
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
