<script setup lang="ts">
import type { AccountListData, AccountRowData } from '@generated/types/accounts';
import EmptyState from '@kit/EmptyState';
import PageHeader from '@kit/PageHeader';
import { computed } from 'vue';
import AccountRow from './AccountRow.vue';
import { programName } from './accountLooks';

/**
 * The owner's saved Claude Code and Codex accounts, by program: which one new launches of each program use, and
 * choosing or renaming one. Signing in is done from the program's own flow.
 */
const props = defineProps<{ data: AccountListData }>();

const programs = computed(() => {
    const byProgram = new Map<string, AccountRowData[]>();

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
            text="Sign in to a Claude Code or Codex account to let agents launch with it."
        />
        <template v-for="[program, rows] in programs" :key="program">
            <section :aria-label="programName(program)">
                <h2 class="px-4 pt-4 pb-1 text-small text-text-3">
                    {{ programName(program) }}
                </h2>
                <ul>
                    <template v-for="row in rows" :key="row.id">
                        <AccountRow :account="row" />
                    </template>
                </ul>
            </section>
        </template>
    </div>
</template>
