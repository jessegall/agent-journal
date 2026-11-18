<script setup lang="ts">
import type { RunListData } from '@generated/types/processes';
import { Link } from '@inertiajs/vue3';
import PageHeader from '@kit/PageHeader';

/**
 * The project's newest runs: what each ran, whether it was a normal run or evidence only, and its lifecycle.
 */
defineProps<{ data: RunListData }>();
</script>

<template>
    <div class="flex flex-col gap-4">
        <PageHeader title="Runs" />
        <template v-if="data.runs.length === 0">
            <p>No run yet.</p>
        </template>
        <template v-else>
            <table>
                <thead>
                    <tr>
                        <th>Run</th>
                        <th>Operations</th>
                        <th>Kind of run</th>
                        <th>Lifecycle</th>
                        <th>Started</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="run in data.runs" :key="run.id">
                        <tr>
                            <td><Link :href="`/processes/runs/${run.id}`">{{ run.id }}</Link></td>
                            <td>{{ run.operations.join(', ') }}</td>
                            <td>{{ run.mode === 'evidence' ? 'evidence only' : 'normal' }}</td>
                            <td>{{ run.lifecycle }}</td>
                            <td>{{ run.startedAt }}</td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </template>
    </div>
</template>
