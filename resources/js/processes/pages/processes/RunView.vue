<script setup lang="ts">
import Button from '@kit/Button';
import type { RunWindowData } from '@generated/types/processes';
import { router, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import PartCard from './partials/PartCard.vue';

/**
 * One run with every part as a card, a native part of the run's layout page. The page is read again on every live change of the run, so what it shows is the
 * stored state, never a guess; a stop button ends the run's further parts.
 */
const data = defineProps<RunWindowData>();

const page = usePage<{ errors: Record<string, string> }>();
const refusal = computed(() => page.props.errors.review ?? '');
const running = computed(() => data.snapshot.isRunning);

/**
 * A stop asked for and taken by the server reads Stopping until the run reports it stopped; a refused stop clears it.
 */
const isStopAsked = ref(false);

const storedBytes = computed(() =>
    data.snapshot.parts.reduce(
        (total, part) =>
            total +
            Object.values(part.bytes).reduce((sum, bytes) => sum + bytes, 0),
        0,
    ),
);

function clean(): void {
    if (
        !window.confirm(
            `Remove ${storedBytes.value} bytes of stored output from this run? Its parts stay listed.`,
        )
    ) {
        return;
    }
    router.post(
        `/processes/runs/${data.snapshot.runId}/clean`,
        {},
        {
            headers: { 'Idempotency-Key': crypto.randomUUID() },
            preserveScroll: true,
        },
    );
}

function stop(): void {
    router.post(
        `/processes/runs/${data.snapshot.runId}/stop`,
        {},
        {
            headers: { 'Idempotency-Key': crypto.randomUUID() },
            preserveScroll: true,
            onStart: () => (isStopAsked.value = true),
            onError: () => (isStopAsked.value = false),
        },
    );
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <template v-if="data.snapshot.mode === 'evidence'">
            <p>
                A sample run: it shows what the command does and gives no
                result.
            </p>
        </template>
        <p>Status: {{ data.snapshot.lifecycle }}</p>
        <template v-if="data.stopReason !== null">
            <p>Stopped: {{ data.stopReason }}</p>
        </template>
        <template v-if="refusal !== ''">
            <p role="alert">{{ refusal }}</p>
        </template>
        <template v-if="running">
            <Button variant="bordered" :disabled="isStopAsked" @click="stop">
                {{ isStopAsked ? 'Stopping…' : 'Stop this run' }}
            </Button>
        </template>
        <template v-else>
            <Button variant="bordered" @click="clean">
                Remove stored output ({{ storedBytes }} bytes)
            </Button>
        </template>
        <template v-for="part in data.snapshot.parts" :key="part.id">
            <PartCard
                :part="part"
                :outputs="data.outputs[part.id] ?? []"
                :problems="data.problems[part.id] ?? []"
                :evidence-only="data.snapshot.mode === 'evidence'"
            />
        </template>
    </div>
</template>
