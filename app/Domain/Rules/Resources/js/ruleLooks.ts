import type { RuleFiltersData, RuleState } from '@generated/types/rules';

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
 * The rules window's filters as a query: no empty search and no first page.
 */
export function ruleQuery(filters: RuleFiltersData): Record<string, string | number | undefined> {
    return {
        q: filters.q || undefined,
        page: filters.page > 1 ? filters.page : undefined,
        rule: filters.rule,
    };
}
