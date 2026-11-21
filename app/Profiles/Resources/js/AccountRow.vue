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
 * One saved account in the list: its driver's icon, its name, one grey line with its driver, what it bills and
 * whether it is the default, and on the right its state with its expiry and one settings button that opens everything
 * else. An account that must sign in again shows its way back right-aligned under its state.
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
const subtext = computed(() => {
    const line = `${driverName(props.account.driver)} ${props.account.signIn.billingLabel.toLowerCase()}`;

    return props.isChosen && !isLeaving.value ? `${line} · Default` : line;
});
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
        class="flex items-start gap-3 border-b border-line px-4 py-3 last:border-b-0 hover:bg-hover"
    >
        <DriverIcon
            :driver="driverIcon(account.driver)"
            :size="16"
            class="mt-1"
        />
        <div class="flex min-w-0 flex-1 flex-col gap-1">
            <span
                class="truncate leading-6 text-card text-text"
                :title="account.label"
                >{{ account.label }}</span
            >
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
        <div class="flex shrink-0 items-start gap-3">
            <div class="flex flex-col items-end gap-1.5">
                <span
                    class="text-small leading-6 whitespace-nowrap text-text-3"
                    >{{ accountStateLook[account.state].label }}</span
                >
                <template v-if="account.expiresAt !== null">
                    <span class="text-[11px] whitespace-nowrap text-text-4">
                        Expires
                        {{ new Date(account.expiresAt).toLocaleDateString() }}
                    </span>
                </template>
                <template v-if="!isLeaving">
                    <slot />
                </template>
            </div>
            <IconAction
                icon="settings"
                tip="Settings"
                :label="`Settings of ${account.label}`"
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
