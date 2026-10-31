<script setup>
import {computed, h, ref, watch} from "vue";
import {windowPermissions} from "./allowancePrompts.js";
import DocumentWindow from "./DocumentWindow.vue";
import PageWindow from "./PageWindow.vue";
import WindowHost from "./WindowHost.vue";

const props = defineProps({
    name: {type: String, required: true},
    catalogue: {type: Object, required: true},
    subscriptions: {type: Object, required: true},
    environment: {type: String, required: true},
    agent: {type: Number, default: null},
    visible: {type: Boolean, default: true},
    prompts: {type: Object, default: null},
    shellRead: {type: Function, default: null},
});
const FRAME_REASON = "This window loads in a frame, which the viewer cannot show yet.";

const entry = computed(() => props.catalogue.window(props.name));
const documentComponent = computed(() => entry.value && {render: () => h(DocumentWindow, {line: entry.value.line})});
const access = ref(null);
const permissions = computed(() =>
    access.value ? windowPermissions(access.value, ask) : {reads: entry.value?.reads || [], runs: entry.value?.runs || [], missing: [], ask: async () => true},
);

async function loadAccess() {
    if (!entry.value || entry.value.allowed || !props.shellRead) return;
    const answer = await props.shellRead(`window permissions ${props.name} --environment ${props.environment}`);
    access.value = answer.ok ? answer.value : null;
}

async function ask() {
    const allowed = await props.prompts.ask(entry.value.title, access.value);
    await loadAccess();
    return allowed;
}

watch(
    () => entry.value?.entry_url || entry.value?.line,
    async () => {
        await loadAccess();
        if (permissions.value.missing.length) ask();
    },
    {immediate: true},
);
</script>

<template>
    <template v-if="entry && entry.loading === 'page'">
        <PageWindow
            :entry="entry"
            :subscriptions="subscriptions"
            :environment="environment"
            :agent="agent"
            :visible="visible"
            :permissions="permissions"
            :prompts="prompts"
        />
    </template>
    <template v-else-if="entry">
        <WindowHost
            :key="entry.line || entry.entry_url"
            :name="name"
            :component="documentComponent"
            :subscriptions="subscriptions"
            :environment="environment"
            :agent="agent"
            :visible="visible"
            :permissions="permissions"
            :prompts="prompts"
            :unavailable-reason="entry.unavailable_reason || (entry.loading === 'frame' ? FRAME_REASON : '')"
        />
    </template>
    <template v-else>
        <WindowHost :name="name" :subscriptions="subscriptions" :environment="environment" />
    </template>
</template>
