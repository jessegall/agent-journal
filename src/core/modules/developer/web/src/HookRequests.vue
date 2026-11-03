<script setup>
import {computed, ref} from "vue";
import {WindowRoom, usePoll, useReadLine} from "@journal/window-kit";

const {value: requests, failure, load} = useReadLine(() => "developer hook-requests");
const rows = computed(() => requests.value?.rows ?? []);
const openedNumber = ref(0);
const opened = computed(() => rows.value.find((row) => row.id === openedNumber.value));
const shown = (value) => JSON.stringify(value, null, 2);
const isRefused = (row) => row.outcome === "refused";
const isSlow = (row) => !isRefused(row) && row.duration_ms >= 500;
const durationOf = (row) => `${Math.round(row.duration_ms)} ms`;

usePoll(load, () => true);
</script>

<template>
    <WindowRoom padding="0">
        <div class="requests" data-hook-requests>
            <section class="list" aria-label="Recorded requests">
                <div class="columns">
                    <span data-hook-column>Event</span>
                    <span data-hook-column>Tool</span>
                    <span class="parts" data-hook-column>Parts</span>
                    <span data-hook-column>Time</span>
                    <span data-hook-column>Duration</span>
                </div>
                <div class="list-scroll" data-hook-request-list>
                    <template v-if="failure">
                        <p class="note message" role="alert">{{ failure }}</p>
                    </template>
                    <template v-else-if="!rows.length">
                        <p class="note message">Nothing recorded yet. Record agent calls in the developer settings turns the log on.</p>
                    </template>
                    <template v-for="row in rows" :key="row.id">
                        <template v-if="row.day_start">
                            <div class="day" data-hook-day>{{ row.day }}<span>UTC</span></div>
                        </template>
                        <button type="button" :class="['row', {open: row.id === openedNumber, slow: isSlow(row), refused: isRefused(row)}]" :data-hook-request="row.id" :aria-pressed="row.id === openedNumber" :title="row.outcome" @click="openedNumber = row.id">
                            <span class="event">{{ row.event }}</span>
                            <span class="tool">{{ row.tool || '—' }}</span>
                            <span class="parts" data-hook-parts>{{ row.part_count || '' }}</span>
                            <time :datetime="row.received_at">{{ row.time }}</time>
                            <span class="duration">{{ durationOf(row) }}</span>
                        </button>
                    </template>
                </div>
            </section>
            <div class="divider" data-hook-request-divider role="separator" aria-orientation="vertical" />
            <section class="detail" data-hook-request-detail-area aria-label="Request details">
                <template v-if="opened">
                    <div data-hook-request-detail>
                        <div class="detail-head">
                            <h2>{{ opened.event }}</h2>
                            <span :class="{slow: isSlow(opened), refused: isRefused(opened)}">{{ opened.outcome }} · {{ durationOf(opened) }}</span>
                        </div>
                        <h3 class="heading">Headers</h3>
                        <pre data-hook-request-headers>{{ shown(opened.headers) }}</pre>
                        <h3 class="heading">Body</h3>
                        <pre data-hook-request-body>{{ shown(opened.body) }}</pre>
                    </div>
                </template>
                <template v-else>
                    <p class="note message">Select a request to see its headers and body.</p>
                </template>
            </section>
        </div>
    </WindowRoom>
</template>

<style scoped>
.requests {
    display: grid;
    grid-template-columns: minmax(360px, 46%) 1px minmax(0, 1fr);
    height: 100%;
    min-height: 0;
    overflow: hidden;
}

.list {
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
}

.list-scroll {
    flex: 1;
    min-height: 0;
    overflow: auto;
    overscroll-behavior: contain;
}

.columns,
.row {
    display: grid;
    grid-template-columns: minmax(105px, 1.4fr) minmax(52px, 0.7fr) 36px 96px 72px;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    font-size: 12px;
}

.columns {
    flex: none;
    border-bottom: 1px solid var(--border);
    color: var(--text-3);
}

.columns > :last-child,
.duration,
.parts {
    text-align: right;
}

.parts {
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.day {
    display: flex;
    justify-content: space-between;
    padding: 9px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--side);
    color: var(--text-3);
    font-size: 11px;
}

.row {
    width: 100%;
    border: 0;
    border-bottom: 1px solid var(--border);
    background: none;
    color: inherit;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
}

.row:hover,
.row.open {
    background: var(--surface-2, var(--border));
}

.event {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
}

.tool {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-3);
}

time,
.duration {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

.slow .duration,
.detail-head .slow {
    color: #c58b35;
}

.refused .event,
.refused .duration,
.detail-head .refused {
    color: #d76b6b;
}

.note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.detail {
    padding: 20px;
    min-width: 0;
    min-height: 0;
    overflow: auto;
    overscroll-behavior: contain;
}

.divider {
    background: var(--border);
}

.message {
    padding: 16px;
    line-height: 1.6;
}

.detail-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 24px;
    font-size: 12px;
    color: var(--text-3);
}

.detail-head h2 {
    margin: 0;
    color: var(--text);
    font-size: 14px;
}

.heading {
    margin: 0 0 8px;
    font-size: 12px;
}

pre {
    margin: 0 0 24px;
    padding: 12px;
    overflow: auto;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 12px;
    line-height: 1.6;
}

@media (max-width: 760px) {
    .requests {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: minmax(140px, 45%) 1px minmax(0, 1fr);
    }
}
</style>
