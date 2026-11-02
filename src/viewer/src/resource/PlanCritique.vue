<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import Segmented from "../kit/Segmented.vue";
import {CRITIQUE_AGENTS, CRITIQUE_SIZES, critiqueBrief, critiqueTemplates} from "../domain/critique.js";

// asks the agent for a critique of a plan as version 4 did: how many agents, how thorough, and which critique template, sent as a message
const props = defineProps({plan: {type: Object, required: true}, read: {type: Function, required: true}});
const emit = defineEmits(["close"]);
const NO_TEMPLATE = "none";
const agents = ref(String(CRITIQUE_AGENTS[1]));
const size = ref(CRITIQUE_SIZES[1]);
const template = ref(NO_TEMPLATE);
const templates = ref([]);
const failure = ref("");
const sending = ref(false);
const AGENT_OPTIONS = CRITIQUE_AGENTS.map((count) => ({key: String(count), label: String(count)}));
const SIZE_OPTIONS = CRITIQUE_SIZES.map((words) => ({key: words, label: words}));
const templateOptions = computed(() => [{key: NO_TEMPLATE, label: "No template"}, ...templates.value.map((row) => ({key: String(row.id), label: row.title}))]);
const picked = computed(() => templates.value.find((row) => String(row.id) === template.value));

async function loadTemplates() {
    const answer = await props.read(["template", "list"]);
    templates.value = answer.ok ? critiqueTemplates(answer.value.rows) : [];
    failure.value = answer.ok ? "" : answer.error;
}

async function send() {
    sending.value = true;
    const answer = await props.read(["message", "send", critiqueBrief({agents: Number(agents.value), size: size.value, plan: props.plan, template: picked.value})]);
    sending.value = false;
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) emit("close");
}

loadTemplates();
</script>

<template>
    <Dialog title="Ask for a critique" @close="emit('close')">
        <div class="critique" data-plan-critique>
            <p class="critique-plan">Plan {{ plan.id }} · {{ plan.title }}</p>
            <p class="critique-label">How many agents</p>
            <Segmented :options="AGENT_OPTIONS" :value="agents" @pick="agents = $event" />
            <p class="critique-label">How thorough</p>
            <Segmented :options="SIZE_OPTIONS" :value="size" wrap @pick="size = $event" />
            <p class="critique-label">Template</p>
            <Segmented :options="templateOptions" :value="template" wrap @pick="template = $event" />
            <template v-if="picked">
                <p class="critique-guide">{{ picked.brief }}</p>
            </template>
            <template v-if="failure">
                <p class="critique-failure" role="alert" data-critique-failure>{{ failure }}</p>
            </template>
            <div class="critique-actions">
                <Btn small @click="emit('close')">Cancel</Btn>
                <Btn kind="primary" small :busy="sending" data-critique-send @click="send">Ask for the critique</Btn>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.critique {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
}

.critique-plan,
.critique-guide {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.critique-label {
    margin: 8px 0 0;
    color: var(--text-2);
    font-size: 12px;
}

.critique-failure {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}

.critique-actions {
    display: flex;
    gap: 8px;
    align-self: flex-end;
    margin-top: 12px;
}
</style>
