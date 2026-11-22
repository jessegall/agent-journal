<script setup lang="ts">
import type {
    AccountListData,
    AccountRowData,
} from '@generated/types/accounts';
import type { WindowResult } from '@kit/PageTypes';
import { accountStart, activate, remove } from '@generated/routes/accounts';
import { Link, useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import Modal from '@kit/Modal';
import Field from '@kit/Field';
import { formSendingHooks } from '@kit/usePageChanges';
import { computed, nextTick, ref, useId, watch } from 'vue';
import AccountFactList from './AccountFactList.vue';
import AccountUsageDetails from './AccountUsageDetails.vue';
import { chosenIn } from './accountSelections';
import { useAccountNaming } from './accountNaming';
import { driverName, rowStateLook, signInAgainLabel } from './accountLooks';

/**
 * Everything about one account in one dialog: its way back when it must sign in again, its name, whether it is the
 * default, the facts the row leaves out, the usage its drivers reported and its recent starts. Removing it asks
 * inside the same dialog, with Back focused, so Enter never removes by accident.
 */
const props = defineProps<{
    account: AccountRowData;
    isChosen: boolean;
    selectionChangeNumber: number;
    isOpen: boolean;
    now: Date;
}>();
const emit = defineEmits<{
    close: [];
    signInAgain: [];
    removalRefused: [reason: string];
}>();

const isAskingToRemove = ref(false);
const back = ref<InstanceType<typeof Button> | null>(null);
// The name field's id per mount, so the same account open in two windows keeps two fields.
const fieldId = `account-name-${useId()}`;
const { naming, refusal, canSave, saved, revert, save } = useAccountNaming(
    () => props.account,
);
const choosing = useForm({});

/**
 * Why the journal refused the choice, such as another default chosen meanwhile in another tab; the rows already
 * show the server's choice again, so the owner can choose anew.
 */
const choiceRefusal = computed(
    () =>
        (choosing.errors as Record<string, string | undefined>).command ?? null,
);
const removing = useForm({});

const needsSignIn = computed(() => props.account.state === 'needs_sign_in');
const isLeaving = computed(
    () =>
        props.account.state === 'removing' || props.account.state === 'removed',
);
const canBeDefault = computed(
    () => props.account.state === 'signed_in' && !props.isChosen,
);

// Dates read as day, month, year and hours:minutes: 21 Nov 2026, 13:52.
const shortDate = new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});

function dateOf(moment: string | null): string {
    return moment === null ? 'Not yet' : shortDate.format(new Date(moment));
}

const running = computed(() => {
    const count = props.account.runningCount;

    if (count === 0) {
        return 'None';
    }

    return count === 1 ? '1 agent' : `${count} agents`;
});

const recentStartsTerm = 'Recent starts';
const useFacts = computed(() => {
    const facts = [
        { term: 'Default', value: '' },
        { term: 'Running now', value: running.value },
    ];

    if (props.account.recentStarts.length > 0) {
        facts.push({ term: recentStartsTerm, value: '' });
    }

    return facts;
});

const signInFacts = computed(() => [
    { term: 'State', value: rowStateLook(props.account).label },
    { term: 'Driver', value: driverName(props.account.driver) },
    { term: 'Method', value: props.account.signIn.title },
    { term: 'Billing', value: props.account.signIn.billingLabel },
    { term: 'Signed in as', value: props.account.identity ?? 'Not known' },
    { term: 'Workspace', value: props.account.workspace ?? 'Not known' },
    { term: 'Last checked', value: dateOf(props.account.checkedAt) },
    {
        term: 'Expires',
        value:
            props.account.expiresAt === null
                ? 'Never'
                : dateOf(props.account.expiresAt),
    },
]);

const isNameChanged = computed(() => naming.label !== props.account.label);

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

/**
 * Opens on the saved name; the focus stays where the dialog puts it, so nothing is selected or typed over.
 */
function opened(): void {
    revert();
}

/**
 * Escape in an edited name puts the saved name back and keeps the dialog open; a second Escape closes it.
 */
function escapeName(event: KeyboardEvent): void {
    if (!isNameChanged.value) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    revert();
}

/**
 * Makes the account the default at once on both rows: the old default loses its mark and this one gains it, until
 * the server answers. A choice made meanwhile by someone else refuses this one, and both rows show theirs.
 */
function makeDefault(): void {
    const { driver, id } = props.account;
    const changeNumber = props.selectionChangeNumber;

    choosing
        .transform(() => ({ expectedChangeNumber: changeNumber }))
        .optimistic<{ page: WindowResult<AccountListData> }>((shown) => {
            if (shown.page.state !== 'ready') {
                return {};
            }

            const selections = chosenIn(
                shown.page.data.selections,
                driver,
                id,
                changeNumber,
            );

            return {
                page: {
                    ...shown.page,
                    data: { ...shown.page.data, selections },
                },
            };
        })
        .submit(activate({ account: id }), {
            preserveScroll: true,
            ...formSendingHooks(),
        });
}

async function askToRemove(): Promise<void> {
    isAskingToRemove.value = true;
    await nextTick();
    (back.value?.$el as HTMLElement | undefined)?.focus();
}

/**
 * Removes the account once confirmed: its row reads Removing at once, until the page shows it gone or waiting for
 * its last session; a refusal is handed to the row, so it stays visible after the dialog closes.
 */
function confirmRemove(): void {
    const id = props.account.id;

    removing
        .optimistic<{ page: WindowResult<AccountListData> }>((shown) => {
            if (shown.page.state !== 'ready') {
                return {};
            }

            const rows = shown.page.data.rows.map((row) =>
                row.id === id ? { ...row, state: 'removing' as const } : row,
            );

            return {
                page: { ...shown.page, data: { ...shown.page.data, rows } },
            };
        })
        .submit(remove({ account: id }), {
            preserveScroll: true,
            onSuccess: () => emit('close'),
            onError: (errors) =>
                emit(
                    'removalRefused',
                    Object.values(errors)[0] ?? 'The account was not removed.',
                ),
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
        :title="isAskingToRemove ? 'Remove this account?' : account.label"
        @close="emit('close')"
        @opened="opened"
    >
        <template v-if="isAskingToRemove">
            <div class="flex flex-col gap-3">
                <div class="rounded border border-line px-3 py-2">
                    <span class="block truncate text-card text-text">{{
                        account.label
                    }}</span>
                    <span class="text-small text-text-3">{{
                        driverName(account.driver)
                    }}</span>
                </div>
                <p class="text-text-2">{{ consequence }}</p>
            </div>
        </template>
        <template v-else>
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
            <form @submit.prevent="canSave && save(() => undefined)">
                <Field
                    :id="fieldId"
                    v-model="naming.label"
                    label="Name"
                    :maxlength="80"
                    :error="refusal"
                    :hint="
                        naming.label.trim() === ''
                            ? 'A name is needed.'
                            : undefined
                    "
                    @keydown.esc="escapeName"
                >
                    <template #end>
                        <template v-if="canSave">
                            <Button
                                type="submit"
                                size="small"
                                :pending="naming.processing"
                                >Save</Button
                            >
                        </template>
                        <template v-else-if="saved">
                            <span
                                class="px-2 text-small text-tone-good"
                                aria-live="polite"
                                >✓ Saved</span
                            >
                        </template>
                    </template>
                </Field>
            </form>
            <section class="flex flex-col gap-2" aria-labelledby="account-use">
                <h4
                    id="account-use"
                    class="m-0 text-small font-semibold text-text-3"
                >
                    Use
                </h4>
                <AccountFactList :facts="useFacts">
                    <template #Default>
                        <span class="flex flex-wrap items-center gap-2">
                            <template v-if="isChosen">
                                <span
                                    class="rounded-badge border border-line px-1.5 text-[11px] leading-4 whitespace-nowrap text-text-2"
                                    >Default</span
                                >
                            </template>
                            <template v-else-if="canBeDefault">
                                <span class="text-text-2">No</span>
                                <Button
                                    variant="bordered"
                                    size="small"
                                    :pending="choosing.processing"
                                    @click="makeDefault"
                                    >Make default</Button
                                >
                                <template v-if="choiceRefusal !== null">
                                    <span
                                        class="basis-full text-small text-danger"
                                        role="alert"
                                        >{{ choiceRefusal }}</span
                                    >
                                </template>
                            </template>
                            <template v-else-if="needsSignIn">
                                <span class="text-text-2"
                                    >Sign in first to make it the default</span
                                >
                            </template>
                            <template v-else>
                                <span class="text-text-2">No</span>
                            </template>
                        </span>
                    </template>
                    <template #[recentStartsTerm]>
                        <ul class="m-0 flex list-none flex-col gap-1 p-0">
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
                                        {{ dateOf(start.startedAt) }}</Link
                                    >
                                </li>
                            </template>
                        </ul>
                    </template>
                </AccountFactList>
            </section>
            <section
                class="flex flex-col gap-2"
                aria-labelledby="account-sign-in"
            >
                <h4
                    id="account-sign-in"
                    class="m-0 text-small font-semibold text-text-3"
                >
                    Sign-in
                </h4>
                <AccountFactList :facts="signInFacts" />
            </section>
            <template v-if="account.usage !== undefined">
                <AccountUsageDetails :usage="account.usage" :now="now" />
            </template>
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
                    >Remove account</Button
                >
            </template>
            <template v-else>
                <template v-if="!isLeaving">
                    <Button size="small" @click="askToRemove"
                        >Remove account</Button
                    >
                </template>
                <span class="flex-1" />
                <Button @click="emit('close')">Close</Button>
            </template>
        </template>
    </Modal>
</template>
