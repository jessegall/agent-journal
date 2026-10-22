<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import {pollKey, usePoll} from "../composables/poll.js";
import {actorName} from "../domain/people.js";
import {clock} from "../format/time.js";
import {seconds} from "../domain/row.js";
import {store} from "../state/store.js";
import Compose from "./Compose.vue";

const EVERY_MS = 3000;
const rows = ref([]);
const refresh = usePoll(pollKey(), () => api.sideThread(), EVERY_MS, (got) => Array.isArray(got) && (rows.value = got));

async function post(text) {
    await api.postSideThread(text);
    refresh();
}
</script>

<template>
    <div class="side-thread">
        <p class="side-thread-note">People talk here beside the chat. No agent reads it.</p>
        <div class="side-thread-rows">
            <template v-for="row in rows" :key="row.id">
                <div class="side-thread-row">
                    <span class="side-thread-who">{{ actorName(row.creator, store.people) }}</span>
                    <span class="side-thread-time">{{ clock(seconds(row.created_at)) }}</span>
                    <p class="side-thread-text">{{ row.text }}</p>
                </div>
            </template>
            <template v-if="!rows.length">
                <p class="side-thread-empty">Nothing said here yet.</p>
            </template>
        </div>
        <Compose :send="post" placeholder="Say something to the people here" submit="Send" />
    </div>
</template>

<style scoped>
.side-thread {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.side-thread-note {
    margin: 0;
    padding: 8px 14px;
    font-size: 11px;
    color: var(--text-3);
    border-bottom: 1px solid var(--line);
}

.side-thread-rows {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.side-thread-who {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--text);
}

.side-thread-time {
    margin-left: 6px;
    font-size: 10.5px;
    color: var(--text-4);
}

.side-thread-text {
    margin: 2px 0 0;
    font-size: 12.5px;
    color: var(--text-2);
    white-space: pre-wrap;
}

.side-thread-empty {
    margin: 0;
    font-size: 12px;
    color: var(--text-3);
}
</style>
