<script setup lang="ts">
import { dateTime } from '@kit/format';
import type { ShareFiltersData, ShareListData } from '@generated/types/sharing';
import { Link, router } from '@inertiajs/vue3';
import PageHeader from '@kit/PageHeader';
import RowsTable from '@kit/RowsTable';
import { computed, reactive } from 'vue';

/**
 * The owner's shares and proposals, newest first: filter by state, record type, gateway and expiry, and page on.
 * Proposals and failed shares are listed like every other; no address is ever part of the list.
 */
const props = defineProps<{ data: ShareListData }>();

const states = [
    'proposed',
    'pending',
    'active',
    'failed',
    'revoked',
    'expired',
] as const;

const filters = reactive({
    state: props.data.filters.state ?? '',
    rootType: props.data.filters.rootType ?? '',
    gateway: props.data.filters.gateway ?? '',
    expiresBefore: props.data.filters.expiresBefore ?? '',
});

// Whether the list is narrowed, so an empty one says no share matches rather than that none exists.
const hasFilter = computed(() => Object.values(props.data.filters).some((value) => value !== null && value !== ''));

function query(
    after: string | null,
): Partial<Record<keyof ShareFiltersData, string>> {
    const chosen = Object.entries({ ...filters, after: after ?? '' }).filter(
        ([, value]) => value !== '',
    );

    return Object.fromEntries(chosen);
}

function apply(): void {
    router.get('/sharing', query(null), { preserveScroll: true });
}

function nextPage(): void {
    router.get('/sharing', query(props.data.nextAfter), {
        preserveScroll: true,
    });
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <PageHeader title="Shares" />
        <form
            class="flex flex-wrap items-end gap-2"
            aria-label="Filter shares"
            @submit.prevent="apply"
        >
            <label class="flex flex-col">
                <span>State</span>
                <select v-model="filters.state">
                    <option value="">Any</option>
                    <template v-for="state in states" :key="state">
                        <option :value="state">{{ state }}</option>
                    </template>
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
        <RowsTable
            :headings="['Share', 'State', 'Record', 'Gateway', 'Expires']"
            :rows="data.rows"
            :row-key="(row) => row.id"
            :empty="hasFilter ? 'No share matches these filters.' : 'No shares yet.'"
        >
            <template #row="{ row }">
                <td>
                    <Link :href="`/sharing/shares/${row.id}`">{{ row.isProposal ? 'Proposal' : 'Share' }} {{ row.number }}</Link>
                </td>
                <td>{{ row.state }}</td>
                <td>{{ row.rootType }}</td>
                <td>{{ row.gatewayKey ?? '' }}</td>
                <td>{{ dateTime(row.expiresAt) }}</td>
            </template>
        </RowsTable>
        <template v-if="data.nextAfter">
            <button type="button" @click="nextPage">Older shares</button>
        </template>
    </div>
</template>
