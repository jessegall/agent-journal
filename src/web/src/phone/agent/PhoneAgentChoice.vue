<script setup>
import {computed, ref, watch} from "vue";
import {api} from "../../api/client.js";
import {pendingChoice} from "../../domain/agents.js";
import {age} from "../../format/time.js";
import Icon from "../../kit/Icon.vue";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import {toast} from "../kit/toast.js";
import PhonePage from "../settings/PhonePage.vue";
import PhoneNoAgent from "./PhoneNoAgent.vue";
import {useLeadAgent} from "./lead.js";

const props = defineProps({target: {type: String, required: true}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
const TITLES = {model: "Model", effort: "Reasoning effort", context: "Memory used"};
const {agent, data, loaded} = useLeadAgent();
const controls = ref(null);
const sending = ref(false);

const groups = computed(() => (controls.value ? controls.value.groups.filter((group) => group.key === props.target) : []));
const pending = computed(() => data.value && pendingChoice(data.value, props.target));
const line = computed(() => {
    if (!data.value) return "";
    if (props.target === "model") return data.value.model || "Not reported";
    if (props.target === "effort") return `Effort ${data.value.effort || "not reported"}`;
    const marks = data.value.compactions || [];
    const compacted = marks.length ? `last compacted ${age(marks[marks.length - 1].at)}` : "not compacted yet";
    return `${Math.round(Number(data.value.context || 0))}% of the agent's memory is used; the conversation was ${compacted}`;
});

watch(
    () => data.value && `${data.value.provider}|${data.value.model}|${data.value.effort}`,
    async (now) => {
        if (!now) return;
        controls.value = await api.agentControls(data.value.provider, data.value.model, data.value.effort).catch((error) => ({groups: [], note: error.message}));
    },
    {immediate: true}
);

async function choose(group, choice) {
    if (choice.unavailable || sending.value) return;
    sending.value = true;
    try {
        await api.controlAgent(agent.value.title, group.key, choice.value);
        toast(`Asked the agent: ${choice.label}`);
        emit("back");
    } catch (error) {
        toast(error.message);
    } finally {
        sending.value = false;
    }
}
</script>

<template>
    <PhonePage :title="TITLES[target] || target" :line="line" :back="back" @back="emit('back')">
        <template v-if="loaded && !data">
            <PhoneNoAgent />
        </template>
        <template v-if="pending">
            <p class="choice-waiting" role="status">{{ pending }} is waiting for the agent to finish its turn.</p>
        </template>
        <template v-for="group in groups" :key="group.key">
            <CellGroup :head="target === 'context' ? '' : group.label" :foot="target === 'context' ? '' : controls.note">
                <template v-for="choice in group.choices" :key="choice.value">
                    <Cell :label="choice.label" :sub="choice.unavailable || choice.hint || ''" :chevron="false" @pick="choose(group, choice)">
                        <template v-if="choice.current" #end>
                            <Icon name="check" :size="16" class="choice-check" />
                        </template>
                    </Cell>
                </template>
            </CellGroup>
        </template>
    </PhonePage>
</template>

<style scoped>
.choice-waiting {
    margin: 0 0 12px;
    color: var(--text-3);
    font-size: 0.875rem;
}

.choice-check {
    flex: none;
    color: var(--accent);
}
</style>
