<script setup lang="ts">
import type { AccountRowData } from '@generated/types/accounts';
import { accountStart } from '@generated/routes/accounts';
import { Link } from '@inertiajs/vue3';
import Button from '@kit/Button';
import Modal from '@kit/Modal';
import { computed } from 'vue';
import { accountStateLook, programName } from './accountLooks';

/**
 * What the row leaves out of an account: how it signs in and bills, who it is signed in as and in which workspace, when
 * it was checked and expires, what runs on it now and its recent starts.
 */
const props = defineProps<{
    account: AccountRowData;
    isOpen: boolean;
}>();
const emit = defineEmits<{ close: [] }>();

function dateOf(moment: string | null): string {
    return moment === null ? 'Not yet' : new Date(moment).toLocaleString();
}

const facts = computed(() => [
    { term: 'Program', value: programName(props.account.program) },
    { term: 'Sign-in', value: props.account.signIn.title },
    { term: 'Billing', value: props.account.signIn.billingLabel },
    { term: 'Signed in as', value: props.account.identity ?? 'Not known' },
    { term: 'Workspace', value: props.account.workspace ?? 'Not known' },
    { term: 'State', value: accountStateLook[props.account.state].label },
    { term: 'Last checked', value: dateOf(props.account.checkedAt) },
    {
        term: 'Expires',
        value:
            props.account.expiresAt === null
                ? 'Never'
                : dateOf(props.account.expiresAt),
    },
    { term: 'Running now', value: String(props.account.runningCount) },
]);
</script>

<template>
    <Modal :is-open="isOpen" :title="account.label" @close="emit('close')">
        <div class="flex w-[400px] max-w-full flex-col gap-4">
            <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                <template v-for="fact in facts" :key="fact.term">
                    <dt class="text-text-3">{{ fact.term }}</dt>
                    <dd class="min-w-0 [overflow-wrap:anywhere] text-text">
                        {{ fact.value }}
                    </dd>
                </template>
            </dl>
            <template v-if="account.recentStarts.length > 0">
                <div class="flex flex-col gap-1">
                    <span class="text-text-3">Recent starts</span>
                    <ul class="flex flex-col gap-1">
                        <template
                            v-for="start in account.recentStarts"
                            :key="start.sessionId"
                        >
                            <li>
                                <Link
                                    :href="
                                        accountStart({
                                            session: start.sessionId,
                                        }).url
                                    "
                                    class="text-brand-text underline"
                                    >{{
                                        start.isRunning
                                            ? 'Running since'
                                            : 'Started'
                                    }}
                                    {{ start.startedAt }}</Link
                                >
                            </li>
                        </template>
                    </ul>
                </div>
            </template>
        </div>
        <template #footer>
            <span class="flex-1" />
            <Button @click="emit('close')">Close</Button>
        </template>
    </Modal>
</template>
