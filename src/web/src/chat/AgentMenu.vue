<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {stopAgentNamed} from "../actions/agents.js";
import {useAnchoredAction} from "../composables/anchored.js";
import {currentWork} from "../domain/agentState.js";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import {peek, route} from "../route.js";
import {rows} from "../sync/rows.js";
import AgentStopConfirm from "./AgentStopConfirm.vue";

const props = defineProps({agent: {type: Object, required: true}});
const emit = defineEmits(["done"]);
const stopping = ref(false);
const {busy, error, run} = useAnchoredAction();
const work = computed(() => currentWork(rows("work"))?.title || "");

function openPage() {
    emit("done");
    peek("agent", props.agent.n);
}

async function stop() {
    if (await run(() => stopAgentNamed(api, route.value.env))) emit("done");
}
</script>

<template>
    <template v-if="stopping">
        <AgentStopConfirm :environment="route.env" :work="work" :busy="busy" :error="error" @cancel="stopping = false" @stop="stop" />
    </template>
    <template v-else>
        <MenuItem @click="openPage">
            <Icon name="agents" :size="14" />
            Open the agent's page
        </MenuItem>
        <MenuItem @click="stopping = true">
            <Icon name="stop" :size="14" />
            Stop the agent
        </MenuItem>
    </template>
</template>
