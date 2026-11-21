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
import { computed, ref, watch } from 'vue';
import AccountRecovery from './AccountRecovery.vue';
import AccountRow from './AccountRow.vue';
import AddAccountWizard from './AddAccountWizard.vue';
import { signInAgainLabel } from './accountLooks';
import { isChosen, newestSelections } from './accountSelections';
import { attemptToRejoin, isLive } from './signIn';
import type { WizardRequest } from './signIn';

/**
 * The owner's saved Claude Code and Codex accounts in one list: which one new starts of each driver use, choosing
 * or renaming one, and adding one through the add-account wizard. A sign-in still waiting on the host is resumed from
 * the header. The page reloads on every change; a reload that answers an older choice never takes back a newer one,
 * by each driver's change number.
 */
const props = defineProps<{ data: AccountListData }>();

const selections = ref(props.data.selections);
const request = ref<WizardRequest | null>(null);

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

function resumeOrAgain(row: AccountRowData): void {
    const running = attemptToRejoin(props.data.attempts, row.driver, row.id);

    request.value =
        running === undefined
            ? { kind: 'again', driver: row.driver, accountId: row.id }
            : { kind: 'resume', attemptId: running.id };
}
</script>

<template>
    <div class="flex flex-col">
        <PageHeader title="Accounts" :count="data.rows.length">
            <template #actions>
                <template v-if="waitingSignIn !== undefined">
                    <Button
                        variant="bordered"
                        size="small"
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
                    :disabled="waitingSignIn !== undefined"
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
                        :disabled="waitingSignIn !== undefined"
                        @click="request = { kind: 'new' }"
                        ><Icon name="plus" />Add account</Button
                    >
                </EmptyState>
            </div>
        </template>
        <template v-else>
            <ul class="border-t border-line">
                <template v-for="row in data.rows" :key="row.id">
                    <AccountRow
                        :account="row"
                        :is-chosen="isChosen(selections, row.driver, row.id)"
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
            @close="request = null"
        />
    </div>
</template>
