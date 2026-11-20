<script setup lang="ts">
import type { AccountRowData } from '@generated/types/accounts';
import {
    accountStart,
    remove,
    rename,
    retryCleanup,
} from '@generated/routes/accounts';
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
const isLeaving = computed(
    () =>
        props.account.state === 'removing' || props.account.state === 'removed',
);
const removing = useForm({});

const retrying = useForm({});

function retryAccountCleanup(): void {
    retrying.submit(retryCleanup({ account: props.account.id }), {
        preserveScroll: true,
        ...formSendingHooks(),
    });
}

function removeAccount(): void {
    removing.submit(remove({ account: props.account.id }), {
        preserveScroll: true,
        ...formSendingHooks(),
    });
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
            <template v-if="isChosen">
                <span class="text-small text-brand-text"
                    >Used for new starts</span
                >
            </template>
            <div class="ml-auto flex items-start gap-2">
                <span class="pt-1 text-small text-text-3 tabular-nums"
                    >{{ account.runningCount }} running</span
                >
                <template v-if="!isChosen && !isLeaving">
                    <ActivateAccount
                        :account-id="account.id"
                        :is-signed-in="account.state === 'signed_in'"
                    />
                </template>
                <Button
                    size="small"
                    :disabled="isRenaming"
                    @click="isRenaming = true"
                    >Rename</Button
                >
                <template v-if="!isLeaving">
                    <ConfirmAction
                        label="Remove"
                        question="Remove this account? It signs out and its folder is deleted once its work has ended."
                        confirm-label="Remove"
                        :pending="removing.processing"
                        @confirm="removeAccount"
                    />
                </template>
            </div>
        </div>
        <template v-if="account.identity">
            <p class="text-small text-text-3">
                {{ account.identity }}
            </p>
        </template>
        <template v-if="account.expiresAt !== null">
            <p class="text-small text-text-3">
                Its login expires {{ new Date(account.expiresAt).toLocaleDateString() }}.
            </p>
        </template>
        <template v-if="account.cleanupProblem !== null">
            <div class="flex items-center gap-2">
                <span class="text-small text-text-2">{{
                    cleanupProblemText[account.cleanupProblem]
                }}</span>
                <template v-if="account.awaitsCleanupRetry">
                    <Button
                        size="small"
                        :pending="retrying.processing"
                        @click="retryAccountCleanup"
                        >Retry cleanup</Button
                    >
                </template>
            </div>
        </template>
        <template v-if="isRenaming">
            <form class="flex items-end gap-2" @submit.prevent="saveName">
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
        </template>
        <template v-if="account.recentStarts.length > 0">
            <ul
                class="flex flex-wrap gap-2 text-small"
                aria-label="Recent starts"
            >
                <template
                    v-for="start in account.recentStarts"
                    :key="start.sessionId"
                >
                    <li>
                        <Link
                            :href="
                                accountStart({ session: start.sessionId }).url
                            "
                            class="text-brand-text underline"
                            >{{ start.isRunning ? 'Running since' : 'Started' }}
                            {{ start.startedAt }}</Link
                        >
                    </li>
                </template>
            </ul>
        </template>
        <slot v-if="!isLeaving" />
    </li>
</template>
