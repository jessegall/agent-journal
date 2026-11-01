<script setup>
import {computed, onMounted, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import MenuPanel from "../kit/MenuPanel.vue";

// what the agent bar does to the agent, as version 4's did: start one where none runs, change its model, effort and context, and stop it after asking
const props = defineProps({agent: {type: Object, default: null}, run: {type: Function, required: true}});
const emit = defineEmits(["changed"]);
const groups = ref([]);
const programs = ref([]);
const failure = ref("");
const told = ref("");
const anchor = ref(null);
const opened = ref("");
const asking = ref(false);
const running = computed(() => Boolean(props.agent) && !props.agent.ended_at);
const group = computed(() => groups.value.find((one) => one.key === opened.value));

async function readChoices() {
    if (running.value) {
        const answer = await props.run(["agent", "controls", String(props.agent.id)]);
        groups.value = answer.ok ? answer.value.groups : [];
    } else {
        const answer = await props.run(["agent", "programs"]);
        programs.value = answer.ok ? answer.value.rows : [];
    }
}

function open(event, key) {
    anchor.value = event.currentTarget;
    opened.value = key;
}

function close() {
    anchor.value = null;
    opened.value = "";
}

async function act(line, word) {
    close();
    const answer = await props.run(line);
    failure.value = answer.ok ? "" : answer.error;
    told.value = answer.ok ? word : "";
    emit("changed");
}

const choose = (key, choice) => act(["agent", "control", String(props.agent.id), key, choice.value], `${choice.label} was sent to the agent`);
const start = (program) => act(["agent", "launch", program.name], `${program.title} is starting`);

async function stop() {
    asking.value = false;
    await act(["agent", "stop", String(props.agent.id)], "The agent is stopped");
}

onMounted(readChoices);
watch(running, readChoices);
</script>

<template>
    <span class="agent-controls" data-agent-controls>
        <template v-if="failure">
            <span class="agent-failure" role="alert" data-agent-failure :title="failure">{{ failure }}</span>
        </template>
        <template v-else-if="told">
            <span class="agent-told" data-agent-told>{{ told }}</span>
        </template>
        <template v-if="running">
            <template v-for="one in groups" :key="one.key">
                <Btn small :data-agent-control="one.key" @click="open($event, one.key)">{{ one.label }}</Btn>
            </template>
            <template v-if="asking">
                <span class="agent-ask" data-agent-stop-ask>Stop the agent? It stops what it is doing.</span>
                <Btn small kind="primary" data-agent-stop-confirm @click="stop">Stop it</Btn>
                <Btn small @click="asking = false">Keep it running</Btn>
            </template>
            <template v-else>
                <Btn small data-agent-stop @click="asking = true">Stop</Btn>
            </template>
        </template>
        <template v-else>
            <Btn small data-agent-start @click="open($event, 'start')">Start an agent</Btn>
        </template>
        <template v-if="anchor">
            <MenuPanel :anchor="anchor" :min-width="180" @close="close">
                <template v-if="group">
                    <MenuLabel>{{ group.label }}</MenuLabel>
                    <template v-for="choice in group.choices" :key="choice.value">
                        <MenuItem :data-agent-choice="choice.value" @click="choose(group.key, choice)">{{ choice.label }}</MenuItem>
                    </template>
                </template>
                <template v-else>
                    <MenuLabel>Start an agent</MenuLabel>
                    <template v-for="program in programs" :key="program.name">
                        <MenuItem :data-agent-program="program.name" @click="start(program)">{{ program.title }}</MenuItem>
                    </template>
                </template>
            </MenuPanel>
        </template>
    </span>
</template>

<style scoped>
.agent-controls {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
}

.agent-failure {
    max-width: 320px;
    overflow: hidden;
    color: var(--danger);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.agent-told,
.agent-ask {
    color: var(--text-2);
    font-size: 12px;
}
</style>
