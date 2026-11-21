<script setup lang="ts">
import type { AccountRowData } from '@generated/types/accounts';
import { retryCleanup } from '@generated/routes/accounts';
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import IconAction from '@kit/IconAction';
import DriverIcon from '@kit/DriverIcon';
import { formSendingHooks } from '@kit/usePageChanges';
import { computed, ref } from 'vue';
import AccountSettingsDialog from './AccountSettingsDialog.vue';
import {
    accountStateLook,
    cleanupProblemText,
    driverIcon,
    driverName,
} from './accountLooks';

/**
 * One saved account in the list: its driver's icon, its name, and one grey line with its driver, what it bills,
 * whether it is the default, its state and its expiry; on the right only its buttons, the way back for an account
 * that must sign in again and one settings button that opens everything else.
 */
const props = defineProps<{
    account: AccountRowData;
    isChosen: boolean;
}>();
const emit = defineEmits<{ signInAgain: [] }>();

const isLeaving = computed(
    () =>
        props.account.state === 'removing' || props.account.state === 'removed',
);
const billing = computed(
    () =>
        `${driverName(props.account.driver)} ${props.account.signIn.billingLabel.toLowerCase()}`,
);
const state = computed(() => accountStateLook[props.account.state]);
const stateColour: Record<string, string> = {
    good: 'bg-tone-good',
    warn: 'bg-tone-warn',
    danger: 'bg-danger',
    busy: 'bg-text-4',
    quiet: 'bg-text-4',
};
const isOpen = ref(false);
const retrying = useForm({});

function retryAccountCleanup(): void {
    retrying.submit(retryCleanup({ account: props.account.id }), {
        preserveScroll: true,
        ...formSendingHooks(),
    });
}
</script>

<template>
    <li
        class="flex items-center gap-3 border-b border-line py-[11px] pr-3 pl-4 last:border-b-0 hover:bg-hover"
    >
        <DriverIcon :driver="driverIcon(account.driver)" :size="16" />
        <div class="flex min-w-0 flex-1 flex-col gap-0.5">
            <span
                class="truncate leading-5 text-card text-text"
                :title="account.label"
                >{{ account.label }}</span
            >
            <div
                class="flex flex-wrap items-center gap-x-1.5 gap-y-px text-small text-text-3"
            >
                <span class="whitespace-nowrap">{{ billing }}</span>
                <template v-if="isChosen && !isLeaving">
                    <span class="text-text-4">·</span>
                    <span
                        class="rounded-badge bg-chip px-1.5 text-[11px] leading-4 text-text-2"
                        >Default</span
                    >
                </template>
                <span class="text-text-4">·</span>
                <span
                    class="inline-flex items-center gap-1.5 whitespace-nowrap"
                    :class="{ 'text-tone-warn': state.tone === 'warn' }"
                    ><span
                        class="size-1.5 rounded-full"
                        :class="stateColour[state.tone]"
                    ></span
                    >{{ state.label }}</span
                >
                <template v-if="account.expiresAt !== null">
                    <span class="text-text-4">·</span>
                    <span class="whitespace-nowrap text-text-4">
                        Expires
                        {{ new Date(account.expiresAt).toLocaleDateString() }}
                    </span>
                </template>
            </div>
            <template v-if="account.cleanupProblem !== null">
                <div class="mt-1 flex flex-wrap items-center gap-2">
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
        <div class="flex shrink-0 items-center gap-1.5">
            <template v-if="!isLeaving">
                <slot />
            </template>
            <IconAction
                icon="settings"
                tip="Settings"
                :label="`Settings of ${account.label}`"
                :icon-size="14"
                @click="isOpen = true"
            />
        </div>
        <AccountSettingsDialog
            :account="account"
            :is-chosen="isChosen"
            :is-open="isOpen"
            @close="isOpen = false"
            @sign-in-again="emit('signInAgain')"
        />
    </li>
</template>
