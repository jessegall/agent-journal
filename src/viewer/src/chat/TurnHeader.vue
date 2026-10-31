<script setup>
import {computed} from "vue";
import ReadTicks from "../kit/ReadTicks.vue";
import {clock} from "../format/time.js";
import {actorName, isMe} from "../domain/people.js";
import {store} from "../state/store.js";

const props = defineProps({turn: {type: Object, required: true}});
const mine = computed(() => props.turn.who === "user");
</script>

<template>
    <div class="thread-meta">
        <template v-if="turn.pending">
            <template v-if="turn.unsent">
                <span class="thread-unsent">not sent yet, trying again</span>
                <span class="thread-meta-dot" />
            </template>
        </template>
        <template v-else-if="mine && !isMe(turn.creator, store.people) && (turn.creator || '').startsWith('user:')">
            <span class="thread-colleague">{{ actorName(turn.creator, store.people) }}</span>
            <span class="thread-meta-dot" />
            <span class="thread-ref">message {{ turn.id }}</span>
            <span class="thread-meta-dot" />
        </template>
        <template v-else-if="mine">
            <span class="thread-ref">message {{ turn.id }}</span>
            <span class="thread-meta-dot" />
        </template>
        <span>{{ clock(turn.time) }}</span>
        <template v-if="mine && !turn.pending">
            <ReadTicks :message="turn" />
        </template>
    </div>
</template>

<style scoped>
.thread-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 2px;
    font-size: 10.5px;
    font-variant-numeric: tabular-nums;
    color: var(--text-4);
}

.thread-colleague {
    color: var(--text-2);
    font-weight: 500;
}

.thread-unsent {
    color: var(--danger);
}

.thread-meta-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--text-3);
    opacity: 0.7;
}

.thread-writer {
    font-weight: 600;
    color: var(--text-3);
}
</style>
