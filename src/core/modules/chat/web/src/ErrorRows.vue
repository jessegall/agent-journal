<script setup>
import {Btn, EmptyState, TimeAgo, WindowRoom, removed, useWindow} from "@journal/window-kit";

// the errors the journal recorded in its own work, newest first, each with the place it happened and what went wrong;
// a person marks one solved, which clears it from the list
const view = useWindow();
const {rows, failure, loaded, act} = view.props.errors;
const solve = (row) => act(["journal-exception", "solve", String(row.id)], removed(row.id));
</script>

<template>
    <WindowRoom padding="0">
        <template v-if="failure"><p class="failure" role="alert" data-errors-failure>{{ failure }}</p></template>
        <template v-else-if="loaded && !rows.length"><EmptyState title="No errors">The journal has recorded no error that is not solved.</EmptyState></template>
        <template v-for="row in rows" :key="row.id">
            <div class="error" data-error :data-error-id="row.id">
                <div class="head">
                    <strong>Error {{ row.id }}</strong>
                    <span class="place" data-error-place>{{ row.source }}</span>
                    <TimeAgo :at="row.created_at" />
                    <Btn small data-error-solved @click="solve(row)">Solved</Btn>
                </div>
                <p class="message" data-error-message>{{ row.message }}</p>
            </div>
        </template>
    </WindowRoom>
</template>

<style scoped>
.error { padding: 10px 16px; border-bottom: 1px solid var(--border-inner); }
.head { display: flex; gap: 10px; align-items: center; font-size: 12.5px; }
.place { flex: 1; min-width: 0; overflow: hidden; color: var(--text-3); text-overflow: ellipsis; white-space: nowrap; }
.message { margin: 4px 0 0; color: var(--text-2); font-size: 12px; white-space: pre-wrap; overflow-wrap: anywhere; }
.failure { padding: 10px 16px; color: var(--danger); font-size: 12px; }
</style>
