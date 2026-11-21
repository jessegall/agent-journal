import type { IconName } from '@kit/Icon';
import type { StateTone } from '@kit/StateBadge';
import type { PlanCardData, PlanType, PlanState } from '@generated/types/plans';

/**
 * How a plan's type and state look; keyed by the server's enum values, never by a translated label.
 */
export const typeIcon: Record<PlanType, IconName> = {
    build: 'plan',
    fix: 'warn',
    research: 'search',
    cleanup: 'rules',
};

export const typeLabel: Record<PlanType, string> = {
    build: 'Build',
    fix: 'Fix',
    research: 'Research',
    cleanup: 'Cleanup',
};

export const stateLook: Record<PlanState, { label: string; tone: StateTone; icon: IconName }> = {
    planned: { label: 'Planned', tone: 'quiet', icon: 'list' },
    reviewing: { label: 'Reviewing', tone: 'sequence', icon: 'search' },
    started: { label: 'Started', tone: 'busy', icon: 'start' },
    paused: { label: 'Paused', tone: 'paused', icon: 'minimize' },
    cancelled: { label: 'Cancelled', tone: 'quiet', icon: 'close' },
    done: { label: 'Done', tone: 'good', icon: 'tick' },
};

/**
 * The task counts of a plan or a phase, as the server sends them on both.
 */
export type TaskCounts = Pick<PlanCardData, 'finishedTasks' | 'cancelledTasks' | 'totalTasks'>;

/**
 * The counts in words, written once for card, plan and phase: '1 of 2 finished · 1 cancelled · 0 unfinished', or
 * '2 of 2 finished' when every task is finished, or 'No tasks'.
 */
export function progressText(counts: TaskCounts): string {
    if (counts.totalTasks === 0) {
        return 'No tasks';
    }

    const finished = `${counts.finishedTasks} of ${counts.totalTasks} finished`;

    if (counts.finishedTasks === counts.totalTasks) {
        return finished;
    }

    const unfinished = counts.totalTasks - counts.finishedTasks - counts.cancelledTasks;

    return `${finished} · ${counts.cancelledTasks} cancelled · ${unfinished} unfinished`;
}

/**
 * What the Current phase marker means, for its description.
 */
export const currentPhaseRule =
    'The first phase with fewer finished tasks than tasks, or the last phase when all are finished.';

/**
 * The plan's number and type as a row heads them, such as Plan 12 · Build.
 */
export function planHeading(card: PlanCardData): string {
    return `Plan ${card.number} · ${typeLabel[card.type]}`;
}

/**
 * The plan in one spoken phrase, such as build plan 12, for the names of its link and its actions.
 */
export function planName(card: PlanCardData): string {
    return `${typeLabel[card.type].toLowerCase()} plan ${card.number}`;
}
