<script setup>
import {h, onErrorCaptured, onUnmounted, provide, ref, watch} from "vue";
import {WINDOW_CONTEXT, windowContext} from "./windowContext.js";
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
    unavailableReason: {type: String, default: ""},
});
const emit = defineEmits(["open"]);
const failure = ref("");

provide(WINDOW_CONTEXT, windowContext({
    window: props.name,
    environment: props.environment,
    agent: props.agent,
    visible: () => props.visible,
    permissions: props.permissions,
    subscriptions: props.subscriptions,
    open: (window, agent) => emit("open", window, agent),
}));

watch(() => props.visible, (shown) => shown && props.subscriptions.shown(props.name));
onUnmounted(() => props.subscriptions.stopAll(props.name));

onErrorCaptured((error) => {
    failure.value = error instanceof Error ? error.message : String(error);
    props.subscriptions.stopAll(props.name);
    return false;
});

const Hosted = () => h(props.component);
const prompt = () => (props.prompts?.current.value?.window === props.name ? props.prompts.current.value : null);
</script>

<template>
    <section class="window" :data-window="name">
        <AllowancePrompt v-if="prompt()" :request="prompt()" @answer="prompts.answer($event)" />
        <WindowPlaceholder v-if="unavailableReason" :name="name" :reason="unavailableReason" />
        <WindowPlaceholder v-else-if="failure" :name="name" :reason="`This window failed: ${failure}`" />
        <WindowPlaceholder v-else-if="!component" :name="name" reason="No installed module has this window." />
        <Hosted v-else />
    </section>
</template>
