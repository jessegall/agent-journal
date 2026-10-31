<script setup>
import {computed, onMounted, ref} from "vue";
import {useScope} from "../composables/scope.js";
import {sendMessage} from "../chat/outbox.js";
import {CRITIQUE_AGENTS, CRITIQUE_SIZES, critiqueBrief, critiqueTemplates} from "../domain/critique.js";
import {route} from "../route.js";
import Btn from "../kit/Btn.vue";
import ChoiceList from "../kit/ChoiceList.vue";
import Dialog from "../kit/Dialog.vue";
import {pageOf} from "../sync/paging.js";

const props = defineProps({plan: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const scope = useScope();

const agents = ref(2);
const size = ref(CRITIQUE_SIZES[1]);
const template = ref(0);
const templates = ref([]);
const sending = ref(false);
const unloaded = ref(false);

const choices = (options, chosen) => options.map((o) => ({value: o, label: String(o), current: chosen === o}));
const picked = computed(() => templates.value.find((t) => t.id === template.value));
const templateChoices = computed(() => [
    {value: 0, label: "No template", current: template.value === 0},
    ...templates.value.map((t) => ({value: t.id, label: t.title, current: template.value === t.id})),
]);

async function loadTemplates() {
    try {
        templates.value = critiqueTemplates((await scope.api.list("templates", {limit: pageOf("templates")})).rows);
        unloaded.value = false;
    } catch {
        unloaded.value = true;
    }
}

onMounted(loadTemplates);

async function send() {
    sending.value = true;
    try {
        await sendMessage(scope.env || route.value.env, {text: critiqueBrief({agents: agents.value, size: size.value, plan: props.plan, template: picked.value})});
        if (props.plan.state === "ready") await scope.api.act("plans", props.plan.id, "review");
        emit("close");
    } finally {
        sending.value = false;
    }
}
</script>

<template>
    <Dialog title="Ask for a critique" @close="emit('close')">
        <p class="plan">plan {{ plan.id }} · {{ plan.title }}</p>
        <p class="label">How many agents</p>
        <ChoiceList :choices="choices(CRITIQUE_AGENTS, agents)" @pick="(v) => (agents = v)" />
        <p class="label">How thorough</p>
        <ChoiceList :choices="choices(CRITIQUE_SIZES, size)" @pick="(v) => (size = v)" />
        <p class="label">Template</p>
        <ChoiceList :choices="templateChoices" @pick="(v) => (template = v)" />
        <template v-if="unloaded">
            <p class="guide">
                The templates did not load.
                <Btn small @click="loadTemplates">Try again</Btn>
            </p>
        </template>
        <template v-if="picked">
            <p class="guide">{{ picked.brief }}</p>
        </template>
        <div class="actions">
            <Btn small @click="emit('close')">Cancel</Btn>
            <Btn kind="primary" small :disabled="sending" @click="send">Ask the agent</Btn>
        </div>
    </Dialog>
</template>

<style scoped>
.plan {
    margin: 0 0 12px;
    color: var(--text-2);
    font-size: 12.5px;
}

.label {
    margin: 12px 0 6px;
    color: var(--text-3);
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.guide {
    margin: 10px 0 0;
    color: var(--text-3);
    font-size: 12px;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
}
</style>
