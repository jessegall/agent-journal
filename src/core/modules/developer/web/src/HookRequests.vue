<script setup>
import {computed, ref, watch} from "vue";
import {Btn, MenuItem, MenuLabel, MenuPanel, WindowRoom, peekRef, toggleFilter, usePoll, useWindow} from "@journal/window-kit";
import ExecutionsInspector from "./ExecutionsInspector.vue";
import RequestDetails from "./RequestDetails.vue";
import {requestOutcomeLabel} from "./labels.js";
import {toggleFeedPause} from "./toggleFeedPause.js";
import {usePausedProp} from "./usePausedProp.js";

const key = "journal.hook-requests.filters";
const emptyFilters = () => ({category: [], family: [], sender: []});
function savedFilters() {
    try { return {...emptyFilters(), ...JSON.parse(localStorage.getItem(key) || "{}")}; }
    catch { return emptyFilters(); }
}
const filters = ref(savedFilters());
const paused = ref(false);
const options = ref({family: ["process bookkeeping"], sender: []});
const count = computed(() => Object.values(filters.value).reduce((sum, values) => sum + values.length, 0));
const view = useWindow();
const {data: requests, failure, loaded, reload: load} = usePausedProp(view, "requests", paused);
const filterArguments = {category: "categories", family: "families", sender: "senders"};
function setFilters(value) {
    for (const [name, values] of Object.entries(value)) view.state[`requests.${filterArguments[name]}`] = JSON.stringify(values);
}
setFilters(filters.value);
const rows = computed(() => requests.value?.rows ?? []);
watch(requests, (value) => {
    options.value.family = [...new Set(["process bookkeeping", ...(value.families || []), ...filters.value.family])].sort();
    options.value.sender = [...new Set([...(value.senders || []), ...filters.value.sender])].sort();
});
watch(filters, (value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    setFilters(value);
    if (!paused.value) load();
});
function toggle(name, value) { filters.value = toggleFilter(filters.value, name, value); }
const filterAnchor = ref(null);
const openedNumber = ref(0);
const queueOpen = ref(false);
const opened = computed(() => rows.value.find((row) => row.id === openedNumber.value));
const isRefused = (row) => row.outcome === "refused";
const isSlow = (row) => !isRefused(row) && row.duration_ms >= 500;
const durationOf = (row) => `${Math.round(row.duration_ms)} ms`;

function togglePause() {
    toggleFeedPause(paused, load);
}
usePoll(() => loaded.value && load(), () => !paused.value && view.visible.value);
</script>

<template>
    <WindowRoom padding="0">
        <div class="requests" data-hook-requests>
            <section class="list" aria-label="Recorded requests">
                <div class="toolbar">
                    <Btn small data-filter-open @click="filterAnchor = $event.currentTarget">Filters<template v-if="count"><span data-filter-count> ({{ count }})</span></template></Btn>
                    <Btn small data-feed-pause :aria-pressed="paused" @click="togglePause">{{ paused ? 'Resume' : 'Pause' }}</Btn>
                    <Btn small data-executions-open @click="queueOpen = true">Executions</Btn>
                    <template v-if="filterAnchor"><MenuPanel :anchor="filterAnchor" align="start" :min-width="220" :max-width="320" @close="filterAnchor = null">
                        <MenuLabel>Type</MenuLabel>
                        <template v-for="category in ['hook', 'viewer', 'command line']" :key="category"><MenuItem :data-filter-category="category" role="menuitemcheckbox" :checked="filters.category.includes(category)" :aria-checked="filters.category.includes(category)" @click="toggle('category', category)">{{ category }}</MenuItem></template>
                        <MenuLabel>Event or command</MenuLabel>
                        <template v-for="family in options.family" :key="family"><MenuItem :data-filter-family="family" role="menuitemcheckbox" :checked="filters.family.includes(family)" :aria-checked="filters.family.includes(family)" @click="toggle('family', family)">{{ family }}</MenuItem></template>
                        <MenuLabel>Sender</MenuLabel>
                        <template v-for="sender in options.sender" :key="sender"><MenuItem role="menuitemcheckbox" :checked="filters.sender.includes(sender)" :aria-checked="filters.sender.includes(sender)" @click="toggle('sender', sender)">{{ sender }}</MenuItem></template>
                        <template v-if="count"><MenuItem data-filter-clear @click="filters = emptyFilters()">Clear filters</MenuItem></template>
                    </MenuPanel></template>
                </div>
                <div class="columns">
                    <span data-hook-column>Event</span>
                    <span data-hook-column>Tool</span>
                    <span class="parts" data-hook-column>Parts</span>
                    <span data-hook-column>Time</span>
                    <span data-hook-column>Sender</span>
                    <span data-hook-column>Queued</span>
                    <span data-hook-column>Duration</span>
                </div>
                <div class="list-scroll" data-hook-request-list>
                    <template v-if="failure">
                        <p class="note message" role="alert">{{ failure }}</p>
                    </template>
                    <template v-else-if="!rows.length">
                        <p class="note message">Nothing recorded yet. Record agent calls in the developer settings turns the log on.</p>
                    </template>
                    <TransitionGroup name="request-row" tag="div" class="request-rows">
                    <template v-for="row in rows" :key="row.id">
                        <template v-if="row.day_start">
                            <div class="day" data-hook-day>{{ row.day }}<span>UTC</span></div>
                        </template>
                        <div role="button" tabindex="0" :class="['row', {open: row.id === openedNumber, slow: isSlow(row), refused: isRefused(row)}]" :data-hook-request="row.id" :aria-pressed="row.id === openedNumber" :title="requestOutcomeLabel(row.outcome)" @click="openedNumber = row.id" @keydown.enter="openedNumber = row.id">
                            <span class="event">{{ row.event }}</span>
                            <span class="tool">{{ row.tool || '—' }}</span>
                            <span class="parts" data-hook-parts>{{ row.part_count || '' }}</span>
                            <time :datetime="row.received_at">{{ row.time }}</time>
                            <template v-if="row.agent_id"><button type="button" class="sender" :data-peek="`agents:${row.agent_id}`" @click.stop="peekRef(`agents:${row.agent_id}`)">{{ row.sender }}</button></template><template v-else><span>{{ row.sender }}</span></template>
                            <span class="queued">{{ Math.round(row.queued_ms) }} ms</span>
                            <span class="duration">{{ durationOf(row) }}</span>
                        </div>
                    </template>
                    </TransitionGroup>
                </div>
            </section>
            <div class="divider" data-hook-request-divider role="separator" aria-orientation="vertical" />
            <section class="detail" data-hook-request-detail-area aria-label="Request details">
                <RequestDetails :request="opened" />
            </section>
            <template v-if="queueOpen"><div class="queue-veil" @click.self="queueOpen = false"><ExecutionsInspector @close="queueOpen = false" /></div></template>
        </div>
    </WindowRoom>
</template>

<style scoped>
.toolbar { display: flex; justify-content: space-between; padding: 8px 12px; }
.queue-veil { position: absolute; inset: 0; display: flex; justify-content: flex-end; background: #0005; z-index: 3; }
.queue-veil > * { width: min(560px, 100%); box-shadow: 0 0 24px #0003; }
.requests {
    position: relative;
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
    grid-template-columns: minmax(80px, 1.4fr) minmax(40px, 0.7fr) 32px 88px minmax(72px, 1fr) 55px 60px;
    align-items: center;
    gap: 5px;
    padding: 10px 10px;
    font-size: 12px;
}

.columns {
    flex: none;
    border-bottom: 1px solid var(--border);
    color: var(--text-3);
}

.columns > :last-child,
.duration,
.queued,
.parts {
    text-align: right;
}

.parts {
    padding-right: 12px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}
.sender { padding: 0; border: 0; background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.sender:hover { color: var(--accent); text-decoration: underline; }

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
.duration,
.queued {
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
    .queue-button { align-self: flex-end; margin: 8px 12px; }
.queue-veil { position: absolute; inset: 0; display: flex; justify-content: flex-end; background: #0005; z-index: 3; }
.queue-veil > * { width: min(560px, 100%); box-shadow: 0 0 24px #0003; }
.requests {
    position: relative;
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: minmax(140px, 45%) 1px minmax(0, 1fr);
    }
}
.request-rows { display: contents; }
.request-row-move { transition: transform 320ms cubic-bezier(.2, .9, .25, 1); }
.request-row-enter-active { transition: opacity 200ms ease-out; }
.request-row-enter-from { opacity: 0; }
.request-row-leave-active { display: none; }
@media (prefers-reduced-motion: reduce) { .request-row-move, .request-row-enter-active { transition: none; } }
</style>
