<script setup lang="ts">
import type { AccountListData, AccountRowData } from '@generated/types/accounts';
import EmptyState from '@kit/EmptyState';
import PageHeader from '@kit/PageHeader';
import { computed, ref, watch } from 'vue';
import AccountRecovery from './AccountRecovery.vue';
import AccountRow from './AccountRow.vue';
import SignInForm from './SignInForm.vue';
import { attemptToRejoin } from './signIn';
import { isChosen, newestSelections } from './accountSelections';
import { programName } from './accountLooks';

/**
 * The owner's saved Claude Code and Codex accounts, by program: which one new starts of each program use, and
 * choosing or renaming one. The page reloads on every change; a reload that answers an older choice never takes
 * back a newer one, by each program's change number.
 */
const props = defineProps<{ data: AccountListData }>();

const selections = ref(props.data.selections);

watch(
    () => props.data.selections,
    (arrived) => (selections.value = newestSelections(selections.value, arrived)),
);

const programs = computed(() => {
    const byProgram = new Map<string, AccountRowData[]>([
        ['claude-code', []],
        ['codex', []],
    ]);

    for (const row of props.data.rows) {
        byProgram.set(row.program, [...(byProgram.get(row.program) ?? []), row]);
    }

    return [...byProgram.entries()];
});
</script>

<template>
    <div class="flex flex-col">
        <PageHeader title="Accounts" :count="data.rows.length" />
        <EmptyState
            v-if="data.rows.length === 0"
            icon="accounts"
            title="No saved accounts yet"
            text="Sign in to a Claude Code or Codex account below to let agents start with it."
        />
        <template v-for="[program, rows] in programs" :key="program">
            <section :aria-label="programName(program)">
                <h2 class="px-4 pt-4 pb-1 text-small text-text-3">
                    {{ programName(program) }}
                </h2>
                <SignInForm
                    :program="program"
                    :account-id="null"
                    :running="attemptToRejoin(data.attempts, program, null)"
                />
                <ul>
                    <template v-for="row in rows" :key="row.id">
                        <AccountRow
                            :account="row"
                            :is-chosen="isChosen(selections, row.program, row.id)"
                        >
                            <SignInForm
                                :program="program"
                                :account-id="row.id"
                                :running="attemptToRejoin(data.attempts, program, row.id)"
                            />
                        </AccountRow>
                    </template>
                </ul>
            </section>
        </template>
        <AccountRecovery :cleanups="data.pendingCleanups" />
    </div>
</template>
