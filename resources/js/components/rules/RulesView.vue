<script setup lang="ts">
import { Link, router } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';
import Button from '@/components/kit/Button.vue';
import ListReaderLayout from '@/components/kit/ListReaderLayout.vue';
import PageHeader from '@/components/kit/PageHeader.vue';
import type { RuleFiltersData, RuleListData } from '@/types/generated';
import RuleReader from './RuleReader.vue';
import { ruleStateLook, rulesPageUrl } from './ruleLooks';

/**
 * The rules list beside the reader of the selected rule; the search, page and selection live in the query.
 */
const props = defineProps<{ rules: RuleListData }>();

const search = ref(props.rules.filters.q);
watch(
    () => props.rules.filters.q,
    (q) => (search.value = q),
);

const filters = computed(() => props.rules.filters);
const pagination = computed(() => props.rules.pagination);
const pageText = computed(
    () => `Page ${pagination.value.page} of ${pagination.value.lastPage}`,
);

function urlFor(changes: Partial<RuleFiltersData>): string {
    return rulesPageUrl({ ...filters.value, ...changes });
}

function submitSearch(): void {
    router.get(
        urlFor({ q: search.value, page: 1, rule: undefined }),
        {},
        { preserveScroll: true },
    );
}
</script>

<template>
    <ListReaderLayout>
        <template #top>
            <PageHeader title="Rules" :count="pagination.total" />
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
                    placeholder="Search rules"
                    aria-label="Search rules"
                    class="h-[30px] w-56 rounded-control border border-border-2 bg-bg-2 px-2.5 text-body text-text outline-none focus:border-brand"
                />
                <span class="ml-auto text-badge text-text-3 tabular-nums">{{
                    pageText
                }}</span>
            </form>
        </template>
        <template #list>
            <template v-if="rules.rows.length === 0">
                <p class="p-6 text-empty text-text-3">
                    No rules match these filters.
                </p>
            </template>
            <ul class="flex flex-col">
                <template v-for="row in rules.rows" :key="row.id">
                    <li>
                        <Link
                            :href="urlFor({ rule: row.id })"
                            preserve-scroll
                            class="flex flex-col gap-1 border-b border-border px-3 py-2.5 text-text hover:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                            :class="{ 'bg-sel': filters.rule === row.id }"
                            :aria-current="
                                filters.rule === row.id ? 'true' : undefined
                            "
                        >
                            <span
                                class="flex items-center gap-2 text-small text-text-3"
                            >
                                <span class="font-mono tabular-nums">{{
                                    row.id
                                }}</span>
                                <span
                                    class="ml-auto"
                                    :class="ruleStateLook[row.state].tone"
                                    >{{ ruleStateLook[row.state].label }}</span
                                >
                            </span>
                            <span class="line-clamp-2 text-body">{{
                                row.text
                            }}</span>
                        </Link>
                    </li>
                </template>
            </ul>
            <nav class="flex items-center p-3" aria-label="Pages">
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
        </template>
        <template #reader>
            <RuleReader
                :reader="rules.selected"
                :selection-missing="rules.selectionMissing"
                :filters="filters"
            />
        </template>
    </ListReaderLayout>
</template>
