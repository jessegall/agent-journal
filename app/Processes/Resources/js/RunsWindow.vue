<script setup lang="ts">
import type { RunListData } from '@generated/types/processes';
import { Link } from '@inertiajs/vue3';
import PageHeader from '@kit/PageHeader';
import RowsTable from '@kit/RowsTable';

/**
 * The project's newest runs: what each ran, whether it was a normal run or evidence only, and its lifecycle.
 */
defineProps<{ data: RunListData }>();
</script>

<template>
    <div class="flex flex-col gap-4">
        <PageHeader title="Runs" />
        <RowsTable
            :headings="['Run', 'Operations', 'Kind of run', 'Lifecycle', 'Started']"
            :rows="data.runs"
            :row-key="(run) => run.id"
            empty="No run yet."
        >
            <template #row="{ row: run }">
                <td><Link :href="`/processes/runs/${run.id}`">{{ run.id }}</Link></td>
                <td>{{ run.operations.join(', ') }}</td>
                <td>{{ run.mode === 'evidence' ? 'evidence only' : 'normal' }}</td>
                <td>{{ run.lifecycle }}</td>
                <td>{{ run.startedAt }}</td>
            </template>
        </RowsTable>
    </div>
</template>
