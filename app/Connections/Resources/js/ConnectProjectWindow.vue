<script setup lang="ts">
import type { ConnectProjectWindowData } from '@generated/types/connections';
import {
    revoke,
    revokeChosen as revokeChosenBindings,
} from '@generated/routes/connections/bindings';
import Button from '@kit/Button';
import PageHeader from '@kit/PageHeader';
import { router } from '@inertiajs/vue3';
import { keyedPost } from '@kit/keyedPost';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import BindingRow from './BindingRow.vue';
import InstallAttemptList from './InstallAttemptList.vue';
import InstallLinePanel from './InstallLinePanel.vue';
import ReleasePlatforms from './ReleasePlatforms.vue';

/**
 * The owner connects a project on another machine: the install line panel issues, replaces and cancels one line for
 * a new project or an environment to join, and keeps it to itself. Below are the connected folders, each with Revoke;
 * several are revoked at once by choosing them, or every one on a machine.
 */
const props = defineProps<{ data: ConnectProjectWindowData }>();

const refusal = ref<string | null>(null);
// Whether the page was read again recently enough to trust a shown line is still the attempt's current one.
const fresh = ref(true);
let refreshing: ReturnType<typeof setInterval> | undefined;

/**
 * Reads the page again, as the attempts change by other tabs and devices; a read that fails marks the line stale.
 */
function refresh(): void {
    if (document.visibilityState !== 'visible') {
        return;
    }

    let answered = false;
    router.reload({
        only: ['page'],
        onSuccess: () => (answered = true),
        onFinish: () => (fresh.value = answered),
    });
}

onMounted(() => {
    refreshing = setInterval(refresh, 5_000);
    window.addEventListener('focus', refresh);
});

onBeforeUnmount(() => {
    clearInterval(refreshing);
    window.removeEventListener('focus', refresh);
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
        <template v-if="data.bindings.rows.length > 0">
            <div class="flex flex-wrap items-center gap-2 px-4 sm:px-0">
                <template v-for="machine in machines" :key="machine">
                    <Button
                        variant="ghost"
                        size="small"
                        @click="chooseMachine(machine)"
                        >Choose all on {{ machine }}</Button
                    >
                </template>
                <span class="flex-1"></span>
                <Button
                    variant="danger"
                    size="small"
                    :disabled="chosen.size === 0"
                    @click="revokeChosen"
                    >Revoke chosen ({{ chosen.size }})</Button
                >
            </div>
            <ul
                class="border-t border-line sm:overflow-hidden sm:rounded-card sm:border sm:bg-bg"
            >
                <template v-for="binding in data.bindings.rows" :key="binding.id">
                    <BindingRow
                        :binding="binding"
                        :is-chosen="chosen.has(binding.id)"
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
