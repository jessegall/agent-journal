<script setup>
import {computed, ref, watch} from "vue";
import ChatMark from "../kit/ChatMark.vue";
import GrowIn from "../kit/GrowIn.vue";
import Turn from "./Turn.vue";
import {focusTurn} from "../platform/view.js";
import {store} from "../state/store.js";

// Marks folded into one group mark that opens to each of them: a family's marks, or a sequence run's in step order, which says when steps
// joined it after other bubbles and, for a run continued further down, opens the part it continues
const props = defineProps({turn: {type: Object, required: true}});
const emit = defineEmits(["reply"]);
const unfolded = ref(false);
const seen = ref(0);
const news = computed(() => Math.max(0, props.turn.data.news - seen.value));
const mark = computed(() => ({
    icon: props.turn.icon,
    tone: props.turn.data.tone,
    color: props.turn.data.color,
    group: props.turn.data.group,
    markIcon: props.turn.data.markIcon,
    label: props.turn.title,
    news: news.value ? `${news.value} new` : "",
    time: props.turn.time,
    title: unfolded.value ? "Fold them back into one line" : "Show each of them",
    action: props.turn.data.continues ? "Open the earlier steps" : "",
}));

function toggle() {
    unfolded.value = !unfolded.value;
    seen.value = props.turn.data.news;
}

// a group another part points at opens when it is taken to
watch(
    () => store.focus === props.turn.key,
    (taken) => taken && !unfolded.value && toggle()
);
</script>

<template>
    <div class="thread-turn group" :data-ref="turn.key">
        <ChatMark :mark="mark" :open="unfolded" @click="toggle" @act="focusTurn(turn.data.continues)" />
        <GrowIn :shown="unfolded">
            <div class="thread-group">
                <template v-for="t in turn.turns" :key="t.key">
                    <Turn :turn="t" @reply="emit('reply', $event)" />
                </template>
            </div>
        </GrowIn>
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
