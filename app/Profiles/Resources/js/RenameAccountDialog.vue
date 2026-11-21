<script setup lang="ts">
import type { AccountRowData } from '@generated/types/accounts';
import Button from '@kit/Button';
import Modal from '@kit/Modal';
import TextField from '@kit/TextField';
import { computed } from 'vue';
import { useAccountNaming } from './accountNaming';

/**
 * Renames an account: the field opens holding the current name, all of it selected, so typing replaces it. Save waits
 * while the name is unchanged or empty, and a refusal stays under the field with the dialog open.
 */
const props = defineProps<{ account: AccountRowData; isOpen: boolean }>();
const emit = defineEmits<{ close: [] }>();

const { naming, canSave, startFrom, save } = useAccountNaming(
    () => props.account,
);
const fieldId = computed(() => `account-name-${props.account.id}`);

function selectName(dialog: HTMLDialogElement): void {
    startFrom(dialog.querySelector<HTMLInputElement>(`#${fieldId.value}`));
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
            @submit.prevent="canSave && save(() => emit('close'))"
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
