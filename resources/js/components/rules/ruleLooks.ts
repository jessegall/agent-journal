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
 * The rule filters as a query string: no empty search and no first page. A page that also shows another list puts a
 * prefix before the search and page keys.
 */
export function ruleQuery(
    filters: RuleFiltersData,
    keyPrefix = '',
): Record<string, string | number | undefined> {
    return {
        [`${keyPrefix}q`]: filters.q || undefined,
        [`${keyPrefix}page`]: filters.page > 1 ? filters.page : undefined,
        rule: filters.rule,
    };
}

/**
 * Where a link to other rule filters goes on the rules page.
 */
export function rulesPageUrl(filters: RuleFiltersData): string {
    return index.url({ query: ruleQuery(filters) });
}
