/**
 * The plan whose row opened the reader, by the window that shows it. It is kept outside the component, which a visit
 * may draw anew, so the list can give that row the focus back once the reader closes.
 */
const openedPlans = new Map<string, string>();

export function rememberOpenedPlan(window: string, plan: string): void {
    openedPlans.set(window, plan);
}

/**
 * The plan that opened the reader in this window, given once: a later visit gives nothing until another plan opens.
 */
export function takeOpenedPlan(window: string): string | undefined {
    const plan = openedPlans.get(window);
    openedPlans.delete(window);

    return plan;
}
