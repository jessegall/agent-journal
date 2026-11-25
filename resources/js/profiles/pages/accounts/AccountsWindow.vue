<script setup lang="ts">
import type {
    AccountListData,
    AccountRowData,
} from '@generated/types/accounts';
import Button from '@kit/Button';
import EmptyState from '@kit/EmptyState';
import Icon from '@kit/Icon';
import MenuGroup from '@kit/MenuGroup';
import MenuItem from '@kit/MenuItem';
import MenuItemLabel from '@kit/MenuItemLabel';
import MenuItemSub from '@kit/MenuItemSub';
import PageHeader from '@kit/PageHeader';
import SplitButton from '@kit/SplitButton';
import Spinner from '@kit/Spinner';
import { computed, nextTick, ref, watch } from 'vue';
import { useScrollAnchor } from '@kit/useScrollAnchor';
import { useIsStale } from '@kit/windowFreshness';
import { useGuidedCreation } from '@kit/guidedCreation';
import AccountRecovery from './partials/AccountRecovery.vue';
import AccountRow from './partials/AccountRow.vue';
import AddAccountWizard from './partials/AddAccountWizard.vue';
import { signInAgainLabel } from '../../accountLooks';
import {
    changeNumberOf,
    isChosen,
    newestSelections,
} from '../../accountSelections';
import { rejoinableAttempt, isLive, signInMethodOf } from '../../signIn';
import type { WizardRequest } from '../../signIn';
import { useUsageClock } from '../../usageClock';

/**
 * The owner's saved Claude Code and Codex accounts in one list, a native part of the Accounts layout: which one new starts of each driver use, choosing
 * or renaming one, and adding one through the add-account wizard. A sign-in still waiting on the host is resumed from
 * the header. The page reloads on every change; a reload that answers an older choice never takes back a newer one,
 * by each driver's change number. Each row's usage line is chosen again when a window resets, a UTC month begins
 * or the window gets focus. A live update keeps the list where it was scrolled, and while the list is the last read
 * kept after a failed refresh, nothing can be added.
 */
const data = defineProps<AccountListData>();

const selections = ref(data.selections);
const now = useUsageClock(() => data.rows);
const request = ref<WizardRequest | null>(null);
const isStale = useIsStale();
const list = ref<HTMLElement | null>(null);

useScrollAnchor(list, () => data.rows);

watch(
    () => data.selections,
    (arrived) =>
        (selections.value = newestSelections(selections.value, arrived)),
);

/**
 * The sign-in of a new account that still waits on the host, which the header offers to resume.
 */
const waitingSignIn = computed(() =>
    data.attempts.find(
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
        cancelled: '[data-account-add] button',
        renewed: `[data-account-row="${accountId}"]`,
        shown: `[data-account-row="${accountId}"]`,
    }[ending];
    root.value?.querySelector<HTMLElement>(target)?.focus();
}

/**
 * When rows go, such as the one whose settings were open, and the focus went with them, it lands on the first row
 * left, or on Add account when none is.
 */
watch(
    () => data.rows.map((row) => row.id),
    async (ids, before) => {
        if (before.every((id) => ids.includes(id))) {
            return;
        }

        await nextTick();

        if (
            root.value === null ||
            root.value.contains(document.activeElement)
        ) {
            return;
        }

        root.value
            .querySelector<HTMLElement>(
                '[data-account-row], [data-account-add] button',
            )
            ?.focus();
    },
);

const { ask } = useGuidedCreation();

/**
 * The split button's second way: an agent asks three questions, and its draft opens the wizard with them chosen.
 */
function setUpWithAgent(): void {
    ask({
        noun: 'account',
        onDraft: ({ fields }) => {
            request.value = {
                kind: 'drafted',
                driver: fields.driver,
                method: signInMethodOf(fields.method),
                name: fields.name,
            };
        },
    });
}

function resumeOrAgain(row: AccountRowData): void {
    const running = rejoinableAttempt(data.attempts, row.driver, row.id);

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
                <SplitButton
                    label="Add account"
                    icon="plus"
                    hint="Add it yourself"
                    noun="account"
                    data-account-add
                    :disabled="waitingSignIn !== undefined || isStale"
                    @create="request = { kind: 'new' }"
                >
                    <MenuGroup label="Add account">
                        <MenuItem @click="request = { kind: 'new' }">
                            <template #leading>
                                <Icon name="plus" :size="14" />
                            </template>
                            <MenuItemLabel>Add it yourself</MenuItemLabel>
                        </MenuItem>
                        <MenuItem data-account-guided @click="setUpWithAgent">
                            <template #leading>
                                <Icon name="speech" :size="14" />
                            </template>
                            <MenuItemLabel>Set it up with an agent</MenuItemLabel>
                            <MenuItemSub>An agent asks three short questions and drafts it.</MenuItemSub>
                        </MenuItem>
                    </MenuGroup>
                </SplitButton>
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
                                rejoinableAttempt(
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
                        <template v-else-if="row.state === 'unauthenticated'">
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
