<script setup lang="ts">
import type { ShareFiltersData, ShareListData } from '@/types/generated';
import { Link, router } from '@inertiajs/vue3';
import PageHeader from '@kit/PageHeader';
import { reactive } from 'vue';

/**
 * The owner's shares and proposals, newest first: filter by state, record type, gateway and expiry, and page on.
 * Proposals and failed shares are listed like every other; no address is ever part of the list.
 */
const props = defineProps<{ data: ShareListData }>();

const states = ['proposed', 'pending', 'active', 'failed', 'revoked', 'expired'] as const;

const filters = reactive({
    state: props.data.filters.state ?? '',
    rootType: props.data.filters.rootType ?? '',
    gateway: props.data.filters.gateway ?? '',
    expiresBefore: props.data.filters.expiresBefore ?? '',
});

function query(after: string | null): Partial<Record<keyof ShareFiltersData, string>> {
    const chosen = Object.entries({ ...filters, after: after ?? '' }).filter(([, value]) => value !== '');

    return Object.fromEntries(chosen);
}

function apply(): void {
    router.get('/sharing', query(null), { preserveScroll: true });
}

function nextPage(): void {
    router.get('/sharing', query(props.data.nextAfter), { preserveScroll: true });
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <PageHeader title="Shares" />
        <form class="flex flex-wrap items-end gap-2" aria-label="Filter shares" @submit.prevent="apply">
            <label class="flex flex-col">
                <span>State</span>
                <select v-model="filters.state">
                    <option value="">Any</option>
                    <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
                </select>
            </label>
            <label class="flex flex-col">
                <span>Record type</span>
                <input v-model="filters.rootType" type="text" />
            </label>
            <label class="flex flex-col">
                <span>Gateway</span>
                <input v-model="filters.gateway" type="text" />
            </label>
            <label class="flex flex-col">
                <span>Expires before</span>
                <input v-model="filters.expiresBefore" type="date" />
            </label>
            <button type="submit">Filter</button>
        </form>
        <p v-if="data.rows.length === 0">No share matches.</p>
        <table v-else>
            <thead>
                <tr>
                    <th>Share</th>
                    <th>State</th>
                    <th>Record</th>
                    <th>Gateway</th>
                    <th>Expires</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in data.rows" :key="row.id">
                    <td><Link :href="`/sharing/shares/${row.id}`">{{ row.isProposal ? 'Proposal' : 'Share' }} {{ row.number }}</Link></td>
                    <td>{{ row.state }}</td>
                    <td>{{ row.rootType }}</td>
                    <td>{{ row.gatewayKey ?? '' }}</td>
                    <td>{{ row.expiresAt }}</td>
                </tr>
            </tbody>
        </table>
        <button v-if="data.nextAfter" type="button" @click="nextPage">Older shares</button>
    </div>
</template>
