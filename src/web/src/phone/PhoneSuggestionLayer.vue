<script setup>
import Toast from "../kit/Toast.vue";
import PhoneSuggestionSheet from "./PhoneSuggestionSheet.vue";
import {useSuggestionWindow} from "../composables/suggestionWindow.js";
import {UNDO_MS, undoing} from "../state/suggestionScreen.js";

const DEFAULT_HOURS = 3;
const props = defineProps({items: {type: Array, required: true}});
const suggestions = () => props.items.filter((item) => item.type === "suggestion");
const hours = () => suggestions()[0]?.window_after ?? DEFAULT_HOURS;
const {suggestion, close} = useSuggestionWindow(suggestions, hours);
</script>

<template>
    <template v-if="suggestion">
        <PhoneSuggestionSheet :key="suggestion.n" :suggestion="suggestion" :hours="hours()" @close="close" />
    </template>
    <Toast top :toast="undoing" :lasts="UNDO_MS" @done="undoing = null" />
</template>
