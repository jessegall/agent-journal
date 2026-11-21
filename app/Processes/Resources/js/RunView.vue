<script setup lang="ts">
import type { RunWindowData } from '@generated/types/processes';
import { router, usePage } from '@inertiajs/vue3';
import PageHeader from '@kit/PageHeader';
import { computed } from 'vue';
import PartCard from './PartCard.vue';

/**
 * One run with every part as a card. The page is read again on every live change of the run, so what it shows is the
 * stored state, never a guess; a stop button ends the run's further parts.
 */
const props = defineProps<{ data: RunWindowData }>();

const page = usePage<{ errors: Record<string, string> }>();
const refusal = computed(() => page.props.errors.review ?? '');
const running = computed(
    () => !['ended', 'stopped', 'lost'].includes(props.data.snapshot.lifecycle),
);

const storedBytes = computed(() =>
    props.data.snapshot.parts.reduce(
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
        `/processes/runs/${props.data.snapshot.runId}/clean`,
        {},
        {
            headers: { 'Idempotency-Key': crypto.randomUUID() },
            preserveScroll: true,
        },
    );
}

function stop(): void {
    router.post(
        `/processes/runs/${props.data.snapshot.runId}/stop`,
        {},
        {
            headers: { 'Idempotency-Key': crypto.randomUUID() },
            preserveScroll: true,
        },
    );
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <PageHeader :title="`Run ${data.snapshot.runId}`" />
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
            <button type="button" @click="stop">Stop this run</button>
        </template>
        <template v-else>
            <button type="button" @click="clean">
                Remove stored output ({{ storedBytes }} bytes)
            </button>
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
