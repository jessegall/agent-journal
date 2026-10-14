<script setup>
import {computed, ref} from "vue";
import ChatMark from "../kit/ChatMark.vue";
import Turn from "./Turn.vue";

const props = defineProps({turn: {type: Object, required: true}});
const emit = defineEmits(["reply", "pin"]);
const unfolded = ref(false);
const mark = computed(() => ({
    icon: props.turn.icon,
    tone: props.turn.data.tone,
    color: props.turn.data.color,
    label: props.turn.title,
    at: props.turn.created,
    title: unfolded.value ? "Fold them back into one line" : "Show each of them",
}));
</script>

<template>
    <div class="thread-turn group" :data-ref="turn.ref">
        <ChatMark :mark="mark" @click="unfolded = !unfolded" />
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
