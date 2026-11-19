<script setup lang="ts">
import type { PendingAttemptCleanupData } from '@generated/types/accounts';
import { retrySignInCleanup } from '@generated/routes/accounts';
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import { formSendingHooks } from '@kit/usePageChanges';
import { cleanupProblemText, programName } from './accountLooks';

/**
 * The unfinished new-account sign-ins whose folder still waits for its cleanup. No account row exists for them, so
 * each is retried by its own attempt, even when its folder is already gone: the host still shows the program's
 * sign-in is removed before the cleanup ends.
 */
defineProps<{ cleanups: PendingAttemptCleanupData[] }>();

const retrying = useForm({});

function retry(attemptId: string): void {
    retrying.submit(retrySignInCleanup({ attempt: attemptId }), { preserveScroll: true, ...formSendingHooks() });
}
</script>

<template>
    <section v-if="cleanups.length > 0" aria-label="Unfinished sign-ins" class="flex flex-col">
        <h2 class="px-4 pt-4 pb-1 text-small text-text-3">Unfinished sign-ins</h2>
        <ul>
            <li
                v-for="cleanup in cleanups"
                :key="cleanup.attemptId"
                class="flex items-center gap-3 border-b border-border px-4 py-3"
            >
                <span class="text-card text-text">{{ cleanup.label ?? programName(cleanup.program) }}</span>
                <span class="text-small text-text-3">{{
                    cleanup.problem === null ? 'Cleaning up…' : cleanupProblemText[cleanup.problem]
                }}</span>
                <Button
                    v-if="cleanup.awaitsRetry"
                    class="ml-auto"
                    size="small"
                    :pending="retrying.processing"
                    @click="retry(cleanup.attemptId)"
                    >Retry cleanup</Button
                >
            </li>
        </ul>
    </section>
</template>
