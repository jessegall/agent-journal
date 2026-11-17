import { index } from '@/routes/plans';
import type { PlanFiltersData } from '@/types/generated';

/**
 * The plans slice's filters as a query string: no empty search and no first page.
 */
export function planQuery(
    filters: PlanFiltersData,
): Record<string, string | number | undefined> {
    return {
        q: filters.q || undefined,
        page: filters.page > 1 ? filters.page : undefined,
        plan: filters.plan,
    };
}

/**
 * Where a link to other filters goes on the plans page.
 */
export function plansPageUrl(filters: PlanFiltersData): string {
    return index.url({ query: planQuery(filters) });
}
