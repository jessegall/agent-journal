<script setup>
import {computed, h, ref, watch} from "vue";
import {windowPermissions} from "./allowancePrompts.js";
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
    prompts: {type: Object, default: null},
    shellRead: {type: Function, default: null},
});
const FRAME_REASON = "This window loads in a frame, which the viewer cannot show yet.";

const offer = computed(() => props.offers.offer(props.name));
const documentComponent = computed(() => offer.value && {render: () => h(DocumentWindow, {line: offer.value.line})});
const access = ref(null);
const permissions = computed(() =>
    access.value ? windowPermissions(access.value, ask) : {reads: offer.value?.reads || [], runs: offer.value?.runs || [], missing: [], ask: async () => true},
);

async function loadAccess() {
    if (!offer.value || offer.value.allowed || !props.shellRead) return;
    const answer = await props.shellRead(`window permissions ${props.name} --environment ${props.environment}`);
    access.value = answer.ok ? answer.value : null;
}

async function ask() {
    const allowed = await props.prompts.ask(offer.value.title, access.value);
    await loadAccess();
    return allowed;
}

watch(
    () => offer.value?.entry_url || offer.value?.line,
    async () => {
        await loadAccess();
        if (permissions.value.missing.length) ask();
    },
    {immediate: true},
);
</script>

<template>
    <PageWindow
        v-if="offer && offer.loading === 'page'"
        :offer="offer"
        :subscriptions="subscriptions"
        :environment="environment"
        :agent="agent"
        :visible="visible"
        :permissions="permissions"
        :prompts="prompts"
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
        :permissions="permissions"
        :prompts="prompts"
        :unavailable-reason="offer.unavailable_reason || (offer.loading === 'frame' ? FRAME_REASON : '')"
    />
    <WindowHost v-else :name="name" :subscriptions="subscriptions" :environment="environment" />
</template>
