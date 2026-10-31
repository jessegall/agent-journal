<script setup>
import {computed, onUnmounted, ref} from "vue";
import Btn from "../kit/Btn.vue";
import {WindowOffers, fetchWindowOffers, followEvents} from "./windowOffers.js";
import WindowPane from "./WindowPane.vue";
import {WindowSubscriptions} from "./windowSubscriptions.js";

const props = defineProps({
    environment: {type: String, required: true},
    layout: {type: Array, default: null},
    offers: {type: Object, default: null},
    events: {type: Function, default: followEvents},
});

const offers = props.offers || new WindowOffers(() => fetchWindowOffers(props.environment));
const subscriptions = new WindowSubscriptions();
const panes = ref(props.layout ? [...props.layout] : []);
const unopened = computed(() => offers.offers.value.filter((offer) => !panes.value.includes(offer.name)));

const stop = props.events(props.environment, async (event) => {
    await offers.heard(event);
    subscriptions.dispatch(event);
});
onUnmounted(stop);

offers.load().then(() => {
    if (!props.layout) panes.value = offers.offers.value.map((offer) => offer.name);
});
</script>

<template>
    <div class="window-shell">
        <nav class="window-shell-menu">
            <Btn v-for="offer in unopened" :key="offer.name" @click="panes.push(offer.name)">Open {{ offer.title }}</Btn>
        </nav>
        <div class="window-shell-panes">
            <WindowPane v-for="name in panes" :key="name" :name="name" :offers="offers" :subscriptions="subscriptions" :environment="environment" />
        </div>
    </div>
</template>

<style scoped>
.window-shell {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg);
}

.window-shell-menu {
    display: flex;
    gap: 8px;
    padding: 8px 16px;
    border-bottom: 1px solid var(--line);
}

.window-shell-panes {
    display: grid;
    flex: 1;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    gap: 1px;
    background: var(--line);
}

.window-shell-panes > :deep(.window) {
    position: relative;
    min-height: 0;
    overflow: auto;
    padding: 16px;
    background: var(--bg);
}
</style>
