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
 * The card's progress in words, built in one string so server and browser render the same text.
 */
export function progressText(card: PlanCardData): string {
    const phase = card.phase === undefined ? '' : ` · phase ${card.phase}`;

    return `${card.doneTasks} of ${card.totalTasks} tasks done${phase}`;
}

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
