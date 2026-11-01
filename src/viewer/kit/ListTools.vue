<script setup>
import Segmented from "../src/kit/Segmented.vue";
import TextInput from "../src/kit/TextInput.vue";

// the search, the order and the open or closed choice of a list, as version 4's index pages had them
defineProps({tools: {type: Object, required: true}, placeholder: {type: String, default: "Search"}});
const ORDERS = [
    {key: "newest", label: "Newest"},
    {key: "title", label: "A to Z"},
];
const STATES = [
    {key: "open", label: "Open"},
    {key: "closed", label: "Closed"},
    {key: "all", label: "All"},
];
</script>

<template>
    <div class="list-tools" data-list-tools>
        <TextInput v-model="tools.words.value" icon="search" class="list-tools-search" :placeholder="placeholder" data-list-search />
        <Segmented :options="ORDERS" :value="tools.order.value" data-list-order @pick="tools.order.value = $event" />
        <template v-if="tools.hasStates">
            <Segmented :options="STATES" :value="tools.state.value" data-list-state @pick="tools.state.value = $event" />
        </template>
    </div>
</template>

<style scoped>
.list-tools {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
}

.list-tools-search {
    flex: 1;
    min-width: 160px;
}
</style>
