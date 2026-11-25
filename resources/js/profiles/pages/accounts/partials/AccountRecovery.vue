<script setup lang="ts">
import { useAppContext } from '@kit/appContext';
import type { PendingAttemptCleanupData } from '@generated/types/accounts';
import { retrySignInCleanup } from '@generated/routes/accounts';
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import { formSendingHooks } from '@kit/usePageChanges';
import { cleanupProblemText } from '../../../accountLooks';

const { driverLabel } = useAppContext();

/**
 * The unfinished sign-ins, of new accounts and reconnects, whose staging folder still waits for its cleanup. Each is
 * retried by its own attempt, even when its folder is already gone: the host still shows the driver's sign-in is
 * removed before the cleanup ends. A reconnect's saved account folder is never part of it.
 */
defineProps<{ cleanups: PendingAttemptCleanupData[] }>();

const retrying = useForm({});

function retry(attemptId: string): void {
    retrying.submit(retrySignInCleanup({ attempt: attemptId }), {
        preserveScroll: true,
        ...formSendingHooks(),
    });
}
</script>

<template>
    <template v-if="cleanups.length > 0">
        <section aria-label="Unfinished sign-ins" class="flex flex-col">
            <h2 class="px-4 pt-4 pb-1 text-small text-text-3">
                Unfinished sign-ins
            </h2>
            <ul>
                <template v-for="cleanup in cleanups" :key="cleanup.attemptId">
                    <li
                        class="flex items-center gap-3 border-b border-border px-4 py-3"
                    >
                        <span class="text-card text-text">{{
                            driverLabel(cleanup.driver)
                        }}</span>
                        <span class="text-small text-text-3">{{
                            cleanup.problem === null
                                ? 'Cleaning up…'
                                : cleanupProblemText[cleanup.problem]
                        }}</span>
                        <template v-if="cleanup.awaitsRetry">
                            <Button
                                class="ml-auto"
                                size="small"
                                :pending="retrying.processing"
                                @click="retry(cleanup.attemptId)"
                                >Retry cleanup</Button
                            >
                        </template>
                    </li>
                </template>
            </ul>
        </section>
    </template>
</template>
