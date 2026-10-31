<script setup>
import {computed, h} from "vue";
import DocumentWindow from "./DocumentWindow.vue";
import PageWindow from "./PageWindow.vue";
import WindowHost from "./WindowHost.vue";

const props = defineProps({
    name: {type: String, required: true},
    offers: {type: Object, required: true},
    subscriptions: {type: Object, required: true},
    environment: {type: String, required: true},
    agent: {type: Number, default: null},
    visible: {type: Boolean, default: true},
});
const FRAME_REASON = "This window loads in a frame, which the viewer cannot show yet.";

const offer = computed(() => props.offers.offer(props.name));
const documentComponent = computed(() => offer.value && {render: () => h(DocumentWindow, {line: offer.value.line})});
</script>

<template>
    <PageWindow
        v-if="offer && offer.loading === 'page'"
        :offer="offer"
        :subscriptions="subscriptions"
        :environment="environment"
        :agent="agent"
        :visible="visible"
    />
    <WindowHost
        v-else-if="offer"
        :key="offer.line || offer.entry_url"
        :name="name"
        :component="documentComponent"
        :subscriptions="subscriptions"
        :environment="environment"
        :agent="agent"
        :visible="visible"
        :declared="{reads: offer.reads, runs: offer.runs}"
        :unavailable-reason="offer.unavailable_reason || (offer.loading === 'frame' ? FRAME_REASON : '')"
    />
    <WindowHost v-else :name="name" :subscriptions="subscriptions" :environment="environment" />
</template>
