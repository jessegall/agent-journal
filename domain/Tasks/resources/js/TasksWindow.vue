<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
import Button from '@kit/Button';
import EmptyState from '@kit/EmptyState';
import ListReaderLayout from '@kit/ListReaderLayout';
import PageHeader from '@kit/PageHeader';
import StaleListNotice from '@kit/StaleListNotice';
import { useFilteredReads } from '@kit/useFilteredReads';
import { useFocusRecovery } from '@kit/useFocusRecovery';
import { useWindowQuery } from '@kit/useWindowQuery';
import type {
    TaskFiltersData,
    TaskHolderFilter,
    TaskListData,
    TaskState,
} from '@generated/types/tasks';
import TaskRow from './TaskRow.vue';
import { taskStateLook } from './taskLooks';

/**
 * The tasks window, on Home and on its own page: a search, a state filter and a holder filter with Unassigned, the
 * count, the rows and paging. Its links change only its own part of the query; a read that gets no answer keeps the
 * rows, says so and offers Retry of that same read. When a refresh drops the chosen task from the filter, it says so
 * once and moves the focus to the next row left, else to the list. It needs nothing from Plans.
 */
const props = defineProps<{ data: TaskListData }>();

const windowUrl = useWindowQuery();
const list = useTemplateRef<HTMLElement>('list');
const { announcement, afterRemoval } = useFocusRecovery(list, 'a[aria-label^="Task "]');
const { read, retry, isStale } = useFilteredReads();

const filters = computed(() => props.data.filters);
const pagination = computed(() => props.data.pagination);
const search = ref(props.data.filters.q);
watch(
    () => props.data.filters.q,
    (q) => (search.value = q),
);

const stateOptions = Object.entries(taskStateLook) as [
    TaskState,
    { label: string },
][];
const holderOptions: { value: TaskHolderFilter; label: string }[] = [
    { value: 'any', label: 'Anyone or no one' },
    { value: 'unassigned', label: 'Unassigned' },
    { value: 'mine', label: 'Held by me' },
];
const isFiltered = computed(
    () =>
        filters.value.q !== '' ||
        filters.value.state !== undefined ||
        filters.value.holder !== 'any',
);
const emptyTitle = computed(() =>
    filters.value.q === ''
        ? 'No tasks match these filters'
        : `No tasks match "${filters.value.q}"`,
);
const pageText = computed(
    () => `Page ${pagination.value.page} of ${pagination.value.lastPage}`,
);

watch(
    () => props.data.rows,
    async (rows, previous) => {
        const chosen = props.data.filters.task;
        const oldIndex = previous.findIndex((row) => row.number === chosen);

        if (
            chosen === undefined ||
            oldIndex === -1 ||
            rows.some((row) => row.number === chosen)
        ) {
            return;
        }

        await afterRemoval(oldIndex, `Task ${chosen} no longer matches this filter`);
    },
);

function urlFor(changes: Partial<TaskFiltersData>): string {
    const next = { ...filters.value, ...changes };

    return windowUrl({
        q: next.q,
        page: next.page > 1 ? next.page : undefined,
        state: next.state,
        holder: next.holder === 'any' ? undefined : next.holder,
        task: next.task,
    });
}

function readFilter(changes: Partial<TaskFiltersData>): void {
    read(urlFor({ ...changes, page: 1, task: undefined }));
}

function chooseState(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    readFilter({ state: value === '' ? undefined : (value as TaskState) });
}

function chooseHolder(event: Event): void {
    readFilter({
        holder: (event.target as HTMLSelectElement).value as TaskHolderFilter,
    });
}

function clearFilters(): void {
    read(
        urlFor({
            q: '',
            state: undefined,
            holder: 'any',
            page: 1,
            task: undefined,
        }),
    );
}
</script>

<template>
    <ListReaderLayout narrow-shows="list">
        <template #top>
            <PageHeader title="Tasks" :count="pagination.total" />
            <form
                role="search"
                class="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2"
                @submit.prevent="readFilter({ q: search })"
            >
                <input
                    v-model="search"
                    type="search"
                    name="q"
                    maxlength="200"
                    placeholder="Search tasks"
                    aria-label="Search tasks"
                    class="h-[30px] w-56 rounded-control border border-border-2 bg-bg-2 px-2.5 text-body text-text outline-none focus:border-brand"
                />
                <select
                    aria-label="State"
                    class="h-[30px] rounded-control border border-border-2 bg-bg-2 px-2 text-body text-text"
                    :value="filters.state ?? ''"
                    @change="chooseState"
                >
                    <option value="">Every state</option>
                    <template v-for="[value, look] in stateOptions" :key="value">
                        <option :value="value">{{ look.label }}</option>
                    </template>
                </select>
                <select
                    aria-label="Held by"
                    class="h-[30px] rounded-control border border-border-2 bg-bg-2 px-2 text-body text-text"
                    :value="filters.holder"
                    @change="chooseHolder"
                >
                    <template v-for="option in holderOptions" :key="option.value">
                        <option :value="option.value">{{ option.label }}</option>
                    </template>
                </select>
                <span class="ml-auto text-badge text-text-3 tabular-nums">{{
                    pageText
                }}</span>
            </form>
            <template v-if="isStale">
                <StaleListNotice
                    reason="The tasks could not be read."
                    @retry="retry"
                />
            </template>
        </template>
        <template #list>
            <p role="status" class="sr-only">{{ announcement }}</p>
            <div
                ref="list"
                tabindex="-1"
                aria-label="Tasks"
                class="flex flex-col gap-2 p-3 outline-none"
            >
                <template v-if="data.rows.length === 0">
                    <template v-if="isFiltered">
                        <EmptyState
                            icon="search"
                            :title="emptyTitle"
                            text="Clear the filters to see every task."
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
                            icon="todos"
                            title="No tasks yet"
                            text="A task shows here once someone writes one."
                        />
                    </template>
                </template>
                <template v-for="task in data.rows" :key="task.id">
                    <TaskRow
                        :task="task"
                        :href="urlFor({ task: task.number })"
                        :selected="filters.task === task.number"
                    />
                </template>
                <nav class="mt-1 flex items-center" aria-label="Pages">
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
            <p class="p-6 text-empty text-text-3">Choose a task to read it.</p>
        </template>
    </ListReaderLayout>
</template>
