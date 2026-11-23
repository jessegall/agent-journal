<script setup lang="ts">
import type { ProjectTreeEntryData, ProjectWindowData } from '@generated/types/connections';
import Button from '@kit/Button';
import EmptyState from '@kit/EmptyState';
import RowSkeleton from '@kit/RowSkeleton';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import ProjectTree from '@kit/ProjectTree';
import { useWindowReload } from '@kit/useWindowQuery';

/**
 * The connected project's files as a tree on Home. While the host has not answered, the window shows the tree's
 * skeleton and asks again every 700 ms, ten times at most, then offers Retry. Opening a folder asks the server for
 * this window alone with the open folders, so a reload reads them too; a file asks to be opened as a window.
 */
const props = defineProps<{ data: ProjectWindowData }>();
const emit = defineEmits<{ 'open-file': [path: string] }>();

const POLL_MILLISECONDS = 700;
const POLL_LIMIT = 10;

const reload = useWindowReload();
const openFolders = ref<string[]>(openedIn(props.data.entries));
const polls = ref(0);
let timer: ReturnType<typeof setTimeout> | undefined;

function openedIn(entries: ProjectTreeEntryData[]): string[] {
    return entries.flatMap((entry) => (entry.isOpen ? [entry.path, ...openedIn(entry.children)] : []));
}

function isLoadingIn(entries: ProjectTreeEntryData[]): boolean {
    return entries.some((entry) => entry.isLoading || isLoadingIn(entry.children));
}

const waits = computed(() => props.data.state === 'pending' || isLoadingIn(props.data.entries));
const gaveUp = computed(() => waits.value && polls.value >= POLL_LIMIT);
const treeState = computed(() => (props.data.state === 'failed' || gaveUp.value ? 'failed' : 'ready'));

function ask(): void {
    reload({ open: openFolders.value }, { onNetworkError: () => true, onHttpException: () => true });
}

function retry(): void {
    polls.value = 0;
    ask();
}

function changeOpen(paths: string[]): void {
    openFolders.value = paths;
    polls.value = 0;
    ask();
}

watch(
    () => props.data,
    () => {
        clearTimeout(timer);

        if (!waits.value || gaveUp.value) {
            return;
        }

        timer = setTimeout(() => {
            polls.value += 1;
            ask();
        }, POLL_MILLISECONDS);
    },
    { immediate: true },
);

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
    <section aria-label="Project" class="flex h-full flex-col overflow-auto">
        <template v-if="data.state === 'none'">
            <EmptyState icon="folder" title="No project is connected">
                <Button variant="bordered" size="small" :href="data.connectAddress">Connect a project</Button>
            </EmptyState>
        </template>
        <template v-else-if="data.state === 'offline'">
            <div role="alert" class="flex flex-col items-start gap-2 p-4 text-body text-text-2">
                <p>{{ data.machineLabel }} is not connected, so {{ data.projectLabel }} cannot be read.</p>
                <Button variant="bordered" size="small" @click="retry">Retry</Button>
            </div>
        </template>
        <template v-else-if="data.state === 'pending' && !gaveUp">
            <RowSkeleton label="Reading the project's files" :rows="6" />
        </template>
        <template v-else>
            <ProjectTree
                :entries="data.entries"
                :state="treeState"
                @update:open="changeOpen"
                @open="emit('open-file', $event)"
                @retry="retry"
            />
        </template>
    </section>
</template>
