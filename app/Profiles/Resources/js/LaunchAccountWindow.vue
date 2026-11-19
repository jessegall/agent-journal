<script setup lang="ts">
import type { LaunchAccountData } from '@generated/types/accounts';
import PageHeader from '@kit/PageHeader';
import StateBadge from '@kit/StateBadge';
import { accountStateLook, programName } from './accountLooks';

/**
 * The account one launch ran with, for the owner: its name as it is now, also after the account was removed, its
 * state, and when the launch started and ended.
 */
defineProps<{ data: LaunchAccountData }>();
</script>

<template>
    <div class="flex flex-col">
        <PageHeader title="Launch account" />
        <dl class="flex flex-col gap-2 px-4 py-3 text-small">
            <div class="flex gap-2">
                <dt class="text-text-3">Account</dt>
                <dd class="flex items-center gap-2 text-text">
                    {{ data.accountLabel }}
                    <StateBadge
                        :label="accountStateLook[data.accountState].label"
                        :tone="accountStateLook[data.accountState].tone"
                    />
                </dd>
            </div>
            <div class="flex gap-2">
                <dt class="text-text-3">Program</dt>
                <dd class="text-text">{{ programName(data.program) }}</dd>
            </div>
            <div class="flex gap-2">
                <dt class="text-text-3">Started</dt>
                <dd class="text-text tabular-nums">{{ data.startedAt }}</dd>
            </div>
            <div class="flex gap-2">
                <dt class="text-text-3">Ended</dt>
                <dd class="text-text tabular-nums">{{ data.endedAt ?? 'Still running' }}</dd>
            </div>
        </dl>
    </div>
</template>
