<script setup>
import {computed} from "vue";
import ReadTicks from "../kit/ReadTicks.vue";
import {clock} from "../format/time.js";

const props = defineProps({turn: {type: Object, required: true}});
const mine = computed(() => props.turn.who === "user");
const fromPhone = computed(() => String(props.turn.data?.via || "").startsWith("phone:"));
</script>

<template>
    <div class="thread-meta">
        <template v-if="turn.pending">
            <span>sending</span>
        </template>
        <template v-else-if="mine || turn.type === 'question'">
            <span class="thread-ref">{{ turn.type }} {{ turn.n }}</span>
            <span class="thread-meta-dot" />
        </template>
        <template v-if="mine && fromPhone">
            <span>from phone</span>
            <span class="thread-meta-dot" />
        </template>
        <template v-if="!turn.pending">
            <span>{{ clock(turn.created) }}</span>
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

.thread-meta-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--text-3);
    opacity: 0.7;
}

.thread-ref {
    font-size: 11px;
    opacity: 0.62;
}
</style>
