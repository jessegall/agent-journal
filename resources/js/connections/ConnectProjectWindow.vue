<script setup lang="ts">
import type { ConnectProjectWindowData } from '@generated/types/connections';
import {
    revoke,
    revokeChosen as revokeChosenBindings,
} from '@generated/routes/connections/bindings';
import Button from '@kit/Button';
import Dialog from '@kit/Dialog';
import EmptyState from '@kit/EmptyState';
import { dateTimeWithZone } from '@kit/format';
import PageHeader from '@kit/PageHeader';
import StaleListNotice from '@kit/StaleListNotice';
import { usePage } from '@inertiajs/vue3';
import { router } from '@inertiajs/vue3';
import { keyedPost } from '@kit/keyedPost';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import BindingRow from './BindingRow.vue';
import InstallAttemptList from './InstallAttemptList.vue';
import InstallLinePanel from './InstallLinePanel.vue';
import ReleasePlatforms from './ReleasePlatforms.vue';

/**
 * The owner connects a project on another machine: the install line panel issues, replaces and cancels one line for
 * a new project or an environment to join, and keeps it to itself. Below are the connected folders, each with Revoke;
 * several are revoked at once by choosing them, or every one on a machine. When a reread fails the window keeps the
 * last verified list, says the journal is unreachable with when that list was read, and holds back every action that
 * needs the journal's word until a retry answers; a folder's state is never changed by a failed read.
 */
const props = defineProps<{ data: ConnectProjectWindowData }>();

const refusal = ref<string | null>(null);

/** Whether the Connect a project dialog, which makes the install line, is open. */
const connecting = ref(false);
// Whether the page was read again recently enough to trust a shown line is still the attempt's current one.
const fresh = ref(true);
let refreshing: ReturnType<typeof setInterval> | undefined;
// The one reread due when a shown folder's presence expires, so a row turns Offline at its deadline.
let deadline: ReturnType<typeof setTimeout> | undefined;
// Said once when a retry reached the journal again, for a screen reader.
const recovery = ref('');
// The row whose Revoke had focus when the journal became unreachable, to return to once it answers again.
let revokeRowBeforeOutage: string | null = null;
const retryButton = ref<{ $el: HTMLElement } | null>(null);
const page = usePage();
// The address that opened this window, such as a Settings group, so Back leads there; only a path on this journal.
const backAddress = computed(() => {
    const asked = new URL(page.url, 'http://journal.local').searchParams.get('return');

    return asked !== null && asked.startsWith('/') && !asked.startsWith('//') ? asked : null;
});
const list = ref<HTMLElement | null>(null);

/**
 * Reads the page again, as the attempts change by other tabs and devices, and settles what the read showed; only a
 * hidden tab skips the timed reads, never an asked-for retry.
 */
function refresh(): void {
    if (document.visibilityState !== 'visible') {
        return;
    }

    reread();
}

function reread(): void {
    let answered = false;
    router.reload({
        only: ['page'],
        onSuccess: () => (answered = true),
        onNetworkError: () => false,
        onFinish: () => settle(answered),
    });
}

/**
 * A failed read marks the list last known and, when Revoke had focus, hands it to Retry with the row remembered; the
 * first read that answers again clears that, says so once and puts focus back on the row, or on the list when the row
 * is gone. Focus anywhere else is left where it is.
 */
function settle(answered: boolean): void {
    if (!answered && fresh.value) {
        revokeRowBeforeOutage = rowOfFocusedRevoke();
        fresh.value = false;
        recovery.value = '';
        void nextTick(() => {
            if (revokeRowBeforeOutage !== null) {
                retryButton.value?.$el.querySelector('button')?.focus();
            }
        });

        return;
    }

    if (answered && !fresh.value) {
        fresh.value = true;
        recovery.value = 'The journal answered again; the list is up to date.';
        void nextTick(focusAfterRecovery);
    }
}

function rowOfFocusedRevoke(): string | null {
    const focused = document.activeElement;

    if (!(focused instanceof HTMLElement) || !focused.matches('button[aria-label^="Revoke connection for"]')) {
        return null;
    }

    return focused.closest('li[id^="binding-"]')?.id.slice('binding-'.length) ?? null;
}

function focusAfterRecovery(): void {
    const row = revokeRowBeforeOutage;
    revokeRowBeforeOutage = null;
    const lostFocus = document.activeElement === null || document.activeElement === document.body;

    if (row === null && !lostFocus) {
        return;
    }

    const surviving = row === null ? null : document.getElementById(`binding-${row}`);
    (surviving ?? list.value)?.focus();
}

watch(
    () => props.data.bindings.refreshAt,
    (refreshAt) => {
        clearTimeout(deadline);

        if (refreshAt !== null) {
            deadline = setTimeout(refresh, Math.max(Date.parse(refreshAt) - Date.parse(props.data.bindings.serverTime), 0) + 500);
        }
    },
    { immediate: true },
);

onMounted(() => {
    refreshing = setInterval(refresh, 5_000);
    window.addEventListener('focus', refresh);
    window.addEventListener('online', refresh);
});

onBeforeUnmount(() => {
    clearInterval(refreshing);
    clearTimeout(deadline);
    window.removeEventListener('focus', refresh);
    window.removeEventListener('online', refresh);
});
// The folders chosen to revoke together, and what came of each the last time.
const chosen = ref<Set<string>>(new Set());
const outcomes = ref<Record<string, string>>({});

const machines = computed(() => [
    ...new Set(
        props.data.bindings.rows
            .filter((binding) => binding.state !== 'revoked')
            .map((binding) => binding.machineLabel),
    ),
]);

function choose(bindingId: string, isChosen: boolean): void {
    const next = new Set(chosen.value);

    if (isChosen) {
        next.add(bindingId);
    } else {
        next.delete(bindingId);
    }

    chosen.value = next;
}

/**
 * Chooses every folder still connected on one machine, such as a laptop that was lost.
 */
function chooseMachine(machine: string): void {
    chosen.value = new Set(
        props.data.bindings.rows
            .filter(
                (binding) =>
                    binding.machineLabel === machine &&
                    binding.state !== 'revoked',
            )
            .map((binding) => binding.id),
    );
}

/**
 * Revokes every chosen folder in one action; each one's outcome comes back as the answer's flash and shows beside it.
 */
function revokeChosen(): void {
    keyedPost(
        revokeChosenBindings().url,
        { bindings: [...chosen.value] },
        crypto.randomUUID(),
        {
            onAccepted: (flash) => {
                outcomes.value =
                    (flash.revokedBindings as
                        | Record<string, string>
                        | undefined) ?? {};
                chosen.value = new Set();
            },
            onRefused: (reason) => (refusal.value = reason),
            onUncertain: () =>
                (refusal.value =
                    'The journal did not answer; look at each folder before revoking again.'),
        },
        ['page'],
    );
}

/**
 * Reads the next page of connected folders, in the same order.
 */
function nextBindings(): void {
    router.reload({ only: ['page'], data: { bindings: props.data.bindings.nextCursor } });
}

// The folders whose revoke was sent but whose answer was lost, so their row offers Retry while still connected.
const unconfirmedRevokes = ref<Set<string>>(new Set());

/**
 * Revokes one folder and reads only the page again. Once the journal answered, focus goes to the folder's row, or
 * to the list when the row left the page; a lost answer says so, reads the row's real state and keeps Retry; a
 * refusal stays beside the device it names, with what to do next.
 */
function revokeBinding(bindingId: string, deviceName: string): void {
    let answered = false;
    const unconfirmed = new Set(unconfirmedRevokes.value);
    unconfirmed.delete(bindingId);
    unconfirmedRevokes.value = unconfirmed;

    router.delete(revoke({ binding: bindingId }).url, {
        only: ['page'],
        preserveState: true,
        onSuccess: () => {
            answered = true;
            void nextTick(() => (document.getElementById(`binding-${bindingId}`) ?? list.value)?.focus());
        },
        onError: (errors) => {
            answered = true;
            const reason = Object.values(errors)[0] ?? 'the journal refused the revoke';
            outcomes.value = {
                ...outcomes.value,
                [bindingId]: `${deviceName}: ${reason}. Read the folder's state above, then revoke it again.`,
            };
        },
        onNetworkError: () => false,
        onFinish: () => {
            if (answered) {
                return;
            }

            outcomes.value = { ...outcomes.value, [bindingId]: 'Revoke not confirmed: the journal did not answer.' };
            unconfirmedRevokes.value = new Set([...unconfirmedRevokes.value, bindingId]);
            reread();
        },
    });
}
</script>

<template>
    <div class="mx-auto flex w-full max-w-[760px] flex-col gap-4 sm:pt-4">
        <template v-if="backAddress !== null">
            <div class="px-4 sm:px-0">
                <Button :href="backAddress" size="small" variant="ghost">Back</Button>
            </div>
        </template>
        <PageHeader title="Connect a project" :count="data.bindings.rows.length">
            <template #actions>
                <Button :disabled="!data.canIssue" @click="connecting = true">Connect a project</Button>
            </template>
        </PageHeader>
        <section class="flex flex-col gap-3 px-4 sm:px-0">
            <p>
                Run a project on your own computer and keep its tasks, plans and
                decisions on {{ data.serverName }} ({{ data.origin }}).
            </p>
            <template v-if="!data.canIssue">
                <p class="text-small text-muted-foreground">
                    This journal cannot connect a project yet, for the reasons below.
                </p>
            </template>
            <ReleasePlatforms :release="data.release" />
            <template v-if="refusal !== null">
                <p class="text-small text-danger">{{ refusal }}</p>
            </template>
        </section>
        <InstallAttemptList :attempts="data.attempts" :fresh="fresh" />
        <template v-if="!fresh">
            <StaleListNotice
                ref="retryButton"
                :reason="`The journal is unreachable; this list was read ${dateTimeWithZone(data.bindings.serverTime)}. Revoking and copying wait until it answers.`"
                @retry="reread"
            />
        </template>
        <p class="sr-only" role="status">{{ recovery }}</p>
        <template v-if="data.bindings.rows.length === 0">
            <EmptyState
                icon="connections"
                title="No projects connected yet"
                text="Connect a project to keep its work on this journal while it runs on your computer."
            >
                <Button :disabled="!data.canIssue" @click="connecting = true">Connect a project</Button>
            </EmptyState>
        </template>
        <template v-else>
            <div class="flex flex-wrap items-center gap-2 px-4 sm:px-0">
                <template v-for="machine in machines" :key="machine">
                    <Button
                        variant="ghost"
                        size="small"
                        :disabled="!fresh"
                        @click="chooseMachine(machine)"
                        >Choose all on {{ machine }}</Button
                    >
                </template>
                <span class="flex-1"></span>
                <Button
                    variant="danger"
                    size="small"
                    :disabled="chosen.size === 0 || !fresh"
                    @click="revokeChosen"
                    >Revoke chosen ({{ chosen.size }})</Button
                >
            </div>
            <ul
                ref="list"
                tabindex="-1"
                class="border-t border-line sm:overflow-hidden sm:rounded-card sm:border sm:bg-bg"
                aria-label="Connected projects"
            >
                <template v-for="binding in data.bindings.rows" :key="binding.id">
                    <BindingRow
                        :binding="binding"
                        :server-time="data.bindings.serverTime"
                        :is-chosen="chosen.has(binding.id)"
                        :is-stale="!fresh"
                        :outcome="outcomes[binding.id]"
                        :revoke-unconfirmed="unconfirmedRevokes.has(binding.id)"
                        @choose="choose(binding.id, $event)"
                        @revoke="revokeBinding(binding.id, $event)"
                    />
                </template>
            </ul>
            <template v-if="data.bindings.nextCursor !== null">
                <div class="px-4 sm:px-0">
                    <Button variant="ghost" size="small" @click="nextBindings">Show more folders</Button>
                </div>
            </template>
        </template>
        <Dialog :open="connecting" title="Connect a project" @close="connecting = false">
            <div class="flex flex-col gap-3">
                <p class="text-small text-muted-foreground">
                    Run this command in a terminal inside your project folder. It
                    works once, for ten minutes, and lets this server direct an agent
                    to read and change files in that folder.
                </p>
                <InstallLinePanel
                    :projects="data.projects"
                    :attempts="data.attempts.rows"
                    :fresh="fresh"
                />
            </div>
        </Dialog>
    </div>
</template>
