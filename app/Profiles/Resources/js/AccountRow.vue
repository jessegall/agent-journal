<script setup lang="ts">
import { dateOnly } from '@kit/format';
import type { AccountRowData } from '@generated/types/accounts';
import { retryCleanup } from '@generated/routes/accounts';
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import IconAction from '@kit/IconAction';
import DriverIcon from '@kit/DriverIcon';
import { formSendingHooks } from '@kit/usePageChanges';
import { computed, ref } from 'vue';
import { useIsStale } from '@kit/windowFreshness';
import AccountSettingsDialog from './AccountSettingsDialog.vue';
import { usageLine } from './accountUsage';
import {
    rowStateLook,
    cleanupProblemText,
    driverIcon,
    driverName,
} from './accountLooks';

/**
 * One saved account in the list: its driver's icon, its name, and one grey line with its driver, what it bills,
 * whether it is the default, its state and its expiry, and under it one line of the usage its programs reported;
 * on the right only its buttons, the way back for an account that must sign in again and one settings button that
 * opens everything else. A row of a list kept after a failed refresh offers none of them.
 */
const props = withDefaults(
    defineProps<{
        account: AccountRowData;
        isChosen: boolean;
        selectionChangeNumber?: number;
        now?: Date;
    }>(),
    { now: () => new Date(), selectionChangeNumber: 0 },
);
const emit = defineEmits<{ signInAgain: [] }>();

const isLeaving = computed(
    () =>
        props.account.state === 'removing' || props.account.state === 'removed',
);
const billing = computed(
    () =>
        `${driverName(props.account.driver)} ${props.account.signIn.billingLabel.toLowerCase()}`,
);
const state = computed(() => rowStateLook(props.account));
// The state reads in neutral text: weight marks the one that wants the user, muted red only an error.
const stateText: Record<string, string> = {
    good: 'text-text-2',
    warn: 'font-medium text-text',
    danger: 'text-danger',
    busy: 'text-text-4',
    quiet: 'text-text-4',
};
const usage = computed(() => usageLine(props.account.usage, props.now));
const isOpen = ref(false);
const isStale = useIsStale();
// Why removing this account was refused, kept on the row after its dialog closed.
const removalRefusal = ref<string | null>(null);
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
        :data-account-row="account.id"
        tabindex="-1"
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
                        class="rounded-badge border border-line px-1.5 text-[11px] leading-4 text-text-2"
                        >Default</span
                    >
                </template>
                <span class="text-text-4">·</span>
                <span
                    class="whitespace-nowrap"
                    :class="stateText[state.tone]"
                    >{{ state.label }}</span
                >
                <template v-if="account.expiresAt !== null">
                    <span class="text-text-4">·</span>
                    <span class="whitespace-nowrap text-text-4">
                        Expires
                        {{ dateOnly(account.expiresAt) }}
                    </span>
                </template>
            </div>
            <template v-if="usage !== null">
                <span class="text-small text-text-2">{{ usage }}</span>
            </template>
            <template v-if="account.cleanupProblem !== null">
                <div class="mt-1 flex flex-wrap items-center gap-2">
                    <span class="text-small text-text-2">{{
                        cleanupProblemText[account.cleanupProblem]
                    }}</span>
                    <template v-if="account.awaitsCleanupRetry && !isStale">
                        <Button
                            size="small"
                            :pending="retrying.processing"
                            @click="retryAccountCleanup"
                            >Retry cleanup</Button
                        >
                    </template>
                </div>
            </template>
            <template v-if="removalRefusal !== null">
                <p class="mt-1 text-small text-danger" role="alert">
                    {{ removalRefusal }}
                </p>
            </template>
        </div>
        <div class="flex shrink-0 items-center gap-1.5">
            <template v-if="!isLeaving && !isStale">
                <slot />
            </template>
            <IconAction
                icon="settings"
                tip="Settings"
                :label="`Settings of ${account.label}`"
                :icon-size="14"
                tip-side="left"
                :disabled="isStale"
                @click="isOpen = true"
            />
        </div>
        <AccountSettingsDialog
            :account="account"
            :is-chosen="isChosen"
            :selection-change-number="selectionChangeNumber"
            :is-open="isOpen"
            :now="now"
            @close="isOpen = false"
            @sign-in-again="emit('signInAgain')"
            @removal-refused="(reason) => (removalRefusal = reason)"
        />
    </li>
</template>
