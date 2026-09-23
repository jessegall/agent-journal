<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {sendMessage} from "../chat/outbox.js";
import {route} from "../route.js";
import Btn from "../kit/Btn.vue";
import ChoiceList from "../kit/ChoiceList.vue";
import Dialog from "../kit/Dialog.vue";

const props = defineProps({plan: {type: Object, required: true}});
const emit = defineEmits(["close"]);

const AGENTS = [1, 2, 3, 5];
const SIZES = ["a quick look", "a normal read", "a thorough review"];

const agents = ref(2);
const size = ref(SIZES[1]);
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
    const rows = await api.all("template").catch(() => []);
    templates.value = rows.filter((t) => !t.completed && !t.deleted && t.data?.purpose === "critique");
});

async function send() {
    sending.value = true;
    const guide = picked.value ? `, following template ${picked.value.n} (${picked.value.title})` : "";
    const brief =
        `Please have ${agents.value === 1 ? "one agent" : `${agents.value} agents`} give plan ${props.plan.n} ${size.value}${guide}, ` +
        `and compile what they find into a report linked to the plan.`;
    await sendMessage(route.value.env, {brief, about: props.plan.ref});
    emit("close");
}
</script>

<template>
    <Dialog title="Ask for a critique" @close="emit('close')">
        <p class="plan">plan {{ plan.n }} · {{ plan.title }}</p>
        <p class="label">How many agents</p>
        <ChoiceList :choices="choices(AGENTS, agents)" @pick="(v) => (agents = v)" />
        <p class="label">How big</p>
        <ChoiceList :choices="choices(SIZES, size)" @pick="(v) => (size = v)" />
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
