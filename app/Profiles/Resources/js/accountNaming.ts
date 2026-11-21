import { rename } from '@generated/routes/accounts';
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

    function save(onSaved: () => void): void {
        naming.submit(rename({ account: account().id }), {
            preserveScroll: true,
            onSuccess: onSaved,
            ...formSendingHooks(),
        });
    }

    return { naming, canSave, startFrom, save };
}
