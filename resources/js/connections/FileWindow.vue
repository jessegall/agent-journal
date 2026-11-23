<script setup lang="ts">
import type { FileWindowData } from '@generated/types/connections';
import Button from '@kit/Button';
import CodeView from '@kit/CodeView';
import EmptyState from '@kit/EmptyState';
import RowSkeleton from '@kit/RowSkeleton';
import { useWindowReload } from '@kit/useWindowQuery';
import FileLines from './FileLines.vue';
import { usePendingPoll } from './usePendingPoll';

/**
 * One file of the connected project in its own window: its lines with a gutter and a theme menu, or a Markdown file
 * drawn as the document reader draws it. While the host has not answered it waits like the Project window, and a read
 * that failed offers Retry in this window only. A binary file and a file too large to show whole say so plainly. Once
 * a version of the file is kept, its lines take comments and show their threads.
 */
const props = defineProps<{ data: FileWindowData }>();

const reload = useWindowReload();

function ask(): void {
    reload({ path: props.data.path }, { onNetworkError: () => true, onHttpException: () => true });
}

const { gaveUp, retry } = usePendingPoll(
    () => props.data,
    () => props.data.state === 'pending',
    ask,
);
</script>

<template>
    <section :aria-label="data.name || 'File'" class="flex h-full min-h-0 flex-col">
        <template v-if="data.state === 'none'">
            <EmptyState icon="file" title="No project is connected" />
        </template>
        <template v-else-if="data.state === 'empty'">
            <EmptyState icon="file" title="No file is open" text="Open a file from Project to read it here." />
        </template>
        <template v-else-if="data.state === 'offline'">
            <div role="alert" class="flex flex-col items-start gap-2 p-4 text-body text-text-2">
                <p>The project's machine is not connected, so {{ data.name }} cannot be read.</p>
                <Button variant="bordered" size="small" @click="retry">Retry</Button>
            </div>
        </template>
        <template v-else-if="data.state === 'pending' && !gaveUp">
            <RowSkeleton :label="`Reading ${data.name}`" :rows="8" />
        </template>
        <template v-else-if="data.state === 'binary'">
            <EmptyState icon="file" :title="`${data.name} is not a text file`" text="Only text files can be shown here." />
        </template>
        <template v-else-if="data.state === 'ready' && data.markdown !== undefined">
            <div class="prose min-h-0 flex-1 overflow-auto p-4" v-html="data.markdown.html" />
        </template>
        <template v-else>
            <template v-if="data.state === 'too_large'">
                <p role="status" class="border-b border-border px-3 py-1.5 text-small text-text-3">
                    {{ data.name }} is too large to show whole; this is its start.
                </p>
            </template>
            <CodeView
                :name="data.name"
                :lines="data.lines"
                :is-markdown="false"
                :state="data.state === 'failed' || gaveUp ? 'failed' : 'ready'"
                @retry="retry"
            >
                <template v-if="data.commentTarget !== null && data.digest !== null" #lines>
                    <FileLines
                        :target="data.commentTarget"
                        :version="data.digest"
                        :path="data.path"
                        :lines="data.lines"
                        :threads="data.threads"
                        :recipient-id="data.recipientId"
                        :recipient-name="data.recipientName"
                        :tell-address="data.tellAddress"
                    />
                </template>
            </CodeView>
        </template>
    </section>
</template>
