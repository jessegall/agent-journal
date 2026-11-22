import { forgetStored, keepStoredJson, readStoredJson } from '@/composables/browserStorage';

const STORAGE_KEY = 'journal.list-return';

type ListReturn = { address: string; rowKey: string };

/**
 * Remembers the row a viewer opened from a list, with the list's own address, so Back to that address can give the
 * row its focus again.
 */
export function rememberRow(address: string, rowKey: string): void {
    keepStoredJson('session', STORAGE_KEY, { address, rowKey } satisfies ListReturn);
}

/**
 * When the list shown is the one a row was opened from, focuses that row; when the row is gone, focuses the list's
 * heading. A list that was not left through a row is left alone.
 */
export function restoreRow(list: HTMLElement, address: string): void {
    const remembered = readStoredJson<ListReturn>('session', STORAGE_KEY, (decoded) =>
        typeof decoded === 'object' && decoded !== null && 'address' in decoded && 'rowKey' in decoded
            ? (decoded as ListReturn)
            : null,
    );

    if (remembered === null || remembered.address !== address) {
        return;
    }

    forgetStored('session', STORAGE_KEY);

    const row = [...list.querySelectorAll<HTMLElement>('[data-row-key]')].find(
        (candidate) => candidate.dataset.rowKey === remembered.rowKey,
    );
    const heading = document.querySelector<HTMLElement>('[data-layout-box="page-head"] h2');

    if (row !== undefined) {
        row.focus();

        return;
    }

    heading?.setAttribute('tabindex', '-1');
    heading?.focus();
}
