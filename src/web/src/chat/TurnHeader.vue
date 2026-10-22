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
            <span :class="{'thread-unsent': turn.unsent}">{{ turn.unsent ? "not sent yet, trying again" : "sending" }}</span>
        </template>
        <template v-else-if="turn.who === 'colleague'">
            <span class="thread-colleague">{{ (turn.data || {}).colleague }}, colleague</span>
            <span class="thread-meta-dot" />
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
        <template v-if="!turn.pending">
            <span>{{ clock(turn.time) }}</span>
        </template>
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
    padding: 0 3px;
    font-size: 10.5px;
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

.thread-ref {
    font-size: 11px;
    opacity: 0.62;
}
</style>
