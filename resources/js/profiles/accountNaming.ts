import { rename } from '@generated/routes/accounts';
import type { AccountListData } from '@generated/types/accounts';
import type { WindowResult } from '@kit/PageTypes';
import { useForm } from '@inertiajs/vue3';
import { formSendingHooks } from '@kit/usePageChanges';
import { computed, ref, watch } from 'vue';

/**
 * How long Saved shows after a name was saved.
 */
const SAVED_MILLISECONDS = 2000;

/**
 * The form that names an account, shared by the rename dialog and the wizard's naming step: it holds the name, can
 * save only a changed name that is not empty, sends the name revision it was shown so a rename made meanwhile is not
 * overwritten, and keeps the host's refusal under the field.
 */
export function useAccountNaming(
    account: () => { id: string; label: string; nameRevision: number },
) {
    const naming = useForm({ label: account().label });

    /**
     * Why the name was not saved, under the field: the name itself, or a rename made meanwhile, which keeps the draft
     * and names the name now saved; an edit clears it.
     */
    const refusal = computed(
        () =>
            naming.errors.label ??
            (naming.errors as Record<string, string | undefined>).command,
    );

    watch(
        () => naming.label,
        () => naming.clearErrors(),
    );
    // Whether the name was just saved, shown at the field's end for a moment.
    const saved = ref(false);

    const canSave = computed(() => {
        const name = naming.label.trim();

        return name !== '' && name !== account().label;
    });

    /**
     * Puts the account's saved name back in the field and clears the host's refusal, so an unsaved edit is dropped.
     */
    function revert(): void {
        naming.label = account().label;
        naming.clearErrors();
    }

    /**
     * Starts from the saved name with all of it selected, so typing replaces it: the wizard's naming step, where naming
     * is the only task.
     */
    function startFrom(field: HTMLInputElement | null): void {
        revert();
        field?.focus();
        field?.select();
    }

    /**
     * Saves the name, and shows it in the account list at once: Inertia keeps the new name over reads while the save
     * is out and puts the old one back when it is refused.
     */
    function save(onSaved: () => void): void {
        const { id, nameRevision } = account();
        const label = naming.label.trim();

        naming
            .transform(() => ({ label, seenRevision: nameRevision }))
            .optimistic<{ page: WindowResult<AccountListData> }>((props) =>
                renamedIn(props.page, id, label),
            )
            .submit(rename({ account: id }), {
                preserveScroll: true,
                onSuccess: () => {
                    saved.value = true;
                    window.setTimeout(
                        () => (saved.value = false),
                        SAVED_MILLISECONDS,
                    );
                    onSaved();
                },
                ...formSendingHooks(),
            });
    }

    return { naming, refusal, canSave, saved, revert, startFrom, save };
}

/**
 * The page with the account's row renamed, when the page lists accounts; any other page is left as it is.
 */
function renamedIn(
    page: WindowResult<AccountListData>,
    id: string,
    label: string,
): { page: WindowResult<AccountListData> } | Record<string, never> {
    if (page.status !== 'ready' || !Array.isArray(page.data.rows)) {
        return {};
    }

    const rows = page.data.rows.map((row) =>
        row.id === id ? { ...row, label } : row,
    );

    return { page: { ...page, data: { ...page.data, rows } } };
}
