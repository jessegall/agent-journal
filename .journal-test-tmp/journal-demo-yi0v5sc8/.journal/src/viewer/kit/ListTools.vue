<script setup>
import MenuItem from "../src/kit/MenuItem.vue";
import MenuLabel from "../src/kit/MenuLabel.vue";
import SearchBar from "./SearchBar.vue";

// the search of a list, with its order and its open or closed choice in the bar's menu
defineProps({tools: {type: Object, required: true}, placeholder: {type: String, default: "Search"}});
const emit = defineEmits(["pick"]);
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
        <SearchBar v-model="tools.words.value" class="list-tools" :placeholder="placeholder" data-list-tools data-list-search @pick="emit('pick', $event)">
            <template #menu>
                <MenuLabel>Order</MenuLabel>
                <template v-for="order in ORDERS" :key="order.key">
                    <MenuItem :checked="tools.order.value === order.key" :data-list-order="order.key" @click="tools.order.value = order.key">{{ order.label }}</MenuItem>
                </template>
                <template v-if="tools.hasStates">
                    <MenuLabel>Show</MenuLabel>
                    <template v-for="state in STATES" :key="state.key">
                        <MenuItem :checked="tools.state.value === state.key" :data-list-state="state.key" @click="tools.state.value = state.key">{{ state.label }}</MenuItem>
                    </template>
                </template>
            </template>
            <slot />
        </SearchBar>
</template>

<style scoped>
.list-tools {
    margin-bottom: 0;
}
</style>
