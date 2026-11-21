<script setup lang="ts">
import type { AccountRowData } from '@generated/types/accounts';
import { rename } from '@generated/routes/accounts';
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import Modal from '@kit/Modal';
import TextField from '@kit/TextField';
import { formSendingHooks } from '@kit/usePageChanges';
import { computed } from 'vue';

/**
 * Renames an account: the field opens holding the current name, all of it selected, so typing replaces it. Save waits
 * while the name is unchanged or empty, and a refusal stays under the field with the dialog open.
 */
const props = defineProps<{ account: AccountRowData; isOpen: boolean }>();
const emit = defineEmits<{ close: [] }>();

const naming = useForm({ label: props.account.label });
const fieldId = computed(() => `account-name-${props.account.id}`);
const canSave = computed(() => {
    const name = naming.label.trim();

    return name !== '' && name !== props.account.label;
});

/**
 * Fills the field with the current name, all of it selected, once the dialog shows, so typing replaces it.
 */
function selectName(dialog: HTMLDialogElement): void {
    naming.label = props.account.label;
    naming.clearErrors();
    const field = dialog.querySelector<HTMLInputElement>(`#${fieldId.value}`);
    field?.focus();
    field?.select();
}

function save(): void {
    naming.submit(rename({ account: props.account.id }), {
        preserveScroll: true,
        onSuccess: () => emit('close'),
        ...formSendingHooks(),
    });
}
</script>

<template>
    <Modal
        :is-open="isOpen"
        title="Rename account"
        @close="emit('close')"
        @opened="selectName"
    >
        <form
            :id="`${fieldId}-form`"
            class="w-[400px] max-w-full"
            @submit.prevent="canSave && save()"
        >
            <TextField
                :id="fieldId"
                v-model="naming.label"
                label="Name"
                :maxlength="80"
                :error="naming.errors.label"
                hint="This is the name you see everywhere."
            />
        </form>
        <template #footer>
            <span class="flex-1" />
            <Button @click="emit('close')">Cancel</Button>
            <Button
                type="submit"
                :form="`${fieldId}-form`"
                variant="primary"
                :disabled="!canSave"
                :pending="naming.processing"
                >Save</Button
            >
        </template>
    </Modal>
</template>
