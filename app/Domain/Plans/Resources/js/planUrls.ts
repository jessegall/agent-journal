import type { PlanFiltersData } from '@generated/types/plans';

/**
 * The plans window's filters as a query: no empty search and no first page.
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
