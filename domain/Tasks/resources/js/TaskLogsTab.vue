<script setup lang="ts">
import { onMounted } from 'vue';
import Button from '@kit/Button';
import type { TaskLogsData, TaskStreamEntryData } from '@generated/types/tasks';
import { taskStateLook } from './taskLooks';
import { useTaskLogs } from './useTaskLogs';

/**
 * A task's Logs tab: its changes and its run's log lines in order, each with its time, who made it and its run or
 * Run unknown, the text shown as written. Show older reads the page before; while older entries are on screen, new
 * ones wait behind New entries with one announcement. It tells loading, an empty read, a failed read with the rows
 * it had, a refused read and the start of the history apart. A line a search opened the tab at stands first, or a
 * notice says it is gone.
 */
const props = defineProps<{ logs: TaskLogsData | undefined }>();

const { logs, open, showOlder, revealWaiting, retry } = useTaskLogs(
    () => props.logs,
);

onMounted(open);

function runText(entry: TaskStreamEntryData): string {
    return entry.runNumber === undefined ? 'Run unknown' : `Run ${entry.runNumber}`;
}

function changeText(entry: TaskStreamEntryData): string {
    if (entry.fromState === undefined || entry.toState === undefined) {
        return '';
    }

    return `${taskStateLook[entry.fromState].label} to ${taskStateLook[entry.toState].label}`;
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <p role="status" class="sr-only">
            {{
                logs.waiting.length > 0
                    ? `${logs.waiting.length} new log entries`
                    : ''
            }}
        </p>
        <template v-if="props.logs?.selectedGone === true">
            <p role="status" class="text-small text-text-3">
                That log line is no longer available.
            </p>
        </template>
        <template v-if="props.logs?.selected !== undefined">
            <section
                aria-label="Log line found by search"
                class="flex flex-col gap-0.5 border-l-2 border-brand pl-2"
            >
                <span class="flex flex-wrap gap-x-2 text-small text-text-3">
                    <span>Found by search</span>
                    <span class="tabular-nums">{{ runText(props.logs.selected) }}</span>
                </span>
                <p
                    class="text-body whitespace-pre-wrap text-text-2 [overflow-wrap:anywhere]"
                    v-text="props.logs.selected.text"
                />
            </section>
        </template>
        <template v-if="logs.status === 'restricted'">
            <p class="text-body text-text-3">You can't read this task's logs.</p>
        </template>
        <template v-else-if="logs.status === 'failed'">
            <p role="alert" class="flex items-center gap-2 text-small text-text-2">
                <span>{{
                    logs.entries.length > 0
                        ? 'Showing the entries read before the connection was lost.'
                        : 'The logs could not be read.'
                }}</span>
                <Button size="small" variant="bordered" @click="retry"
                    >Retry</Button
                >
            </p>
        </template>
        <template v-if="logs.status === 'loading' && logs.entries.length === 0">
            <p role="status" class="text-small text-text-3">Loading the logs</p>
        </template>
        <template v-else-if="logs.status === 'shown' && logs.entries.length === 0">
            <p class="text-body text-text-3">No log entries yet</p>
        </template>
        <template v-if="logs.entries.length > 0">
            <template v-if="logs.olderBefore !== undefined">
                <div>
                    <Button
                        size="small"
                        variant="bordered"
                        :pending="logs.status === 'loading'"
                        @click="showOlder"
                        >Show older</Button
                    >
                </div>
            </template>
            <template v-else>
                <p class="text-small text-text-4">Start of the history</p>
            </template>
            <ol class="flex flex-col gap-2" aria-label="Log entries">
                <template v-for="entry in logs.entries" :key="entry.id">
                    <li class="flex flex-col gap-0.5 border-l-2 border-border pl-2">
                        <span class="flex flex-wrap gap-x-2 text-small text-text-3">
                            <time :datetime="entry.at">{{
                                new Date(entry.at).toLocaleString()
                            }}</time>
                            <span>{{ entry.actorType }} {{ entry.actorId }}</span>
                            <span class="tabular-nums">{{ runText(entry) }}</span>
                        </span>
                        <template v-if="entry.type === 'change'">
                            <span class="text-small font-medium text-text-2">{{
                                changeText(entry)
                            }}</span>
                        </template>
                        <template v-if="entry.text !== undefined">
                            <p
                                class="text-body whitespace-pre-wrap text-text-2 [overflow-wrap:anywhere]"
                                v-text="entry.text"
                            />
                        </template>
                    </li>
                </template>
            </ol>
        </template>
        <template v-if="logs.waiting.length > 0">
            <div>
                <Button size="small" variant="bordered" @click="revealWaiting"
                    >New entries ({{ logs.waiting.length }})</Button
                >
            </div>
        </template>
    </div>
</template>
