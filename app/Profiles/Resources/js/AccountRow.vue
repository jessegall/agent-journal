<script setup lang="ts">
import type { AccountRowData } from '@generated/types/accounts';
import { activate, retryCleanup } from '@generated/routes/accounts';
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import IconAction from '@kit/IconAction';
import ProgramIcon from '@kit/ProgramIcon';
import { formSendingHooks } from '@kit/usePageChanges';
import { computed, ref } from 'vue';
import AccountDetailsDialog from './AccountDetailsDialog.vue';
import RemoveAccountDialog from './RemoveAccountDialog.vue';
import RenameAccountDialog from './RenameAccountDialog.vue';
import {
    accountStateLook,
    cleanupProblemText,
    programIcon,
    programName,
} from './accountLooks';

/**
 * One saved account in the list: its program's icon, its name with a pencil to rename it, one grey line with its
 * program and what it bills, and on the right its state, its details, a star for the default and a trash can to
 * remove it, each at the same place in every row. An account that must sign in again shows its way back in the bottom-right corner.
 */
const props = defineProps<{
    account: AccountRowData;
    isChosen: boolean;
}>();

const subtext = computed(
    () =>
        `${programName(props.account.program)} ${props.account.signIn.billingLabel.toLowerCase()}`,
);

const isLeaving = computed(
    () =>
        props.account.state === 'removing' || props.account.state === 'removed',
);
const canBeDefault = computed(
    () => props.account.state === 'signed_in' && !isLeaving.value,
);
const isRenaming = ref(false);
const isRemoving = ref(false);
const isShowingDetails = ref(false);

const choosing = useForm({});
const retrying = useForm({});

function makeDefault(): void {
    choosing.submit(activate({ account: props.account.id }), {
        preserveScroll: true,
        ...formSendingHooks(),
    });
}

function retryAccountCleanup(): void {
    retrying.submit(retryCleanup({ account: props.account.id }), {
        preserveScroll: true,
        ...formSendingHooks(),
    });
}
</script>

<template>
    <li
        class="group flex items-start gap-3 border-b border-line px-4 py-3 last:border-b-0 hover:bg-hover"
    >
        <ProgramIcon
            :program="programIcon(account.program)"
            :size="16"
            class="mt-1"
        />
        <div class="flex min-w-0 flex-1 flex-col gap-1">
            <div class="flex min-w-0 items-center gap-1">
                <span
                    class="truncate leading-6 text-card text-text"
                    :title="account.label"
                    >{{ account.label }}</span
                >
                <span
                    class="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100"
                >
                    <IconAction
                        icon="pencil"
                        tip="Rename"
                        :label="`Rename ${account.label}`"
                        @click="isRenaming = true"
                    />
                </span>
            </div>
            <span class="truncate text-small text-text-3">{{ subtext }}</span>
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
        </div>
        <div class="flex shrink-0 flex-col items-end gap-1.5">
            <div class="flex items-center gap-3">
                <!-- The star and the trash can keep their places in every row, so they line up down the list. -->
                <span class="flex items-center gap-3">
                    <span
                        class="inline-flex size-6 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100"
                    >
                        <IconAction
                            icon="info"
                            tip="Details"
                            :label="`Details of ${account.label}`"
                            @click="isShowingDetails = true"
                        />
                    </span>
                    <span class="inline-flex size-6">
                        <template v-if="isChosen && !isLeaving">
                            <IconAction
                                icon="star-filled"
                                tip="Default"
                                :label="`${account.label} is the default`"
                                :is-pressed="true"
                            />
                        </template>
                        <template v-else-if="canBeDefault">
                            <span
                                class="opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100"
                            >
                                <IconAction
                                    icon="star"
                                    tip="Make default"
                                    :label="`Make ${account.label} the default`"
                                    :is-pressed="false"
                                    @click="makeDefault"
                                />
                            </span>
                        </template>
                    </span>
                    <span
                        class="inline-flex size-6 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100"
                    >
                        <template v-if="!isLeaving">
                            <IconAction
                                icon="trash"
                                tip="Remove"
                                :label="`Remove ${account.label}`"
                                @click="isRemoving = true"
                            />
                        </template>
                    </span>
                </span>
                <span class="flex w-20 flex-col items-end">
                    <span
                        class="text-small leading-6 whitespace-nowrap text-text-3"
                        >{{ accountStateLook[account.state].label }}</span
                    >
                    <template v-if="account.expiresAt !== null">
                        <span class="text-[11px] whitespace-nowrap text-text-4">
                            Expires
                            {{
                                new Date(account.expiresAt).toLocaleDateString()
                            }}
                        </span>
                    </template>
                </span>
            </div>
            <template v-if="!isLeaving">
                <slot />
            </template>
        </div>
        <AccountDetailsDialog
            :account="account"
            :is-open="isShowingDetails"
            @close="isShowingDetails = false"
        />
        <RenameAccountDialog
            :account="account"
            :is-open="isRenaming"
            @close="isRenaming = false"
        />
        <RemoveAccountDialog
            :account="account"
            :subtext="subtext"
            :is-open="isRemoving"
            @close="isRemoving = false"
        />
    </li>
</template>
