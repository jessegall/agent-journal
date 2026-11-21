import { reactive, watch } from 'vue';
import type { PhaseTaskData, PhaseTaskPageData } from '@generated/types/plans';
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
};

/**
 * The task pages of each phase a reader opened, each phase with its own cursor. A page is asked for through a reload
 * of the window's own prop; the answer for the cursor asked appends once and keeps the earlier rows, an answer for a
 * phase that changed revision starts that phase over, and a failed page keeps the rows and retries the same cursor.
 * The phase's own number goes along when the page is a plan's outline; a phase page names its phase by its route.
 */
export function usePhasePages(
    incoming: () => PhaseTaskPageData | undefined,
    namesPhase: boolean,
) {
    const reload = useWindowReload();
    const phases = reactive(new Map<string, PhasePages>());

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
            });

            return;
        }

        const isAsked = pages.status === 'loading' && pages.askedAfter === page.after;

        if (!page.isRevisionChanged && !isAsked) {
            return;
        }

        const isFresh = page.isRevisionChanged || page.after === '0';
        pages.firstNewRow = isFresh ? 0 : pages.rows.length;
        pages.rows = isFresh ? [...page.rows] : [...pages.rows, ...page.rows];
        pages.nextAfter = page.nextAfter;
        pages.revision = page.revision;
        pages.status = 'shown';
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

    return { phases, open, loadMore, retry };
}
