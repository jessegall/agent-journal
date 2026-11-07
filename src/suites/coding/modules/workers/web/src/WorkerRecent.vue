<script setup>
import {RowList, TimeAgo, peekRef, useWindow} from "@journal/window-kit";

// the moments the workers' marks in the chat name, newest first; one opens its worker
const view = useWindow();
const {rows, failure, loaded, older, more} = view.props.recent;
</script>

<template>
    <RowList :rows="rows" :failure="failure" :loaded="loaded" :older="older" :more="more" empty="No worker has done anything noteworthy yet" hint="Worker activity appears here as work starts and finishes.">
        <template #default="{row}">
            <button type="button" class="worker-moment" data-worker-moment @click="peekRef(`${row.target_model}:${row.target_id}`)">
                <span class="worker-moment-text">{{ row.text }}</span>
                <TimeAgo :at="row.created_at" />
            </button>
        </template>
    </RowList>
</template>

<style scoped>
.worker-moment {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    width: 100%;
    padding: 6px 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}

.worker-moment time {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
}
</style>
