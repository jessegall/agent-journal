import type { IconName } from '@kit/Icon';
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

export const stateLook: Record<PlanState, { label: string; tone: string }> = {
    planned: { label: 'Planned', tone: 'text-text-3' },
    reviewing: { label: 'Reviewing', tone: 'text-tone-sequence' },
    started: { label: 'Started', tone: 'text-tone-work' },
    paused: { label: 'Paused', tone: 'text-tone-paused' },
    cancelled: { label: 'Cancelled', tone: 'text-text-4' },
    done: { label: 'Done', tone: 'text-tone-good' },
};

/**
 * The card's progress in words, built in one string so server and browser render the same text.
 */
export function progressText(card: PlanCardData): string {
    const phase = card.phase === undefined ? '' : ` · phase ${card.phase}`;

    return `${card.doneTasks} of ${card.totalTasks} tasks done${phase}`;
}
