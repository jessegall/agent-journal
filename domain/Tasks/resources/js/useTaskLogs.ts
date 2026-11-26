import { reactive, watch } from 'vue';
import type { TaskLogsData, TaskStreamEntryData } from '@generated/types/tasks';
import { onReconnected } from '@kit/retainedPages';
import { useWindowReload } from '@kit/useWindowQuery';

/**
 * A task's Logs as the reader holds them: the entries oldest first, the older page's cursor and the last read's
 * outcome. New entries are added at once unless older ones are on screen, when they wait behind a New entries count; a
 * refused read clears the rows.
 */
export function useTaskLogs(incoming: () => TaskLogsData | undefined) {
    const reload = useWindowReload();
    const logs = reactive({
        entries: [] as TaskStreamEntryData[],
        waiting: [] as TaskStreamEntryData[],
        olderBefore: undefined as string | undefined,
        askedBefore: '',
        hasOlderShown: false,
        status: 'idle' as 'idle' | 'loading' | 'shown' | 'failed' | 'restricted',
    });

    function known(): Set<string> {
        return new Set([...logs.entries, ...logs.waiting].map((entry) => entry.id));
    }

    function show(data: TaskLogsData): void {
        const isFirst = logs.status !== 'shown' && logs.entries.length === 0;
        const ids = known();
        const arrived = data.newest.entries.filter((entry) => !ids.has(entry.id));

        if (isFirst) {
            logs.entries = [...data.newest.entries];
            logs.olderBefore = data.newest.olderBefore;
        } else if (logs.hasOlderShown) {
            logs.waiting = [...logs.waiting, ...arrived];
        } else {
            logs.entries = [...logs.entries, ...arrived];
        }

        if (data.older !== undefined && data.older.before === logs.askedBefore) {
            const older = data.older.entries.filter((entry) => !ids.has(entry.id));
            logs.entries = [...older, ...logs.entries];
            logs.olderBefore = data.older.olderBefore;
            logs.hasOlderShown = true;
        }

        logs.status = 'shown';
    }

    watch(incoming, (data) => data !== undefined && show(data), {
        immediate: true,
    });

    function ask(values: Record<string, string>): void {
        logs.status = 'loading';
        reload(
            { section: 'logs', ...values },
            {
                onNetworkError: () => {
                    logs.status = 'failed';

                    return false;
                },
                onHttpException: (response) => {
                    const isRefused = response.status === 403 || response.status === 404;
                    logs.status = isRefused ? 'restricted' : 'failed';

                    if (isRefused) {
                        logs.entries = [];
                        logs.waiting = [];
                    }

                    return false;
                },
            },
        );
    }

    function open(): void {
        if (logs.status === 'idle') {
            ask({});
        }
    }

    function showOlder(): void {
        if (logs.olderBefore === undefined) {
            return;
        }

        logs.askedBefore = logs.olderBefore;
        ask({ logs_before: logs.olderBefore });
    }

    function revealWaiting(): void {
        logs.entries = [...logs.entries, ...logs.waiting];
        logs.waiting = [];
    }

    function retry(): void {
        ask(logs.askedBefore === '' ? {} : { logs_before: logs.askedBefore });
    }

    onReconnected(() => {
        if (logs.status !== 'idle') {
            ask({});
        }
    });

    return { logs, open, showOlder, revealWaiting, retry };
}
