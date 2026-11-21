<script setup lang="ts">
import type { TerminalSignInRowData } from '@generated/types/connections';
import { revoke as revokeSignIn } from '@generated/routes/connections/devices';
import ConfirmAction from '@kit/ConfirmAction';
import { dateTime } from '@kit/format';
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';

/**
 * A connected folder's terminal sign-ins, each by its reference, the account that approved it, when it was handed out
 * and until when, and where it stands. Revoking one asks first and ends that sign-in alone: the folder, its host and
 * every other terminal keep working.
 */
defineProps<{ signIns: TerminalSignInRowData[] }>();

const STATES: Record<string, string> = {
    pending: 'Waiting for approval',
    approved: 'Approved, not collected yet',
    issued: 'Signed in',
    expired: 'Expired',
    revoked: 'Revoked',
};

const pending = ref<string | null>(null);
const result = ref<string | null>(null);
const refusal = ref<string | null>(null);

function revoke(signIn: TerminalSignInRowData): void {
    pending.value = signIn.id;
    refusal.value = null;
    router.delete(revokeSignIn({ grant: signIn.id }).url, {
        only: ['page'],
        preserveState: true,
        onSuccess: () =>
            (result.value = `Terminal sign-in ${signIn.reference} lost command access. The folder and its other terminals keep working.`),
        onError: (errors) => (refusal.value = Object.values(errors)[0] ?? null),
        onFinish: () => (pending.value = null),
    });
}
</script>

<template>
    <details class="mt-1 text-small">
        <summary class="cursor-pointer text-text-2">Terminal access ({{ signIns.length }})</summary>
        <template v-if="signIns.length === 0">
            <p class="text-muted">No terminal signed in to this folder yet.</p>
        </template>
        <ul class="mt-1 flex flex-col gap-1">
            <template v-for="signIn in signIns" :key="signIn.id">
                <li class="flex flex-wrap items-center gap-2">
                    <span class="font-mono">{{ signIn.reference }}</span>
                    <span class="text-muted">approved by {{ signIn.approvedBy }}</span>
                    <template v-if="signIn.issuedAt !== null">
                        <span class="text-muted">since {{ dateTime(signIn.issuedAt) }}</span>
                    </template>
                    <template v-if="signIn.expiresAt !== null">
                        <span class="text-muted">until {{ dateTime(signIn.expiresAt) }}</span>
                    </template>
                    <span>{{ STATES[signIn.state] ?? signIn.state }}</span>
                    <template v-if="signIn.state !== 'revoked' && signIn.state !== 'expired'">
                        <ConfirmAction
                            label="Revoke terminal access"
                            :question="`All shells using sign-in ${signIn.reference} will lose access.`"
                            confirm-label="Revoke terminal access"
                            :pending="pending === signIn.id"
                            @confirm="revoke(signIn)"
                        />
                    </template>
                </li>
            </template>
        </ul>
        <template v-if="result !== null">
            <p class="text-text-2" role="status">{{ result }}</p>
        </template>
        <template v-if="refusal !== null">
            <p class="text-danger" role="alert">{{ refusal }}</p>
        </template>
    </details>
</template>
