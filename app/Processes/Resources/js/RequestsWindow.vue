<script setup lang="ts">
import type { BundleRowData, RequestListData } from '@generated/types/processes';
import { Link, router } from '@inertiajs/vue3';
import PageHeader from '@kit/PageHeader';

/**
 * The project owner's review list: command requests and where each stands, the project's rules, and the module rule
 * bundles waiting for activation at their exact digest.
 */
defineProps<{ data: RequestListData }>();

function approveBundle(bundle: BundleRowData): void {
    router.post(
        '/processes/bundles/approval',
        { module: bundle.module, version: bundle.version, digest: bundle.digest },
        { headers: { 'Idempotency-Key': crypto.randomUUID() }, preserveScroll: true },
    );
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <PageHeader title="Command review" />
        <p>Classification does not grant permission.</p>
        <section aria-label="Command requests">
            <h2>Requests</h2>
            <template v-if="data.requests.length === 0">
                <p>No command request is waiting.</p>
            </template>
            <template v-else>
                <table>
                    <thead>
                        <tr>
                            <th>Request</th>
                            <th>Line</th>
                            <th>Why held</th>
                            <th>State</th>
                            <th>Next step</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="request in data.requests" :key="request.id">
                            <tr>
                                <td>
                                    <Link :href="`/processes/requests/${request.id}`">{{ request.operation }}</Link>
                                </td>
                                <td><code>{{ request.line }}</code></td>
                                <td>{{ request.holdReason }}</td>
                                <td>{{ request.state }}</td>
                                <td><code>{{ request.next }}</code></td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </template>
        </section>
        <section aria-label="Rules">
            <h2>Rules</h2>
            <template v-if="data.rules.length === 0">
                <p>The project has no rule of its own yet.</p>
            </template>
            <template v-else>
                <ul>
                    <template v-for="rule in data.rules" :key="rule.id">
                        <li>
                            {{ rule.ruleId }} ({{ rule.owner }}) revision {{ rule.revision }}: {{ rule.state }} -
                            {{ rule.reason }}
                        </li>
                    </template>
                </ul>
            </template>
        </section>
        <section aria-label="Module bundles waiting">
            <h2>Module bundles waiting</h2>
            <template v-if="data.bundles.length === 0">
                <p>No module bundle is waiting.</p>
            </template>
            <template v-else>
                <ul>
                    <template v-for="bundle in data.bundles" :key="`${bundle.module}@${bundle.digest}`">
                        <li>
                            <span>{{ bundle.module }} {{ bundle.version }} ({{ bundle.digest.slice(0, 12) }}):</span>
                            <span>{{ bundle.rules.join(', ') }}</span>
                            <button type="button" @click="approveBundle(bundle)">Activate this bundle</button>
                        </li>
                    </template>
                </ul>
            </template>
        </section>
    </div>
</template>
