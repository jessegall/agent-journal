<script setup lang="ts">
import type { AccountRowData } from '@generated/types/accounts';
import { accountStart, activate, remove } from '@generated/routes/accounts';
import { Link, useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import Modal from '@kit/Modal';
import TextField from '@kit/TextField';
import { formSendingHooks } from '@kit/usePageChanges';
import { computed, nextTick, ref, watch } from 'vue';
import { useAccountNaming } from './accountNaming';
import {
    accountStateLook,
    driverName,
    signInAgainLabel,
} from './accountLooks';

/**
 * Everything about one account in one dialog: its way back when it must sign in again, its name, whether it is the
 * default, the facts the row leaves out and its recent starts. Removing it asks inside the same dialog, with Back
 * focused, so Enter never removes by accident.
 */
const props = defineProps<{
    account: AccountRowData;
    isChosen: boolean;
    isOpen: boolean;
}>();
const emit = defineEmits<{ close: []; signInAgain: [] }>();

const isAskingToRemove = ref(false);
const back = ref<InstanceType<typeof Button> | null>(null);
const fieldId = computed(() => `account-name-${props.account.id}`);
const { naming, canSave, startFrom, save } = useAccountNaming(
    () => props.account,
);
const choosing = useForm({});
const removing = useForm({});

const needsSignIn = computed(() => props.account.state === 'needs_sign_in');
const isLeaving = computed(
    () =>
        props.account.state === 'removing' || props.account.state === 'removed',
);
const canBeDefault = computed(
    () => props.account.state === 'signed_in' && !props.isChosen,
);

function dateOf(moment: string | null): string {
    return moment === null ? 'Not yet' : new Date(moment).toLocaleString();
}

const facts = computed(() => [
    { term: 'Driver', value: driverName(props.account.driver) },
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

const consequence = computed(() => {
    const running = props.account.runningCount;

    if (running === 0) {
        return "This signs it out. Agents can't use it anymore, and its files are deleted.";
    }

    const agents = running === 1 ? '1 agent is' : `${running} agents are`;

    return `This signs it out and deletes its files. ${agents} still using it; it goes away when they finish.`;
});

watch(
    () => props.isOpen,
    (isOpen) => {
        if (isOpen) {
            isAskingToRemove.value = false;
        }
    },
);

function opened(dialog: HTMLDialogElement): void {
    startFrom(dialog.querySelector<HTMLInputElement>(`#${fieldId.value}`));
}

function makeDefault(): void {
    choosing.submit(activate({ account: props.account.id }), {
        preserveScroll: true,
        ...formSendingHooks(),
    });
}

async function askToRemove(): Promise<void> {
    isAskingToRemove.value = true;
    await nextTick();
    (back.value?.$el as HTMLElement | undefined)?.focus();
}

function confirmRemove(): void {
    removing.submit(remove({ account: props.account.id }), {
        preserveScroll: true,
        onSuccess: () => emit('close'),
        ...formSendingHooks(),
    });
}

function signInAgain(): void {
    emit('close');
    emit('signInAgain');
}
</script>

<template>
    <Modal
        :is-open="isOpen"
        :title="isAskingToRemove ? 'Remove account' : account.label"
        @close="emit('close')"
        @opened="opened"
    >
        <template v-if="isAskingToRemove">
            <div class="flex w-[400px] max-w-full flex-col gap-3">
                <span class="truncate text-card text-text">{{
                    account.label
                }}</span>
                <p class="text-text-2">{{ consequence }}</p>
            </div>
        </template>
        <template v-else>
            <div class="flex w-[400px] max-w-full flex-col gap-5">
                <template v-if="needsSignIn">
                    <div
                        class="flex items-center justify-between gap-3 rounded border border-line px-3 py-2"
                    >
                        <span class="text-text-2"
                            >This account must sign in again.</span
                        >
                        <Button
                            variant="bordered"
                            size="small"
                            @click="signInAgain"
                            >{{ signInAgainLabel(account) }}</Button
                        >
                    </div>
                </template>
                <form
                    class="flex items-end gap-2"
                    @submit.prevent="canSave && save(() => undefined)"
                >
                    <div class="min-w-0 flex-1">
                        <TextField
                            :id="fieldId"
                            v-model="naming.label"
                            label="Name"
                            :maxlength="80"
                            :error="naming.errors.label"
                        />
                    </div>
                    <Button
                        type="submit"
                        :disabled="!canSave"
                        :pending="naming.processing"
                        >Save</Button
                    >
                </form>
                <template v-if="isChosen">
                    <p class="text-text-2">
                        This is the default account for new
                        {{ driverName(account.driver) }} starts.
                    </p>
                </template>
                <template v-else-if="canBeDefault">
                    <div>
                        <Button
                            variant="bordered"
                            size="small"
                            :pending="choosing.processing"
                            @click="makeDefault"
                            >Make default</Button
                        >
                    </div>
                </template>
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
        </template>
        <template #footer>
            <template v-if="isAskingToRemove">
                <span class="flex-1" />
                <Button ref="back" @click="isAskingToRemove = false"
                    >Back</Button
                >
                <Button
                    variant="danger"
                    :pending="removing.processing"
                    @click="confirmRemove"
                    >Remove</Button
                >
            </template>
            <template v-else>
                <template v-if="!isLeaving">
                    <Button variant="danger" @click="askToRemove"
                        >Remove account...</Button
                    >
                </template>
                <span class="flex-1" />
                <Button @click="emit('close')">Close</Button>
            </template>
        </template>
    </Modal>
</template>
