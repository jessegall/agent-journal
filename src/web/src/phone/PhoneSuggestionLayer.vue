<script setup>
import Toast from "../kit/Toast.vue";
import PhoneSuggestionSheet from "./PhoneSuggestionSheet.vue";
import {useSuggestionWindow} from "../composables/suggestionWindow.js";
import {UNDO_MS, undoing} from "../state/suggestionScreen.js";

const DEFAULT_HOURS = 3;
const props = defineProps({items: {type: Array, required: true}});
const suggestions = () => props.items.filter((item) => item.type === "suggestion");
const hours = () => suggestions()[0]?.window_after ?? DEFAULT_HOURS;
const DEFAULT_GRACE = 10;
const graceUntil = () => ((suggestions()[0]?.started || 0) + (suggestions()[0]?.start_grace ?? DEFAULT_GRACE) * 60) * 1000;
const {suggestion, close} = useSuggestionWindow(suggestions, hours, graceUntil);
</script>

<template>
    <template v-if="suggestion">
        <PhoneSuggestionSheet :key="suggestion.n" :suggestion="suggestion" :hours="hours()" @close="close" />
    </template>
    <Toast top :toast="undoing" :lasts="UNDO_MS" @done="undoing = null" />
</template>
