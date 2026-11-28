<script setup lang="ts">
import { computed } from 'vue';
import type { FileWindowData } from '@generated/types/connections';
import Button from '@kit/Button';
import CodeView from '@kit/CodeView';
import EmptyState from '@kit/EmptyState';
import RowSkeleton from '@kit/RowSkeleton';
import SwitchCase from '@kit/SwitchCase';
import { useWindowReload } from '@kit/useWindowQuery';
import FileLines from './partials/FileLines.vue';
import { usePendingPoll } from '../../usePendingPoll';

/**
 * One file of the connected project in its own window: its lines with a gutter and theme menu, or a Markdown file drawn
 * as the document reader draws it. It waits for the host, offers Retry after a failed read, says so for a binary or too
 * large file, and takes comments once a version is kept.
 */
const props = defineProps<{ data: FileWindowData }>();

const reload = useWindowReload();

function ask(): void {
    reload({ path: props.data.path }, { onNetworkError: () => true, onHttpException: () => true });
}

const { gaveUp, retry } = usePendingPoll(
    () => props.data,
    () => props.data.status === 'pending',
    ask,
);

/**
 * What the window shows: the reading placeholder while the host has not answered, a Markdown file as a document, or
 * the file's state, whose lines show for every state without a look of its own (a read that failed or gave up shows
 * them with Retry).
 */
const shown = computed(() => {
    if (props.data.status === 'pending' && !gaveUp.value) {
        return 'reading';
    }

    if (props.data.status === 'ready' && props.data.markdown !== undefined) {
        return 'markdown';
    }

    return props.data.status;
});
</script>

<template>
    <section :aria-label="data.name || 'File'" class="flex h-full min-h-0 flex-col">
        <SwitchCase :value="shown">
            <template #none>
                <EmptyState icon="file" title="No project is connected" />
            </template>
            <template #empty>
                <EmptyState icon="file" title="No file is open" text="Open a file from Project to read it here." />
            </template>
            <template #offline>
                <div role="alert" class="flex flex-col items-start gap-2 p-4 text-body text-text-2">
                    <p>The project's machine is not connected, so {{ data.name }} cannot be read.</p>
                    <Button variant="bordered" size="small" @click="retry">Retry</Button>
                </div>
            </template>
            <template #reading>
                <RowSkeleton :label="`Reading ${data.name}`" :rows="8" />
            </template>
            <template #binary>
                <EmptyState
                    icon="file"
                    :title="`${data.name} is not a text file`"
                    text="Only text files can be shown here."
                />
            </template>
            <template #markdown>
                <div class="prose min-h-0 flex-1 overflow-auto p-4" v-html="data.markdown?.html" />
            </template>
            <template #default>
                <template v-if="data.status === 'too_large'">
                    <p role="status" class="border-b border-border px-3 py-1.5 text-small text-text-3">
                        {{ data.name }} is too large to show whole; this is its start.
                    </p>
                </template>
                <CodeView
                    :name="data.name"
                    :lines="data.lines"
                    :is-markdown="false"
                    :state="data.status === 'failed' || gaveUp ? 'failed' : 'ready'"
                    @retry="retry"
                >
                    <template
                        v-if="
                            data.commentTarget !== null &&
                            data.digest !== null &&
                            data.commentAddress !== null &&
                            data.messageAddress !== null
                        "
                        #lines
                    >
                        <FileLines
                            :target="data.commentTarget"
                            :version="data.digest"
                            :path="data.path"
                            :lines="data.lines"
                            :threads="data.threads"
                            :recipient-id="data.recipientId"
                            :recipient-name="data.recipientName"
                            :comment-address="data.commentAddress"
                            :message-address="data.messageAddress"
                        />
                    </template>
                </CodeView>
            </template>
        </SwitchCase>
    </section>
</template>
