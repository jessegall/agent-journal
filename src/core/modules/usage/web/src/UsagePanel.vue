<script setup>
import {computed} from "vue";
import {WindowRoom, useWindow} from "@journal/window-kit";

// the plan allowance as version 4's usage menu drew it: a meter for each window of the plan, with when it starts again
const window = useWindow();
const {data: usage, failure} = window.props.usage;
const windows = computed(() => usage.value?.windows ?? []);

const reset = (seconds) => `Starts again ${new Date(seconds * 1000).toLocaleString()}`;
</script>

<template>
    <WindowRoom padding="14px 16px">
        <p class="current">Plan allowance used</p>
        <template v-if="failure">
            <p class="none">{{ failure }}</p>
        </template>
        <template v-for="window in windows" :key="window.title">
            <div class="meter" data-usage-meter>
                <span>{{ window.title }}</span>
                <strong>{{ Math.round(window.used_percent) }}%</strong>
                <span class="track"><span :style="{width: `${window.used_percent}%`}" /></span>
                <small>{{ reset(window.reset_epoch_seconds) }}</small>
            </div>
        </template>
        <template v-if="usage && !windows.length">
            <p class="none">No current plan window has been reported here.</p>
        </template>
    </WindowRoom>
</template>

<style scoped>
.current {
    margin: 0;
    padding: 2px 0 6px;
    color: var(--text);
    font-size: 12px;
}

.meter {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 4px 8px;
    padding: 6px 0;
    color: var(--text-2);
    font-size: 11.5px;
}

.meter strong {
    color: var(--text);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.track {
    grid-column: 1 / -1;
    height: 4px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--line);
}

.track > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--accent-text);
}

.meter small {
    grid-column: 1 / -1;
    color: var(--text-3);
    font-size: 10.5px;
}

.none {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
