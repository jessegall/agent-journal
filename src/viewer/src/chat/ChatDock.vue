<script setup>
import {computed} from "vue";
import RowDock from "./RowDock.vue";
import WatchDock from "./WatchDock.vue";
import {isLeaving, isRun} from "../domain/docks.js";

// One message docked above the chat: the output it watches or the check it runs, or the row it docks, marked closing while it leaves the
// dock, and timed while it closes by itself
const props = defineProps({message: {type: Object, required: true}, folded: Boolean});

const card = computed(() => props.message.data);
const closing = computed(() => (card.value.undock_at ? "" : null));
</script>

<template>
    <template v-if="isRun(message)">
        <WatchDock :class="{timed: isLeaving(message)}" :message="message" :folded="folded" :data-figure-closing="closing" />
    </template>
    <template v-else>
        <RowDock :message="message" :folded="folded" :data-figure-closing="closing" />
    </template>
</template>
