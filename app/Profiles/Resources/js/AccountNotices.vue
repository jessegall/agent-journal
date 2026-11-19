<script setup lang="ts">
import type {
    AccountNoticeReason,
    AccountNoticesData,
} from '@generated/types/accounts';
import { dismiss as dismissRoute } from '@generated/routes/accounts';
import { Link, useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import { formSendingHooks } from '@kit/usePageChanges';
import { programName } from './accountLooks';

/**
 * The bar's account notices on every page: what happened to a program's accounts in safe words, a link to the
 * Accounts page to act on it, and dismissing it.
 */
defineProps<{ data: AccountNoticesData }>();

const sentences: Record<AccountNoticeReason, string> = {
    no_account: 'has no account chosen, so its starts wait',
    needs_sign_in: 'needs its account signed in again',
    maintenance: 'is waiting while its account changes',
    sign_in_rejected: 'had a request rejected as signed out',
    account_limited: 'is limited by the provider for now',
};

const dismissing = useForm({});

function dismiss(noticeId: string): void {
    dismissing.submit(dismissRoute({ notice: noticeId }), {
        preserveScroll: true,
        ...formSendingHooks(),
    });
}
</script>

<template>
    <template v-if="data.notices.length > 0">
        <ul class="flex flex-col gap-1">
            <template v-for="notice in data.notices" :key="notice.id">
                <li class="flex items-center gap-2 text-small text-tone-warn">
                    <span
                        >{{ programName(notice.program) }}
                        {{ sentences[notice.reason] }}</span
                    >
                    <Link href="/accounts" class="text-brand-text underline"
                        >Accounts</Link
                    >
                    <Button
                        size="small"
                        :pending="dismissing.processing"
                        @click="dismiss(notice.id)"
                        >Dismiss</Button
                    >
                </li>
            </template>
        </ul>
    </template>
</template>
