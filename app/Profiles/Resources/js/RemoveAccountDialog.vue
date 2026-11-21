<script setup lang="ts">
import type { AccountRowData } from '@generated/types/accounts';
import { remove } from '@generated/routes/accounts';
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import Modal from '@kit/Modal';
import ProgramIcon from '@kit/ProgramIcon';
import { formSendingHooks } from '@kit/usePageChanges';
import { computed } from 'vue';
import { programIcon } from './accountLooks';

/**
 * Asks before an account is removed: it names the account and says in one sentence what removal does, and how much
 * work still runs on it. Cancel comes first, so Enter never removes by accident.
 */
const props = defineProps<{
    account: AccountRowData;
    subtext: string;
    isOpen: boolean;
}>();
const emit = defineEmits<{ close: [] }>();

const removing = useForm({});
const consequence = computed(() => {
    const running = props.account.runningCount;

    if (running === 0) {
        return "This signs it out. Agents can't use it anymore, and its files are deleted.";
    }

    const agents = running === 1 ? '1 agent is' : `${running} agents are`;

    return `This signs it out and deletes its files. ${agents} still using it; it goes away when they finish.`;
});

function confirm(): void {
    removing.submit(remove({ account: props.account.id }), {
        preserveScroll: true,
        onSuccess: () => emit('close'),
        ...formSendingHooks(),
    });
}
</script>

<template>
    <Modal :is-open="isOpen" title="Remove account" @close="emit('close')">
        <div class="flex w-[400px] max-w-full flex-col gap-3">
            <div class="flex items-start gap-3">
                <ProgramIcon
                    :program="programIcon(account.program)"
                    :size="16"
                    class="mt-0.5"
                />
                <div class="flex min-w-0 flex-col">
                    <span
                        class="truncate text-card text-text"
                        :title="account.label"
                        >{{ account.label }}</span
                    >
                    <span class="text-small text-text-3">{{ subtext }}</span>
                </div>
            </div>
            <p class="text-text-2">{{ consequence }}</p>
        </div>
        <template #footer>
            <span class="flex-1" />
            <Button @click="emit('close')">Cancel</Button>
            <Button
                variant="danger"
                :pending="removing.processing"
                @click="confirm"
                >Remove</Button
            >
        </template>
    </Modal>
</template>
