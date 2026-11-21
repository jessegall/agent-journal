import { rename } from '@generated/routes/accounts';
import type { AccountListData } from '@generated/types/accounts';
import type { WindowResult } from '@kit/PageTypes';
import { useForm } from '@inertiajs/vue3';
import { formSendingHooks } from '@kit/usePageChanges';
import { computed } from 'vue';

/**
 * The form that names an account, shared by the rename dialog and the wizard's naming step: it holds the name, can
 * save only a changed name that is not empty, and keeps the host's refusal under the field.
 */
export function useAccountNaming(account: () => { id: string; label: string }) {
    const naming = useForm({ label: account().label });

    const canSave = computed(() => {
        const name = naming.label.trim();

        return name !== '' && name !== account().label;
    });

    /**
     * Puts the account's current name back in the field, all of it selected, so typing replaces it.
     */
    function startFrom(field: HTMLInputElement | null): void {
        naming.label = account().label;
        naming.clearErrors();
        field?.focus();
        field?.select();
    }

    /**
     * Saves the name, and shows it in the account list at once: Inertia keeps the new name over reads while the save
     * is out and puts the old one back when it is refused.
     */
    function save(onSaved: () => void): void {
        const id = account().id;
        const label = naming.label.trim();

        naming
            .optimistic<{ page: WindowResult<AccountListData> }>((props) => renamedIn(props.page, id, label))
            .submit(rename({ account: id }), {
                preserveScroll: true,
                onSuccess: onSaved,
                ...formSendingHooks(),
            });
    }

    return { naming, canSave, startFrom, save };
}

/**
 * The page with the account's row renamed, when the page lists accounts; any other page is left as it is.
 */
function renamedIn(
    page: WindowResult<AccountListData>,
    id: string,
    label: string,
): { page: WindowResult<AccountListData> } | Record<string, never> {
    if (page.state !== 'ready' || !Array.isArray(page.data.rows)) {
        return {};
    }

    const rows = page.data.rows.map((row) => (row.id === id ? { ...row, label } : row));

    return { page: { ...page, data: { ...page.data, rows } } };
}
