<script setup lang="ts">
import type {
    InstallAttemptRowData,
    JoinTargetData,
} from '@generated/types/connections';
import {
    issue,
    revoke as cancelLine,
} from '@generated/routes/connections/invitations';
import Button from '@kit/Button';
import Field from '@kit/Field';
import Select from '@kit/Select';
import SegmentedControl from '@kit/SegmentedControl';
import { keyedPost } from '@kit/keyedPost';
import { router } from '@inertiajs/vue3';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import InstallLineField from './InstallLineField.vue';

/**
 * The owner's one install attempt in this window: a new project, or an environment of a connected one to join,
 * then Generate, Copy, Replace and Cancel. The line lives in this component alone, never in the page's props, the URL
 * or the history, and is dropped when it expires, is replaced or cancelled, or the window closes.
 */
const props = defineProps<{
    projects: JoinTargetData[];
    attempts: InstallAttemptRowData[];
    fresh: boolean;
}>();

type IssuedLine = {
    installLine: string;
    expiresAt: string;
    invitationId: string;
    attemptReference: string;
    attemptVersion: number;
};

type Target = 'new' | 'join';

const issuanceKey = crypto.randomUUID();
const target = ref<Target>('new');
const projectId = ref(props.projects[0]?.id ?? '');
const environmentId = ref('');
const issued = ref<IssuedLine | null>(null);
const pending = ref(false);
const refusal = ref<string | null>(null);
const notice = ref<string | null>(null);
let expiry: ReturnType<typeof setTimeout> | undefined;

const environments = computed(
    () =>
        props.projects.find((project) => project.id === projectId.value)
            ?.environments ?? [],
);
const canGenerate = computed(
    () => target.value === 'new' || environmentId.value !== '',
);

watch(
    projectId,
    () => (environmentId.value = environments.value[0]?.id ?? ''),
    { immediate: true },
);

watch(issued, (line) => {
    clearTimeout(expiry);

    if (line !== null) {
        expiry = setTimeout(
            () => drop('This install line expired. Make a new one.'),
            Date.parse(line.expiresAt) - Date.now(),
        );
    }
});

onBeforeUnmount(() => clearTimeout(expiry));

// The journal's own word on this window's attempt: once it moved on (replaced elsewhere, spent, cancelled or expired),
// the line shown here is no longer valid and goes at once.
watch(
    () => props.attempts,
    (rows) => {
        const line = issued.value;
        const row = rows.find(
            (each) => each.reference === line?.attemptReference,
        );

        if (line === null || row === undefined) {
            return;
        }

        if (row.state !== 'open' || row.version !== line.attemptVersion) {
            drop(
                row.state === 'spent'
                    ? 'This line was used: its folder is connected now.'
                    : 'This line no longer works.',
            );
        }
    },
);

function drop(message: string): void {
    issued.value = null;
    notice.value = message;
}

function targetBody(): Record<string, string> {
    return target.value === 'new'
        ? {}
        : { projectId: projectId.value, environmentId: environmentId.value };
}

/**
 * Issues the attempt's first line, or its next one by the attempt's reference and the version this window saw, so the
 * line before is refused from then on.
 */
function generate(): void {
    const replacing =
        issued.value === null
            ? {}
            : {
                  attemptReference: issued.value.attemptReference,
                  seenVersion: String(issued.value.attemptVersion),
              };
    pending.value = true;
    refusal.value = null;
    notice.value = null;
    keyedPost(
        issue().url,
        { issuanceKey, ...targetBody(), ...replacing },
        crypto.randomUUID(),
        {
            onAccepted: (flash) =>
                (issued.value =
                    (flash.issuedLine as IssuedLine | undefined) ?? null),
            onRefused: (reason) => (refusal.value = reason),
            onUncertain: () =>
                (refusal.value =
                    'The journal did not answer. Generate the line again.'),
            onFinish: () => (pending.value = false),
        },
    );
}

function cancel(): void {
    if (issued.value === null) {
        return;
    }

    const line = issued.value;
    pending.value = true;
    router.delete(cancelLine({ invitation: line.invitationId }).url, {
        data: { seenVersion: line.attemptVersion },
        only: ['page'],
        preserveState: true,
        onSuccess: () =>
            drop(
                'Cancelled. The line no longer works, and no project was made.',
            ),
        onError: (errors) => (refusal.value = Object.values(errors)[0] ?? null),
        onFinish: () => (pending.value = false),
    });
}
</script>

<template>
    <div class="flex flex-col gap-3">
        <template v-if="issued === null">
            <SegmentedControl
                v-model="target"
                label="What the line connects"
                :items="[
                    { value: 'new', label: 'New project' },
                    { value: 'join', label: 'Join a project' },
                ]"
            />
            <template v-if="target === 'join'">
                <template v-if="projects.length === 0">
                    <p class="text-small text-muted-foreground">
                        No project is connected yet, so there is nothing to
                        join.
                    </p>
                </template>
                <template v-else>
                    <Field id="join-project" label="Project">
                        <template #default="{ id }">
                            <Select
                                :id="id"
                                v-model="projectId"
                                :options="projects.map((project) => ({ value: project.id, label: project.label }))"
                            />
                        </template>
                    </Field>
                    <Field id="join-environment" label="Environment">
                        <template #default="{ id }">
                            <Select
                                :id="id"
                                v-model="environmentId"
                                :options="environments.map((environment) => ({ value: environment.id, label: environment.label }))"
                            />
                        </template>
                    </Field>
                </template>
            </template>
            <div>
                <Button
                    variant="primary"
                    :disabled="pending || !canGenerate"
                    @click="generate"
                    >Generate install line</Button
                >
            </div>
        </template>
        <template v-else>
            <InstallLineField
                :line="issued.installLine"
                :expires-at="issued.expiresAt"
                :is-fresh="fresh"
            />
            <p class="text-small text-muted-foreground">
                If nothing installs, check the journal's address and this
                install line. The folder is connected only once the installer
                says so.
            </p>
            <div class="flex gap-2">
                <Button
                    variant="bordered"
                    size="small"
                    :disabled="pending"
                    @click="generate"
                    >Replace</Button
                >
                <Button
                    variant="ghost"
                    size="small"
                    :disabled="pending"
                    @click="cancel"
                    >Cancel</Button
                >
            </div>
        </template>
        <template v-if="notice !== null">
            <p class="text-small text-muted-foreground" role="status">{{ notice }}</p>
        </template>
        <template v-if="refusal !== null">
            <p class="text-small text-danger" role="alert">{{ refusal }}</p>
        </template>
    </div>
</template>
