<script setup>
import {computed, onMounted, ref} from "vue";
import {useScope} from "../composables/scope.js";
import {sendMessage} from "../chat/outbox.js";
import {CRITIQUE_AGENTS, CRITIQUE_SIZES, critiqueBrief, critiqueTemplates} from "../domain/critique.js";
import {route} from "../route.js";
import Btn from "../kit/Btn.vue";
import ChoiceList from "../kit/ChoiceList.vue";
import Dialog from "../kit/Dialog.vue";

const props = defineProps({plan: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const scope = useScope();

const agents = ref(2);
const size = ref(CRITIQUE_SIZES[1]);
const template = ref(0);
const templates = ref([]);
const sending = ref(false);

const choices = (options, chosen, label = (o) => o) => options.map((o) => ({value: o, label: label(o), current: chosen === o}));
const picked = computed(() => templates.value.find((t) => t.n === template.value));
const templateChoices = computed(() => [
    {value: 0, label: "No template", current: template.value === 0},
    ...templates.value.map((t) => ({value: t.n, label: t.title, current: template.value === t.n})),
]);

onMounted(async () => {
    const rows = await scope.api.all("template").catch(() => []);
    templates.value = critiqueTemplates(rows);
});

async function send() {
    sending.value = true;
    const brief = critiqueBrief({agents: agents.value, size: size.value, plan: props.plan, template: picked.value});
    try {
        await sendMessage(scope.env || route.value.env, {brief, about: props.plan.ref});
        emit("close");
    } finally {
        sending.value = false;
    }
}
</script>

<template>
    <Dialog title="Ask for a critique" @close="emit('close')">
        <p class="plan">plan {{ plan.n }} · {{ plan.title }}</p>
        <p class="label">How many agents</p>
        <ChoiceList :choices="choices(CRITIQUE_AGENTS, agents)" @pick="(v) => (agents = v)" />
        <p class="label">How thorough</p>
        <ChoiceList :choices="choices(CRITIQUE_SIZES, size)" @pick="(v) => (size = v)" />
        <p class="label">Template</p>
        <ChoiceList :choices="templateChoices" @pick="(v) => (template = v)" />
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
    margin: 8px 0 0;
    color: var(--text-3);
    font-size: 12px;
    line-height: 1.5;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
}
</style>
