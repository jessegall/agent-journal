/**
 * One driver's current choice as the server sent it: the chosen account, if any, and the change number that only
 * grows with each new choice.
 */
export type AccountSelection = {
    driver: string;
    accountId: string | null;
    changeNumber: number;
};

/**
 * The choices to show after a page reload arrives: per driver, the one with the greater change number, so an older
 * answer that arrives late never takes back a newer choice. The server stays the authority: the arrived choice wins
 * whenever it is at least as new.
 */
export function newestSelections(
    shown: AccountSelection[],
    arrived: AccountSelection[],
): AccountSelection[] {
    const byDriver = new Map<string, AccountSelection>();

    for (const selection of [...shown, ...arrived]) {
        const known = byDriver.get(selection.driver);

        if (
            known === undefined ||
            selection.changeNumber >= known.changeNumber
        ) {
            byDriver.set(selection.driver, selection);
        }
    }

    return [...byDriver.values()];
}

/**
 * Whether new starts of the account's driver use the account, by the choices shown.
 */
export function isChosen(
    selections: AccountSelection[],
    driver: string,
    accountId: string,
): boolean {
    return selections.some(
        (selection) =>
            selection.driver === driver && selection.accountId === accountId,
    );
}
