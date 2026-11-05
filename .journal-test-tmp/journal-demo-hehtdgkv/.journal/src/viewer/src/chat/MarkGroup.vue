<script setup>
import {computed, nextTick, ref, watch} from "vue";
import ChatMark from "../kit/ChatMark.vue";
import MarkHost from "./MarkHost.vue";

// marks that stand together, folded into one mark that opens to each of them, as version 4's TurnGroup did
const props = defineProps({group: {type: Object, required: true}});
const opened = ref(false);
const everOpened = ref(false);
const rowsShown = ref(false);
const rows = ref(null);
// the rows are first drawn folded and laid out, so the first opening grows as every later one does and does not arrive at full height in one frame
watch(opened, async (next) => {
    everOpened.value = true;
    await nextTick();
    void rows.value?.offsetHeight;
    rowsShown.value = next;
});
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
        <template v-if="everOpened">
            <div ref="rows" :class="['group-rows', {open: rowsShown}]" :inert="!opened" data-mark-group-rows>
                <div class="group-fold">
                    <div class="thread-group">
                        <template v-for="mark in group.marks" :key="mark.id">
                            <MarkHost :mark="mark" />
                        </template>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.thread-turn.group {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 3px;
    align-items: flex-start;
    align-self: flex-start;
    max-width: 100%;
}

/* closing fades the rows first and then folds them; opening grows first and then fades them in */
.group-rows {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition: opacity 120ms ease, grid-template-rows 280ms cubic-bezier(0.2, 0.9, 0.25, 1) 120ms;
}

.group-rows.open {
    grid-template-rows: 1fr;
    opacity: 1;
    transition: grid-template-rows 280ms cubic-bezier(0.2, 0.9, 0.25, 1), opacity 160ms ease 280ms;
}

/* the rows' margins stand inside what folds, so a closed group is as tall as one that never opened */
.group-fold {
    min-height: 0;
    overflow: hidden;
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
