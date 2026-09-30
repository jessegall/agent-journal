<script setup>
import {computed, ref} from "vue";
import ChatMark from "../kit/ChatMark.vue";
import Turn from "./Turn.vue";

const props = defineProps({turn: {type: Object, required: true}});
const emit = defineEmits(["reply", "pin"]);
const unfolded = ref(false);
const data = computed(() => props.turn.data);
</script>

<template>
    <div class="thread-turn group" :data-ref="turn.ref">
        <ChatMark
            :icon="turn.icon"
            :tone="data.tone"
            :color="data.color"
            :label="turn.title"
            :at="turn.created"
            :title="unfolded ? 'Fold them back into one line' : 'Show each of them'"
            @click="unfolded = !unfolded"
        />
        <template v-if="unfolded">
            <div class="thread-group">
                <template v-for="t in turn.turns" :key="t.ref">
                    <Turn :turn="t" @reply="emit('reply', $event)" @pin="emit('pin', $event)" />
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.thread-turn.group,
.thread-group > :deep(.thread-turn) {
    max-width: 100%;
}

.thread-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 6px 0 2px 14px;
    padding-left: 12px;
    border-left: 1px solid var(--border);
}
</style>
