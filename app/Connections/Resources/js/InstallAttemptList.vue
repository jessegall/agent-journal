<script setup lang="ts">
import { dateTime } from '@kit/format';
import type { InstallAttemptListData, InstallAttemptRowData } from '@generated/types/connections';
import { issue } from '@generated/routes/connections/invitations';
import Button from '@kit/Button';
import { keyedPost } from '@kit/keyedPost';
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import InstallLineField from './InstallLineField.vue';

/**
 * The owner's install attempts, newest first, by their reference, target and time, so two attempts with one target
 * are told apart. An open one offers Replace, which recovers a lost line as a new one; a spent one links to the
 * binding it made. A recovered line shows here once and is never shown again.
 */
const props = defineProps<{ attempts: InstallAttemptListData; fresh: boolean }>();

type RecoveredLine = { installLine: string; expiresAt: string; attemptReference: string };

const recovered = ref<RecoveredLine | null>(null);
const refusal = ref<string | null>(null);

const STATES: Record<string, string> = {
    open: 'Waiting to be installed',
    expired: 'Expired',
    cancelled: 'Cancelled',
    spent: 'Installed',
};

function replace(row: InstallAttemptRowData): void {
    refusal.value = null;
    keyedPost(issue().url, { issuanceKey: crypto.randomUUID(), attemptReference: row.reference }, crypto.randomUUID(), {
        onAccepted: (flash) => (recovered.value = (flash.issuedLine as RecoveredLine | undefined) ?? null),
        onRefused: (reason) => (refusal.value = reason),
        onUncertain: () => (refusal.value = 'The journal did not answer. Replace the line again.'),
    }, ['page']);
}

function olderPage(): void {
    router.reload({ only: ['page'], data: { attempts: props.attempts.nextCursor } });
}
</script>

<template>
    <section class="flex flex-col gap-2 px-4 sm:px-0" aria-label="Install attempts">
        <h2 class="text-text-2">Install attempts</h2>
        <template v-if="attempts.rows.length === 0">
            <p class="text-small text-muted">No install line was issued in the last 30 days.</p>
        </template>
        <ul class="flex flex-col gap-1">
            <template v-for="row in attempts.rows" :key="row.reference">
                <li class="flex flex-wrap items-center gap-2 text-small">
                    <span class="font-mono">{{ row.reference }}</span>
                    <span>{{ row.target }}</span>
                    <span class="text-muted">{{ dateTime(row.createdAt) }}</span>
                    <span>{{ STATES[row.state] ?? row.state }}</span>
                    <template v-if="row.state === 'open' || row.state === 'expired'">
                        <Button variant="bordered" size="small" @click="replace(row)">Replace</Button>
                    </template>
                    <template v-if="row.bindingId !== null">
                        <a :href="`#binding-${row.bindingId}`" class="underline">Open its folder</a>
                    </template>
                </li>
            </template>
        </ul>
        <template v-if="attempts.nextCursor !== null">
            <div>
                <Button variant="ghost" size="small" @click="olderPage">Show older attempts</Button>
            </div>
        </template>
        <template v-if="recovered !== null && fresh">
            <InstallLineField :line="recovered.installLine" :expires-at="recovered.expiresAt" />
        </template>
        <template v-if="refusal !== null">
            <p class="text-small text-danger" role="alert">{{ refusal }}</p>
        </template>
    </section>
</template>
