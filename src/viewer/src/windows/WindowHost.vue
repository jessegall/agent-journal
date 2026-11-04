<script setup>
import {computed, h, inject, onErrorCaptured, onMounted, onUnmounted, provide, ref, watch} from "vue";
import {OPEN_VIEW, PANE_PAGE, WINDOW_CONTEXT, windowContext} from "./windowContext.js";
import WindowSkeleton from "../kit/WindowSkeleton.vue";
import AllowancePrompt from "./AllowancePrompt.vue";
import WindowPlaceholder from "./WindowPlaceholder.vue";

const props = defineProps({
    name: {type: String, required: true},
    component: {type: Object, default: null},
    subscriptions: {type: Object, required: true},
    environment: {type: String, default: ""},
    agent: {type: Number, default: null},
    visible: {type: Boolean, default: true},
    permissions: {type: Object, default: () => ({reads: [], runs: [], missing: [], ask: async () => true})},
    prompts: {type: Object, default: null},
    events: {type: Array, default: () => []},
    unavailableReason: {type: String, default: ""},
    options: {type: Object, default: () => ({})},
    declared: {type: Array, default: () => []},
    autoScroll: {type: String, default: ""},
    tabs: {type: Array, default: () => []},
    sources: {type: Array, default: () => []},
    links: {type: Object, default: () => ({})},
    search: {type: Object, default: () => ({})},
    readOnly: Boolean,
    shared: {type: Object, default: null},
    skeleton: {type: Array, default: () => []},
});
const emit = defineEmits(["open", "option", "remove"]);
const failure = ref("");
const attempt = ref(0);

function retry() {
    failure.value = "";
    attempt.value++;
}

const openView = inject(OPEN_VIEW, null);
const context = windowContext({
    window: props.name,
    environment: props.environment,
    agent: props.agent,
    visible: () => props.visible,
    permissions: props.permissions,
    events: props.events,
    subscriptions: props.subscriptions,
    options: computed(() => props.options),
    declared: props.declared,
    page: inject(PANE_PAGE, null),
    setOption: (key, value) => emit("option", key, value),
    autoScroll: props.autoScroll,
    tabs: props.tabs,
    sources: props.sources,
    links: props.links,
    search: props.search,
    readOnly: props.readOnly,
    shared: props.shared,
    open: (window, agent) => {
        emit("open", window, agent);
        openView?.(window, agent);
    },
});
provide(WINDOW_CONTEXT, context);

watch(() => props.visible, (shown) => shown && props.subscriptions.shown(props.name));
onMounted(context.settle);
onUnmounted(() => {
    context.cancel();
    props.subscriptions.stopAll(props.name);
});

onErrorCaptured((error) => {
    failure.value = error instanceof Error ? error.message : String(error);
    props.subscriptions.stopAll(props.name);
    return false;
});

const Hosted = () => h(props.component);
const prompt = () => (props.prompts?.current.value?.window === props.name ? props.prompts.current.value : null);
</script>

<template>
    <section class="window" :data-window="name" :data-agent="agent ?? undefined">
        <template v-if="prompt()">
            <AllowancePrompt :request="prompt()" @answer="prompts.answer($event)" />
        </template>
        <template v-if="unavailableReason">
            <WindowPlaceholder :name="name" :reason="unavailableReason" />
        </template>
        <template v-else-if="failure">
            <WindowPlaceholder :name="name" :reason="`This window failed: ${failure}`" retry @retry="retry" />
        </template>
        <template v-else-if="!component">
            <WindowPlaceholder :name="name" reason="No installed module has this window." removable @remove="emit('remove')" />
        </template>
        <template v-else>
            <Hosted :key="attempt" />
            <template v-if="skeleton.length && !context.answered.value">
                <WindowSkeleton class="window-cover" :parts="skeleton" />
            </template>
        </template>
    </section>
</template>

<style scoped>
.window {
    position: relative;
    animation: window-fade 0.25s ease backwards;
}

/* the window draws underneath, so it is ready the moment its own skeleton gives way, with no second skeleton of a list in between */
.window-cover {
    position: absolute;
    inset: 0;
    z-index: 1;
}

@keyframes window-fade {
    from {
        opacity: 0;
    }
}
</style>
