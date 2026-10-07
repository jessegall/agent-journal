<script setup>
import {computed, ref} from "vue";
import {api} from "../../api/client.js";
import {useTerminal} from "../../composables/terminal.js";
import {DEFAULT_LEVEL} from "../../domain/verbosity.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import FormSheet from "../kit/FormSheet.vue";
import {toast} from "../kit/toast.js";
import PhonePage from "../settings/PhonePage.vue";
import PhoneCommandLines from "./PhoneCommandLines.vue";
import PhoneNoAgent from "./PhoneNoAgent.vue";
import {useLeadAgent} from "./lead.js";

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
const {agent, data, loaded, refresh} = useLeadAgent();
const lines = useTerminal(DEFAULT_LEVEL, () => agent.value);
const queued = computed(() => (data.value && data.value.queued_commands) || []);
const writing = ref(false);
const hurrying = ref("");

async function run(command, now) {
    try {
        await api.runShell(agent.value.title, command, now);
        toast(now ? `Running now: ${command}` : `Runs after the agent's turn: ${command}`);
        refresh();
    } catch (error) {
        toast(error.message);
    }
}
</script>

<template>
    <PhonePage title="Agent terminal" line="What the agent's terminal shows, newest last." :back="back" @back="emit('back')">
        <template v-if="loaded && !data">
            <PhoneNoAgent />
        </template>
        <template v-else>
            <template v-if="lines.length">
                <PhoneCommandLines :lines="lines" />
            </template>
            <template v-else>
                <p class="terminal-none">Nothing has run yet.</p>
            </template>
            <CellGroup head="Waiting to run" foot="A command waits until the agent finishes its turn. Run now interrupts the agent.">
                <template v-for="item in queued" :key="item.at">
                    <Cell :label="item.command" sub="Waits for the agent's turn" @pick="hurrying = item.command" />
                </template>
                <Cell icon="terminal" label="Run a command" @pick="writing = true" />
            </CellGroup>
        </template>
    </PhonePage>
    <template v-if="writing">
        <FormSheet
            title="Run a command"
            sub="It runs in the agent's terminal after its turn."
            :fields="[{key: 'command', label: 'Command', placeholder: 'npm test', required: true, verbatim: true}]"
            button="Run"
            @close="writing = false"
            @submit="({command}) => run(command, false)"
        />
    </template>
    <template v-if="hurrying">
        <FormSheet :title="`Run ${hurrying} now?`" sub="The agent is interrupted and runs it at once." button="Run now" @close="hurrying = ''" @submit="run(hurrying, true)" />
    </template>
</template>

<style scoped>
.terminal-none {
    margin: 0 0 14px;
    color: var(--text-3);
    font-size: 0.9375rem;
}
</style>
