<script setup>
import {computed, ref} from "vue";
import {usePoll, useReadLine} from "@journal/window-kit";

const {value: requests, failure, load} = useReadLine(() => "developer hook-requests");
const rows = computed(() => requests.value?.rows ?? []);
const openedNumber = ref(0);
const opened = computed(() => rows.value.find((row) => row.id === openedNumber.value));
const eventOf = (row) => row.body?.event ?? row.body?.hook_event_name ?? "hook";
const toolOf = (row) => row.body?.tool?.name ?? row.body?.tool_name ?? "";
const shown = (value) => JSON.stringify(value, null, 2);

usePoll(load, () => true);
</script>

<template>
    <div class="requests" data-hook-requests>
        <template v-if="failure">
            <p class="note" role="alert">{{ failure }}</p>
        </template>
        <template v-else-if="!rows.length">
            <p class="note">Nothing recorded yet. Record agent calls in the developer settings turns the log on.</p>
        </template>
        <template v-else>
            <div class="list">
                <template v-for="row in rows" :key="row.id">
                    <button type="button" :class="['row', {open: row.id === openedNumber}]" :data-hook-request="row.id" @click="openedNumber = row.id">
                        <span class="event">{{ eventOf(row) }}</span>
                        <span class="note">{{ toolOf(row) }}</span>
                        <span class="note">{{ row.received_at }}</span>
                    </button>
                </template>
            </div>
            <template v-if="opened">
                <div class="detail" data-hook-request-detail>
                    <h3 class="heading">Headers</h3>
                    <pre data-hook-request-headers>{{ shown(opened.headers) }}</pre>
                    <h3 class="heading">Body</h3>
                    <pre data-hook-request-body>{{ shown(opened.body) }}</pre>
                </div>
            </template>
        </template>
    </div>
</template>

<style scoped>
.requests {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.list {
    display: flex;
    flex: 1 1 280px;
    flex-direction: column;
    gap: 2px;
}

.row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 6px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.row.open {
    background: var(--surface-2, var(--border));
}

.event {
    font-weight: 600;
}

.note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.detail {
    flex: 2 1 420px;
    min-width: 0;
}

.heading {
    margin: 0 0 4px;
    font-size: 12px;
}

pre {
    margin: 0 0 12px;
    padding: 8px;
    overflow: auto;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 12px;
}
</style>
