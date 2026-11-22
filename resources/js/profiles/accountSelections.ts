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

/**
 * The change number of the driver's choice as shown, which a new choice names so the server can tell it is current;
 * a driver nobody chose for yet is at 0.
 */
export function changeNumberOf(
    selections: AccountSelection[],
    driver: string,
): number {
    return (
        selections.find((selection) => selection.driver === driver)
            ?.changeNumber ?? 0
    );
}

/**
 * The selections with the account chosen for its driver at the change number shown, as a page shows them until the
 * server answers; the same change number lets the server's answer, or a collaborator's newer one, replace it.
 */
export function chosenIn(
    selections: AccountSelection[],
    driver: string,
    accountId: string,
    changeNumber: number,
): AccountSelection[] {
    const others = selections.filter(
        (selection) => selection.driver !== driver,
    );

    return [...others, { driver, accountId, changeNumber }];
}
