<script setup>
import {computed, onUnmounted, ref} from "vue";
import DockWrapper from "./DockWrapper.vue";
import {dockDeclaration} from "../domain/dockRegistry.js";
import {dockedItems, groupedRuns, isLeaving, isRunItem, keptRuns} from "../domain/dockItems.js";

// the items docked above the chat: a leaving item runs a countdown down its top edge, pointing at it holds it, and from three runs they share one row
const props = defineProps({items: {type: Array, required: true}});
const now = ref(Date.now() / 1000);
const held = ref(new Set());
const grouped = ref(false);
const opened = ref(false);
const tick = setInterval(() => (now.value = Date.now() / 1000), 500);
onUnmounted(() => clearInterval(tick));

const docked = computed(() => dockedItems(props.items, now.value, held.value));
const runs = computed(() => keptRuns(docked.value.filter((item) => isRunItem(item, dockDeclaration)), now.value));
const rows = computed(() => docked.value.filter((item) => !runs.value.includes(item) && !isRunItem(item, dockDeclaration)));
const shared = computed(() => (grouped.value = groupedRuns(runs.value.length, grouped.value)) && !opened.value);

function hold(item) {
    held.value = new Set([...held.value, item.id]);
}

function release(item) {
    held.value = new Set([...held.value].filter((id) => id !== item.id));
}
</script>

<template>
    <template v-for="item in rows" :key="item.id">
        <div @mouseenter="hold(item)" @mouseleave="release(item)">
            <DockWrapper :item="item" :leaving="isLeaving(item) && !held.has(item.id)" />
        </div>
    </template>
    <template v-for="item in shared ? [] : runs" :key="item.id">
        <div @mouseenter="hold(item)" @mouseleave="release(item)">
            <DockWrapper :item="item" />
        </div>
    </template>
    <template v-if="shared">
        <button type="button" class="dock-runs-row" title="Show each run as its own card" @click="opened = true">{{ runs.length }} runs</button>
    </template>
</template>
