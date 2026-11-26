import { reactive, watch } from 'vue';
import type { PhaseTaskData, PhaseTaskPageData } from '@generated/types/plans';
import { onReconnected } from '@kit/retainedPages';
import { useWindowReload } from '@kit/useWindowQuery';

/**
 * What one phase has shown so far: its rows in order, the cursor of its next page while more follow, the revision
 * its cursor belongs to, and whether a page is on its way or failed, with the cursor that page was asked after.
 */
export type PhasePages = {
    rows: PhaseTaskData[];
    nextAfter: string | undefined;
    revision: number;
    status: 'shown' | 'loading' | 'failed';
    askedAfter: string;
    firstNewRow: number;
    pageStarts: { after: string; count: number }[];
};

/**
 * The task pages of each phase a reader opened, each with its own cursor, asked for through a reload of the window's
 * prop. A page appends once, a changed phase starts over, a failed page keeps its rows and retries, and after a
 * reconnect every opened phase reads its first page again.
 */
export function usePhasePages(
    incoming: () => PhaseTaskPageData | undefined,
    namesPhase: boolean,
) {
    const reload = useWindowReload();
    const phases = reactive(new Map<string, PhasePages>());
    const announcement = reactive({ text: '' });

    function ask(phase: string, after: string, revision: number): void {
        const pages = phases.get(phase);

        if (pages === undefined) {
            phases.set(phase, {
                rows: [],
                nextAfter: undefined,
                revision,
                status: 'loading',
                askedAfter: after,
                firstNewRow: 0,
                pageStarts: [],
            });
        } else {
            pages.status = 'loading';
            pages.askedAfter = after;
        }

        const values: Record<string, string> = {
            tasks_after: after,
            revision: String(revision),
        };

        if (namesPhase) {
            values.phase = phase;
        }

        reload(values, {
            onNetworkError: () => fail(phase),
            onHttpException: () => fail(phase),
        });
    }

    function fail(phase: string): boolean {
        const pages = phases.get(phase);

        if (pages !== undefined) {
            pages.status = 'failed';
        }

        return false;
    }

    function show(page: PhaseTaskPageData): void {
        const pages = phases.get(page.phase);

        if (pages === undefined) {
            phases.set(page.phase, {
                rows: [...page.rows],
                nextAfter: page.nextAfter,
                revision: page.revision,
                status: 'shown',
                askedAfter: page.after,
                firstNewRow: 0,
                pageStarts: [{ after: page.after, count: page.rows.length }],
            });

            return;
        }

        const isAsked = pages.status === 'loading' && pages.askedAfter === page.after;

        if (!page.isRevisionChanged && !isAsked) {
            refreshShown(pages, page);

            return;
        }

        if (page.isRevisionChanged) {
            announcement.text = `The tasks of phase ${page.phase} were reloaded.`;
        }

        const isFresh = page.isRevisionChanged || page.after === '0';
        pages.firstNewRow = isFresh ? 0 : pages.rows.length;
        pages.rows = isFresh ? [...page.rows] : [...pages.rows, ...page.rows];
        pages.pageStarts = [
            ...(isFresh ? [] : pages.pageStarts),
            { after: page.after, count: page.rows.length },
        ];
        pages.nextAfter = page.nextAfter;
        pages.revision = page.revision;
        pages.status = 'shown';
    }

    function refreshShown(pages: PhasePages, page: PhaseTaskPageData): void {
        const index = pages.pageStarts.findIndex((start) => start.after === page.after);

        if (index === -1) {
            return;
        }

        const offset = pages.pageStarts
            .slice(0, index)
            .reduce((rows, start) => rows + start.count, 0);
        const rows = [...pages.rows];
        rows.splice(offset, pages.pageStarts[index].count, ...page.rows);
        pages.rows = rows;
        pages.pageStarts[index].count = page.rows.length;

        if (index === pages.pageStarts.length - 1) {
            pages.nextAfter = page.nextAfter;
        }
    }

    watch(incoming, (page) => page !== undefined && show(page), {
        immediate: true,
    });

    function open(phase: string, revision: number): void {
        if (phases.has(phase)) {
            return;
        }

        ask(phase, '0', revision);
    }

    function loadMore(phase: string): void {
        const pages = phases.get(phase);

        if (pages === undefined || pages.nextAfter === undefined) {
            return;
        }

        ask(phase, pages.nextAfter, pages.revision);
    }

    function retry(phase: string): void {
        const pages = phases.get(phase);

        if (pages === undefined) {
            return;
        }

        ask(phase, pages.askedAfter, pages.revision);
    }

    onReconnected(() => {
        for (const [phase, pages] of phases) {
            pages.rows = [];
            pages.pageStarts = [];
            ask(phase, '0', pages.revision);
        }
    });

    return { phases, open, loadMore, retry, announcement };
}
