<script setup>
import {computed, h, ref, watch} from "vue";
import {windowPermissions} from "./allowancePrompts.js";
import EmptyState from "../kit/EmptyState.vue";
import Skeleton from "../kit/Skeleton.vue";
import DocumentWindow from "./DocumentWindow.vue";
import FrameWindow from "./FrameWindow.vue";
import PageWindow from "./PageWindow.vue";
import WindowHost from "./WindowHost.vue";

const emit = defineEmits(["remove", "option"]);
const props = defineProps({
    name: {type: String, required: true},
    catalogue: {type: Object, required: true},
    subscriptions: {type: Object, required: true},
    environment: {type: String, required: true},
    agent: {type: Number, default: null},
    visible: {type: Boolean, default: true},
    prompts: {type: Object, default: null},
    shellRead: {type: Function, default: null},
    options: {type: Object, default: () => ({})},
    dropdown: {type: Boolean, default: false},
    bar: {type: Boolean, default: false},
});

const entry = computed(() => (props.bar ? props.catalogue.bar(props.name) : props.dropdown ? props.catalogue.dropdown(props.name) || props.catalogue.window(props.name) : props.catalogue.window(props.name)));
watch(() => props.catalogue.dropdown(props.name), (found) => found && !props.dropdown && emit("remove"), {immediate: true});
const documentComponent = computed(() => entry.value && {render: () => h(DocumentWindow, {line: entry.value.line})});
const access = ref(null);
const trustReason = computed(
    () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${entry.value.module} to show it.`,
);
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
    <template v-if="!entry && catalogue.loaded?.value === false">
        <Skeleton shape="cards" />
    </template>
    <template v-else-if="entry?.place === 'agent' && agent === null">
        <EmptyState title="No agent is running here" data-window-no-agent />
    </template>
    <template v-else-if="entry && entry.loading === 'component' && !entry.allowed && !access?.component_trusted">
        <WindowHost :name="name" :subscriptions="subscriptions" :environment="environment" :unavailable-reason="trustReason" />
    </template>
    <template v-else-if="entry && entry.loading === 'component'">
        <PageWindow
            :entry="entry"
            :subscriptions="subscriptions"
            :environment="environment"
            :agent="agent"
            :visible="visible"
            :permissions="permissions"
            :prompts="prompts"
            :options="options"
            @option="(key, value) => emit('option', key, value)"
        />
    </template>
    <template v-else-if="entry && entry.loading === 'frame'">
        <FrameWindow
            :entry="entry"
            :subscriptions="subscriptions"
            :environment="environment"
            :agent="agent"
            :visible="visible"
            :permissions="permissions"
            :prompts="prompts"
            :options="options"
            @option="(key, value) => emit('option', key, value)"
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
            :events="entry.events"
            :options="options"
            :declared="entry.options"
            :auto-scroll="entry.auto_scroll"
            :tabs="entry.tabs"
            :unavailable-reason="entry.unavailable_reason"
            @option="(key, value) => emit('option', key, value)"
        />
    </template>
    <template v-else>
        <WindowHost :name="name" :subscriptions="subscriptions" :environment="environment" :options="options" @remove="emit('remove')" />
    </template>
</template>
