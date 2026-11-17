import type { RuleFiltersData, RuleState } from '@/types/generated';
import { index } from '@/routes/rules';

/**
 * How a rule's state looks; keyed by the server's enum values, never by a translated label.
 */
export const ruleStateLook: Record<RuleState, { label: string; tone: string }> =
    {
        proposed: { label: 'Proposed', tone: 'text-tone-sequence' },
        active: { label: 'Active', tone: 'text-tone-good' },
        denied: { label: 'Denied', tone: 'text-text-4' },
        removed: { label: 'Removed', tone: 'text-text-4' },
    };

/**
 * Where a link to other rule filters goes: no empty search and no first page in the query.
 */
export function rulesPageUrl(filters: RuleFiltersData): string {
    return index.url({
        query: {
            q: filters.q || undefined,
            page: filters.page > 1 ? filters.page : undefined,
            rule: filters.rule,
        },
    });
}
