<script setup lang="ts">
import type { AccountRowData } from '@generated/types/accounts';
import { remove, rename } from '@generated/routes/accounts';
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import ConfirmAction from '@kit/ConfirmAction';
import StateBadge from '@kit/StateBadge';
import TextField from '@kit/TextField';
import { formSendingHooks } from '@kit/usePageChanges';
import { ref } from 'vue';
import ActivateAccount from './ActivateAccount.vue';
import { accountStateLook } from './accountLooks';

/**
 * One saved account: its name, state and identity, whether new launches use it and how many run on it, with choosing
 * it and renaming it. An account that must sign in again offers no choice; it is never switched to on its own.
 */
const props = defineProps<{ account: AccountRowData; isChosen: boolean }>();

const naming = useForm({ label: props.account.label });
const isRenaming = ref(false);
const removing = useForm({});

function removeAccount(): void {
    removing.submit(remove({ account: props.account.id }), { preserveScroll: true, ...formSendingHooks() });
}

function saveName(): void {
    naming.submit(rename({ account: props.account.id }), {
        preserveScroll: true,
        onSuccess: () => (isRenaming.value = false),
        ...formSendingHooks(),
    });
}
</script>

<template>
    <li class="flex flex-col gap-2 border-b border-border px-4 py-3">
        <div class="flex items-center gap-3">
            <span class="text-card text-text">{{ account.label }}</span>
            <StateBadge
                :label="accountStateLook[account.state].label"
                :tone="accountStateLook[account.state].tone"
            />
            <span v-if="isChosen" class="text-small text-brand-text"
                >Used for new launches</span
            >
            <div class="ml-auto flex items-start gap-2">
                <span class="pt-1 text-small text-text-3 tabular-nums"
                    >{{ account.runningCount }} running</span
                >
                <ActivateAccount
                    v-if="!isChosen"
                    :account-id="account.id"
                    :is-signed-in="account.state === 'signed_in'"
                />
                <Button
                    size="small"
                    :disabled="isRenaming"
                    @click="isRenaming = true"
                    >Rename</Button
                >
                <ConfirmAction
                    label="Remove"
                    question="Remove this account? It signs out and its folder is deleted once its work has ended."
                    confirm-label="Remove"
                    :pending="removing.processing"
                    @confirm="removeAccount"
                />
            </div>
        </div>
        <p v-if="account.identity" class="text-small text-text-3">
            {{ account.identity }}
        </p>
        <form
            v-if="isRenaming"
            class="flex items-end gap-2"
            @submit.prevent="saveName"
        >
            <TextField
                :id="`account-name-${account.id}`"
                v-model="naming.label"
                label="Name"
                :maxlength="80"
                :error="naming.errors.label"
            />
            <Button
                type="submit"
                variant="primary"
                size="small"
                :pending="naming.processing"
                >Save</Button
            >
            <Button size="small" @click="isRenaming = false">Cancel</Button>
        </form>
        <slot />
    </li>
</template>
