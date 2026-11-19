<script setup lang="ts">
import type { AccountRowData } from '@generated/types/accounts';
import { accountStart, remove, rename, retryCleanup } from '@generated/routes/accounts';
import { Link } from '@inertiajs/vue3';
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import ConfirmAction from '@kit/ConfirmAction';
import StateBadge from '@kit/StateBadge';
import TextField from '@kit/TextField';
import { formSendingHooks } from '@kit/usePageChanges';
import { computed, ref } from 'vue';
import ActivateAccount from './ActivateAccount.vue';
import { accountStateLook, cleanupProblemText } from './accountLooks';

/**
 * One saved account: its name, state and identity, whether new starts use it and how many run on it, with choosing
 * it and renaming it. An account that must sign in again offers no choice; it is never switched to on its own.
 */
const props = defineProps<{ account: AccountRowData; isChosen: boolean }>();

const naming = useForm({ label: props.account.label });
const isRenaming = ref(false);
const isLeaving = computed(() => props.account.state === 'removing' || props.account.state === 'removed');
const removing = useForm({});

const retrying = useForm({});

function retryAccountCleanup(): void {
    retrying.submit(retryCleanup({ account: props.account.id }), { preserveScroll: true, ...formSendingHooks() });
}

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
                >Used for new starts</span
            >
            <div class="ml-auto flex items-start gap-2">
                <span class="pt-1 text-small text-text-3 tabular-nums"
                    >{{ account.runningCount }} running</span
                >
                <ActivateAccount
                    v-if="!isChosen && !isLeaving"
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
                    v-if="!isLeaving"
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
        <div v-if="account.cleanupProblem !== null" class="flex items-center gap-2">
            <span class="text-small text-text-2">{{ cleanupProblemText[account.cleanupProblem] }}</span>
            <Button
                v-if="account.awaitsCleanupRetry"
                size="small"
                :pending="retrying.processing"
                @click="retryAccountCleanup"
                >Retry cleanup</Button
            >
        </div>
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
        <ul
            v-if="account.recentStarts.length > 0"
            class="flex flex-wrap gap-2 text-small"
            aria-label="Recent starts"
        >
            <li v-for="start in account.recentStarts" :key="start.sessionId">
                <Link :href="accountStart({ session: start.sessionId }).url" class="text-brand-text underline"
                    >{{ start.isRunning ? 'Running since' : 'Started' }} {{ start.startedAt }}</Link
                >
            </li>
        </ul>
        <slot v-if="!isLeaving" />
    </li>
</template>
