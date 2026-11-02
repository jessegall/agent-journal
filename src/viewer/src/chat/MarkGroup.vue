<script setup>
import {computed, ref} from "vue";
import ChatMark from "../kit/ChatMark.vue";
import MarkHost from "./MarkHost.vue";

// marks that stand together, folded into one mark that opens to each of them, as version 4's TurnGroup did
const props = defineProps({group: {type: Object, required: true}});
const opened = ref(false);
const look = computed(() => ({
    key: props.group.id,
    icon: props.group.declaration.family_icon || "",
    markIcon: props.group.declaration.mark_icon || "",
    group: props.group.declaration.group || "",
    label: props.group.label,
    time: props.group.time,
    title: opened.value ? "Fold them back into one line" : "Show each of them",
}));
</script>

<template>
    <div class="thread-turn group" :data-ref="group.id">
        <ChatMark :mark="look" :open="opened" @click="opened = !opened" />
        <template v-if="opened">
            <div class="thread-group" data-mark-group-rows>
                <template v-for="mark in group.marks" :key="mark.id">
                    <MarkHost :mark="mark" />
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.thread-turn.group {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: flex-start;
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

.thread-group > :deep(.thread-turn) {
    max-width: 100%;
}
</style>
