<script setup lang="ts">
import type { ProjectTreeEntryData, ProjectWindowData } from '@generated/types/connections';
import Button from '@kit/Button';
import EmptyState from '@kit/EmptyState';
import RowSkeleton from '@kit/RowSkeleton';
import { useFileOpener } from '@kit/fileOpener';
import ProjectTree from '@kit/ProjectTree';
import { useWindowReload } from '@kit/useWindowQuery';
import { computed, ref } from 'vue';
import { usePendingPoll } from './usePendingPoll';

/**
 * The connected project's files as a tree on Home. While the host has not answered, the window shows the tree's
 * skeleton and asks again every 700 ms, ten times at most, then offers Retry. Opening a folder asks the server for
 * this window alone with the open folders, so a reload reads them too; a file opens as a window of its own on the desk.
 */
const props = defineProps<{ data: ProjectWindowData }>();
const openFile = useFileOpener();

const reload = useWindowReload();
const openFolders = ref<string[]>(openedIn(props.data.entries));

function openedIn(entries: ProjectTreeEntryData[]): string[] {
    return entries.flatMap((entry) => (entry.isOpen ? [entry.path, ...openedIn(entry.children)] : []));
}

function isLoadingIn(entries: ProjectTreeEntryData[]): boolean {
    return entries.some((entry) => entry.isLoading || isLoadingIn(entry.children));
}

function ask(): void {
    reload({ open: openFolders.value }, { onNetworkError: () => true, onHttpException: () => true });
}

const { gaveUp, retry, restart } = usePendingPoll(
    () => props.data,
    () => props.data.state === 'pending' || isLoadingIn(props.data.entries),
    ask,
);
const treeState = computed(() => (props.data.state === 'failed' || gaveUp.value ? 'failed' : 'ready'));

function changeOpen(paths: string[]): void {
    openFolders.value = paths;
    restart();
    ask();
}
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
                @open="openFile"
                @retry="retry"
            />
        </template>
    </section>
</template>
