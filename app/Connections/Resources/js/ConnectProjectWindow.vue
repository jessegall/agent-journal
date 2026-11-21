<script setup lang="ts">
import type { ConnectProjectWindowData } from '@generated/types/connections';
import {
    revoke,
    revokeChosen as revokeChosenBindings,
} from '@generated/routes/connections/bindings';
import Button from '@kit/Button';
import EmptyState from '@kit/EmptyState';
import { dateTimeWithZone } from '@kit/format';
import PageHeader from '@kit/PageHeader';
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
                retryButton.value?.$el.focus();
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

function revokeBinding(bindingId: string): void {
    router.delete(revoke({ binding: bindingId }).url, {
        only: ['page'],
        preserveState: true,
        onError: (errors) => (refusal.value = Object.values(errors)[0] ?? null),
    });
}
</script>

<template>
    <div class="mx-auto flex w-full max-w-[760px] flex-col gap-4 sm:pt-4">
        <PageHeader title="Connect a project" :count="data.bindings.rows.length" />
        <section class="flex flex-col gap-3 px-4 sm:px-0">
            <p>
                Run a project on your own computer and keep its tasks, plans and
                decisions on {{ data.serverName }} ({{ data.origin }}).
            </p>
            <p class="text-small text-muted">
                This server can direct an agent to read and change files in your
                project. A line works once, for ten minutes.
            </p>
            <template v-if="!data.canIssue">
                <p class="text-small text-muted">
                    This journal is not issuing install lines.
                </p>
            </template>
            <template v-else>
                <InstallLinePanel
                    :projects="data.projects"
                    :attempts="data.attempts.rows"
                    :fresh="fresh"
                />
            </template>
            <ReleasePlatforms :release="data.release" />
            <template v-if="refusal !== null">
                <p class="text-small text-danger">{{ refusal }}</p>
            </template>
        </section>
        <InstallAttemptList :attempts="data.attempts" :fresh="fresh" />
        <template v-if="!fresh">
            <div
                role="alert"
                class="mx-4 flex flex-wrap items-center gap-3 rounded-card border border-tone-warn px-3 py-2 text-small sm:mx-0"
            >
                <span class="flex-1">
                    Journal unreachable. This is the last known list, read
                    {{ dateTimeWithZone(data.bindings.serverTime) }}. Revoking and copying wait until the journal
                    answers.
                </span>
                <Button ref="retryButton" variant="bordered" size="small" @click="reread">Retry</Button>
            </div>
        </template>
        <p class="sr-only" role="status">{{ recovery }}</p>
        <template v-if="data.bindings.rows.length === 0">
            <EmptyState
                icon="connections"
                title="No connected projects"
                text="Generate an install line above to connect a project from another machine."
            />
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
                        @choose="choose(binding.id, $event)"
                        @revoke="revokeBinding(binding.id)"
                    />
                </template>
            </ul>
            <template v-if="data.bindings.nextCursor !== null">
                <div class="px-4 sm:px-0">
                    <Button variant="ghost" size="small" @click="nextBindings">Show more folders</Button>
                </div>
            </template>
        </template>
    </div>
</template>
