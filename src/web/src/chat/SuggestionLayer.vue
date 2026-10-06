<script setup>
import {computed} from "vue";
import Toast from "../kit/Toast.vue";
import SuggestionWindow from "./SuggestionWindow.vue";
import {useSuggestionWindow} from "../composables/suggestionWindow.js";
import {rows} from "../sync/rows.js";
import {store} from "../state/store.js";
import {UNDO_MS, spoken, undoing} from "../state/suggestionScreen.js";

const DEFAULT_HOURS = 3;
const hours = computed(() => store.settings?.suggestions?.window_after ?? DEFAULT_HOURS);
const {suggestion, close} = useSuggestionWindow(
    () => rows("suggestion"),
    () => hours.value
);
</script>

<template>
    <template v-if="suggestion">
        <SuggestionWindow :key="suggestion.n" :suggestion="suggestion" :hours="hours" @close="close" />
    </template>
    <Toast :toast="undoing" :lasts="UNDO_MS" @done="undoing = null" />
    <p class="suggestion-spoken" aria-live="polite">{{ spoken }}</p>
</template>

<style scoped>
.suggestion-spoken {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
}
</style>
