import type { PlanFiltersData } from '@generated/types/plans';

/**
 * The plans window's filters as the page's query string reads them.
 */
export type PlanQuery = { q?: string; page?: number; plan?: string };

/**
 * The plans window's filters as a query: no empty search and no first page.
 */
export function planQuery(filters: PlanFiltersData): PlanQuery {
    return {
        q: filters.q || undefined,
        page: filters.page > 1 ? filters.page : undefined,
        plan: filters.plan,
    };
}
