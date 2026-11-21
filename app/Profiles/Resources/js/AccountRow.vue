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
import ProgramIcon from '@kit/ProgramIcon';
import TextField from '@kit/TextField';
import { formSendingHooks } from '@kit/usePageChanges';
import { computed, ref } from 'vue';
import ActivateAccount from './ActivateAccount.vue';
import {
    accountStateLook,
    cleanupProblemText,
    programIcon,
    programName,
} from './accountLooks';

/**
 * One saved account in the list: its program's icon, its full name, a grey line with its program, what it bills and
 * whether new starts use it, its state in grey, and choosing, renaming and removing it. An account that must sign in
 * again offers no choice; it is never switched to on its own.
 */
const props = defineProps<{
    account: AccountRowData;
    billing: string;
    isChosen: boolean;
}>();

const subtext = computed(() =>
    [
        programName(props.account.program),
        props.billing,
        props.isChosen ? 'Chosen for new starts' : '',
    ]
        .filter((part) => part !== '')
        .join(' · '),
);

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
    <li
        class="group flex items-start gap-3 border-b border-line px-4 py-3 last:border-b-0"
    >
        <ProgramIcon
            :program="programIcon(account.program)"
            :size="16"
            class="mt-0.5"
        />
        <div class="flex min-w-0 flex-1 flex-col gap-1">
            <span
                class="leading-5 [overflow-wrap:anywhere] text-card text-text"
                >{{ account.label }}</span
            >
            <span class="text-small text-text-3">{{ subtext }}</span>
            <div class="flex flex-wrap items-center gap-2 pt-1">
                <span class="text-small text-text-3 tabular-nums"
                    >{{ account.runningCount }} running</span
                >
                <!-- The row's actions show while the row is hovered or one of them has the keyboard's focus. -->
                <span
                    class="flex flex-wrap items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"
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
                        <slot />
                    </template>
                </span>
            </div>
            <template v-if="account.identity">
                <p class="text-small text-text-3">
                    {{ account.identity }}
                </p>
            </template>
            <template v-if="account.expiresAt !== null">
                <p class="text-small text-text-3">
                    Expires
                    {{ new Date(account.expiresAt).toLocaleDateString() }}
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
                    <Button size="small" @click="isRenaming = false"
                        >Cancel</Button
                    >
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
                                    accountStart({ session: start.sessionId })
                                        .url
                                "
                                class="text-brand-text underline"
                                >{{
                                    start.isRunning
                                        ? 'Running since'
                                        : 'Started'
                                }}
                                {{ start.startedAt }}</Link
                            >
                        </li>
                    </template>
                </ul>
            </template>
        </div>
        <span class="ml-1 text-small leading-5 whitespace-nowrap text-text-3">{{
            accountStateLook[account.state].label
        }}</span>
    </li>
</template>
