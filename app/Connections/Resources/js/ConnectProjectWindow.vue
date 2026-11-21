<script setup lang="ts">
import type { ConnectProjectWindowData } from '@generated/types/connections';
import { revoke, revokeChosen as revokeChosenBindings } from '@generated/routes/connections/bindings';
import { issue } from '@generated/routes/connections/invitations';
import Button from '@kit/Button';
import PageHeader from '@kit/PageHeader';
import { router } from '@inertiajs/vue3';
import { keyedPost } from '@kit/keyedPost';
import { computed, ref } from 'vue';
import BindingRow from './BindingRow.vue';
import InstallLineField from './InstallLineField.vue';
import ReleasePlatforms from './ReleasePlatforms.vue';

/**
 * The owner connects a project on another machine: one Generate action issues a one-time install line, shown with
 * Copy and its expiry, and Replace issues another under the same action, which ends the first. The line lives in this
 * window alone, never in the page's props, the URL or the history, so closing the window drops it. Below are the
 * connected folders, each with Revoke; several are revoked at once by choosing them, or every one on a machine.
 */
const props = defineProps<{ data: ConnectProjectWindowData }>();

type IssuedLine = { installLine: string; expiresAt: string; invitationId: string };

const issuanceKey = crypto.randomUUID();
const issued = ref<IssuedLine | null>(null);
const pending = ref(false);
const refusal = ref<string | null>(null);
// The folders chosen to revoke together, and what came of each the last time.
const chosen = ref<Set<string>>(new Set());
const outcomes = ref<Record<string, string>>({});

const machines = computed(() => [
    ...new Set(props.data.bindings.filter((binding) => binding.state !== 'revoked').map((binding) => binding.machineLabel)),
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
        props.data.bindings
            .filter((binding) => binding.machineLabel === machine && binding.state !== 'revoked')
            .map((binding) => binding.id),
    );
}

/**
 * Revokes every chosen folder in one action; each one's outcome comes back as the answer's flash and shows beside it.
 */
function revokeChosen(): void {
    keyedPost(revokeChosenBindings().url, { bindings: [...chosen.value] }, crypto.randomUUID(), {
        onAccepted: (flash) => {
            outcomes.value = (flash.revokedBindings as Record<string, string> | undefined) ?? {};
            chosen.value = new Set();
        },
        onRefused: (reason) => (refusal.value = reason),
        onUncertain: () => (refusal.value = 'The journal did not answer; look at each folder before revoking again.'),
    }, ['page']);
}

/**
 * Issues a line through the page's own action, under a fresh request key each time, since Replace is meant to issue a
 * new one; the line arrives as the answer's one-time flash and lives in this component alone.
 */
function generate(): void {
    pending.value = true;
    refusal.value = null;
    keyedPost(issue().url, { issuanceKey }, crypto.randomUUID(), {
        onAccepted: (flash) => {
            const line = flash.issuedLine as IssuedLine | undefined;
            issued.value = line ?? null;
        },
        onRefused: (reason) => (refusal.value = reason),
        onUncertain: () => (refusal.value = 'The journal did not answer; generate the line again.'),
        onFinish: () => (pending.value = false),
    });
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
        <PageHeader title="Connect a project" :count="data.bindings.length" />
        <section class="flex flex-col gap-3 px-4 sm:px-0">
            <p>
                Run a project on your own computer and keep its tasks, plans and
                decisions on {{ data.serverName }}.
            </p>
            <p class="text-small text-muted">
                Connecting lets {{ data.serverName }} direct an agent that can
                read and change the files of that project.
            </p>
            <template v-if="!data.canIssue">
                <p class="text-small text-muted">
                    Connecting projects is switched off on this server, or its
                    release cannot connect a project yet.
                </p>
            </template>
            <template v-else-if="issued === null">
                <div>
                    <Button
                        variant="primary"
                        :disabled="pending"
                        @click="generate"
                        >Generate install line</Button
                    >
                </div>
            </template>
            <template v-else>
                <InstallLineField
                    :line="issued.installLine"
                    :expires-at="issued.expiresAt"
                />
                <div>
                    <Button
                        variant="bordered"
                        size="small"
                        :disabled="pending"
                        @click="generate"
                        >Replace</Button
                    >
                </div>
            </template>
            <ReleasePlatforms :release="data.release" />
            <template v-if="refusal !== null">
                <p class="text-small text-danger">{{ refusal }}</p>
            </template>
        </section>
        <template v-if="data.bindings.length > 0">
            <div class="flex flex-wrap items-center gap-2 px-4 sm:px-0">
                <template v-for="machine in machines" :key="machine">
                    <Button variant="ghost" size="small" @click="chooseMachine(machine)">Choose all on {{ machine }}</Button>
                </template>
                <span class="flex-1"></span>
                <Button variant="danger" size="small" :disabled="chosen.size === 0" @click="revokeChosen"
                    >Revoke chosen ({{ chosen.size }})</Button
                >
            </div>
            <ul
                class="border-t border-line sm:overflow-hidden sm:rounded-card sm:border sm:bg-bg"
            >
                <template v-for="binding in data.bindings" :key="binding.id">
                    <BindingRow
                        :binding="binding"
                        :is-chosen="chosen.has(binding.id)"
                        :outcome="outcomes[binding.id]"
                        @choose="choose(binding.id, $event)"
                        @revoke="revokeBinding(binding.id)"
                    />
                </template>
            </ul>
        </template>
    </div>
</template>
