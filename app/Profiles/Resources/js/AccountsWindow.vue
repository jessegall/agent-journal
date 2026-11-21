<script setup lang="ts">
import type {
    AccountListData,
    AccountRowData,
} from '@generated/types/accounts';
import Button from '@kit/Button';
import EmptyState from '@kit/EmptyState';
import Icon from '@kit/Icon';
import PageHeader from '@kit/PageHeader';
import Spinner from '@kit/Spinner';
import { computed, nextTick, ref, watch } from 'vue';
import { useScrollAnchor } from '@kit/useScrollAnchor';
import { useIsStale } from '@kit/windowFreshness';
import AccountRecovery from './AccountRecovery.vue';
import AccountRow from './AccountRow.vue';
import AddAccountWizard from './AddAccountWizard.vue';
import { signInAgainLabel } from './accountLooks';
import {
    changeNumberOf,
    isChosen,
    newestSelections,
} from './accountSelections';
import { attemptToRejoin, isLive } from './signIn';
import type { WizardRequest } from './signIn';
import { useUsageClock } from './usageClock';

/**
 * The owner's saved Claude Code and Codex accounts in one list: which one new starts of each driver use, choosing
 * or renaming one, and adding one through the add-account wizard. A sign-in still waiting on the host is resumed from
 * the header. The page reloads on every change; a reload that answers an older choice never takes back a newer one,
 * by each driver's change number. Each row's usage line is chosen again when a window resets, a UTC month begins
 * or the window gets focus. A live update keeps the list where it was scrolled, and while the list is the last read
 * kept after a failed refresh, nothing can be added.
 */
const props = defineProps<{ data: AccountListData }>();

const selections = ref(props.data.selections);
const now = useUsageClock(() => props.data.rows);
const request = ref<WizardRequest | null>(null);
const isStale = useIsStale();
const list = ref<HTMLElement | null>(null);

useScrollAnchor(list, () => props.data.rows);

watch(
    () => props.data.selections,
    (arrived) =>
        (selections.value = newestSelections(selections.value, arrived)),
);

/**
 * The sign-in of a new account that still waits on the host, which the header offers to resume.
 */
const waitingSignIn = computed(() =>
    props.data.attempts.find(
        (attempt) => isLive(attempt) && attempt.accountId === null,
    ),
);

const root = ref<HTMLElement | null>(null);
const announcement = ref('');

/**
 * Closes the wizard and puts focus where the user goes on: Finish signing in for a sign-in left waiting, Add account
 * after a cancel, which is announced once, and the renewed account's row after a renewal.
 */
async function closeWizard(
    ending: 'waiting' | 'cancelled' | 'renewed' | 'shown' | 'closed',
    accountId?: string,
): Promise<void> {
    request.value = null;
    announcement.value = ending === 'cancelled' ? 'Sign-in cancelled.' : '';
    await nextTick();

    if (ending === 'closed') {
        return;
    }

    const target = {
        waiting: '[data-sign-in-resume]',
        cancelled: '[data-account-add]',
        renewed: `[data-account-row="${accountId}"]`,
        shown: `[data-account-row="${accountId}"]`,
    }[ending];
    root.value?.querySelector<HTMLElement>(target)?.focus();
}

function resumeOrAgain(row: AccountRowData): void {
    const running = attemptToRejoin(props.data.attempts, row.driver, row.id);

    request.value =
        running === undefined
            ? { kind: 'again', driver: row.driver, accountId: row.id }
            : { kind: 'resume', attemptId: running.id };
}
</script>

<template>
    <div ref="root" class="mx-auto flex w-full max-w-[760px] flex-col sm:pt-4">
        <PageHeader title="Accounts" :count="data.rows.length">
            <template #actions>
                <template v-if="waitingSignIn !== undefined && !isStale">
                    <Button
                        variant="bordered"
                        size="small"
                        data-sign-in-resume
                        @click="
                            request = {
                                kind: 'resume',
                                attemptId: waitingSignIn.id,
                            }
                        "
                        ><Spinner />Finish signing in</Button
                    >
                </template>
                <Button
                    variant="primary"
                    size="small"
                    data-account-add
                    :disabled="waitingSignIn !== undefined || isStale"
                    @click="request = { kind: 'new' }"
                    ><Icon name="plus" />Add account</Button
                >
            </template>
        </PageHeader>
        <template v-if="data.rows.length === 0">
            <div class="border-t border-line">
                <EmptyState
                    icon="accounts"
                    title="No saved accounts yet"
                    text="Add a Claude Code or Codex account to let agents start with it."
                >
                    <Button
                        variant="primary"
                        :disabled="waitingSignIn !== undefined || isStale"
                        @click="request = { kind: 'new' }"
                        ><Icon name="plus" />Add account</Button
                    >
                </EmptyState>
            </div>
        </template>
        <template v-else>
            <ul
                ref="list"
                class="border-t border-line [overflow-anchor:none] sm:overflow-hidden sm:rounded-card sm:border sm:bg-bg"
            >
                <template v-for="row in data.rows" :key="row.id">
                    <AccountRow
                        :account="row"
                        :is-chosen="isChosen(selections, row.driver, row.id)"
                        :selection-change-number="
                            changeNumberOf(selections, row.driver)
                        "
                        :now="now"
                        @sign-in-again="resumeOrAgain(row)"
                    >
                        <template
                            v-if="
                                attemptToRejoin(
                                    data.attempts,
                                    row.driver,
                                    row.id,
                                ) !== undefined
                            "
                        >
                            <Button
                                variant="bordered"
                                size="small"
                                @click="resumeOrAgain(row)"
                                ><Spinner />Finish signing in</Button
                            >
                        </template>
                        <template v-else-if="row.state === 'needs_sign_in'">
                            <Button
                                variant="bordered"
                                size="small"
                                @click="resumeOrAgain(row)"
                                >{{ signInAgainLabel(row) }}</Button
                            >
                        </template>
                    </AccountRow>
                </template>
            </ul>
        </template>
        <AccountRecovery :cleanups="data.pendingCleanups" />
        <AddAccountWizard
            :request="request"
            :methods="data.methods"
            :attempts="data.attempts"
            :rows="data.rows"
            @close="closeWizard"
        />
        <p class="sr-only" role="status">{{ announcement }}</p>
    </div>
</template>
