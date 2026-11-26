<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from '@/components/kit/Button.vue';
import EmptyState from '@/components/kit/EmptyState.vue';
import Spinner from '@/components/kit/Spinner.vue';
import Tree from '@/components/kit/Tree.vue';
import TreeItem from '@/components/kit/TreeItem.vue';

/**
 * A project's files as a tree: folders open and close by their chevron and by Right and Left, the arrow keys walk the
 * rows and Enter on a file opens it as a window. An empty project says it is empty, and a read that failed says so and
 * offers Retry, so the two never look alike. The window is told what the project holds; it reads nothing itself. A
 * folder the window already opened starts open, the window receives every change of the open folders, and an open folder
 * whose entries are still being read, or could not be, says so under its row.
 */
export type ProjectEntry = {
    path: string;
    name: string;
    isFolder: boolean;
    isOpen?: boolean;
    isLoading?: boolean;
    isFailed?: boolean;
    children?: ProjectEntry[];
};

const props = defineProps<{ entries: ProjectEntry[]; state: 'ready' | 'failed' }>();
const emit = defineEmits<{ open: [path: string]; retry: []; 'update:open': [paths: string[]] }>();

function openedIn(entries: ProjectEntry[]): string[] {
    return entries.flatMap((entry) => (entry.isOpen === true ? [entry.path, ...openedIn(entry.children ?? [])] : []));
}

const opened = ref<Set<string>>(new Set(openedIn(props.entries)));

const rows = computed(() => {
    const found: { entry: ProjectEntry; level: number }[] = [];

    function walk(entries: ProjectEntry[], level: number): void {
        for (const entry of entries) {
            found.push({ entry, level });

            if (entry.isFolder && opened.value.has(entry.path)) {
                walk(entry.children ?? [], level + 1);
            }
        }
    }

    walk(props.entries, 1);

    return found;
});

function setOpen(path: string, isOpen: boolean): void {
    const next = new Set(opened.value);

    if (isOpen) {
        next.add(path);
    } else {
        next.delete(path);
    }

    opened.value = next;
    emit('update:open', [...next]);
}
</script>

<template>
    <template v-if="state === 'failed'">
        <div role="alert" class="flex flex-col items-start gap-2 p-4 text-body text-text-2">
            <p>The project's files could not be read.</p>
            <Button variant="bordered" size="small" @click="emit('retry')">Retry</Button>
        </div>
    </template>
    <template v-else-if="entries.length === 0">
        <EmptyState icon="folder" title="This project is empty" />
    </template>
    <template v-else>
        <Tree label="Project files">
            <template v-for="row in rows" :key="row.entry.path">
                <TreeItem
                    :value="row.entry.path"
                    :label="row.entry.name"
                    :level="row.level"
                    :icon="row.entry.isFolder ? 'folder' : 'file'"
                    :folder="row.entry.isFolder"
                    :expanded="opened.has(row.entry.path)"
                    @update:expanded="setOpen(row.entry.path, $event)"
                    @open="row.entry.isFolder ? setOpen(row.entry.path, !opened.has(row.entry.path)) : emit('open', row.entry.path)"
                />
                <template v-if="opened.has(row.entry.path) && (row.entry.isLoading === true || row.entry.isFailed === true)">
                    <div
                        role="status"
                        class="flex items-center gap-2 py-1 text-small text-text-3"
                        :style="{ paddingLeft: `${(row.level + 1) * 12}px` }"
                    >
                        <template v-if="row.entry.isLoading === true"><Spinner /> Reading {{ row.entry.name }}</template>
                        <template v-else>{{ row.entry.name }} could not be read</template>
                    </div>
                </template>
            </template>
        </Tree>
    </template>
</template>
