<script setup>
import TimeAgo from "../../../kit/TimeAgo.vue";
import {peek} from "../../route.js";
import ProcessQueueBand from "../ProcessQueueBand.vue";

// the latest things the agent did, newest first; one that has a row of its own opens it
defineProps({moves: {type: Array, required: true}});
</script>

<template>
    <ProcessQueueBand icon="clock">Recent</ProcessQueueBand>
    <template v-for="move in moves" :key="`${move.time}:${move.text}`">
        <template v-if="move.table">
            <button type="button" class="move" data-agent-move @click="peek(move.table, move.id)">
                <i :class="['dot', move.tone]" /><span class="text">{{ move.text }}</span><TimeAgo class="when" :at="move.time" />
            </button>
        </template>
        <template v-else>
            <div class="move" data-agent-move>
                <i :class="['dot', move.tone]" /><span class="text">{{ move.text }}</span><TimeAgo class="when" :at="move.time" />
            </div>
        </template>
    </template>
    <template v-if="!moves.length">
        <p class="none" data-agent-no-moves>Nothing yet.</p>
    </template>
</template>

<style scoped>
.move { display: flex; align-items: center; gap: 9px; width: 100%; padding: 8px 14px; border: 0; border-bottom: 1px solid var(--border-inner); background: none; color: var(--text-2); font: inherit; font-size: 12.5px; text-align: left; }
button.move { cursor: pointer; }
button.move:hover { background: var(--hover); }
.dot { flex: none; width: 7px; height: 7px; border-radius: 50%; background: var(--text-4); }
.dot.good { background: var(--tone-good, var(--green)); }
.dot.bad { background: var(--danger); }
.text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.when { flex: none; color: var(--text-3); font-size: 12px; font-variant-numeric: tabular-nums; }
.none { margin: 0; padding: 10px 14px; border-bottom: 1px solid var(--border-inner); color: var(--text-3); font-size: 12px; }
</style>
