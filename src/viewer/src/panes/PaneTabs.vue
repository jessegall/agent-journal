<script setup>
import EditorTabs from "../../kit/EditorTabs.vue";

// the tabs of a home pane: the editor tab bar, with what only a window has in its menu, Split right, Split below and Detach
const props = defineProps({tabs: {type: Array, required: true}, insertAt: {type: Number, default: -1}});
const emit = defineEmits(["pick", "close", "grab", "split", "detach"]);
const alone = () => props.tabs.length < 2;
const windowItems = (tab) => [
    {label: "Split right", disabled: alone(), reason: "One window", run: () => emit("split", tab.key, "right")},
    {label: "Split below", disabled: alone(), reason: "One window", run: () => emit("split", tab.key, "bottom")},
    {label: "Detach", run: () => emit("detach", tab.key)},
];
</script>

<template>
    <EditorTabs :tabs="tabs" :insert-at="insertAt" :extra="windowItems" @pick="emit('pick', $event)" @close="emit('close', $event)" @grab="(event, key) => emit('grab', event, key)">
        <slot />
    </EditorTabs>
</template>
