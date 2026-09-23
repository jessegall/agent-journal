<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import SidePanel from "../kit/SidePanel.vue";
import AgentScreen from "../chat/AgentScreen.vue";

const props = defineProps({card: Object});
const emit = defineEmits(["close", "stopped"]);
const asking = ref(false);

async function stop() {
    if (!asking.value) return (asking.value = true);
    await api.act("ticket", props.card.n, "stop");
    emit("stopped");
    emit("close");
}
</script>

<template>
    <SidePanel :title="`#${card.n} ${card.title}`" :abstract="card.reason" width="wide" @close="emit('close')">
        <template #actions>
            <Btn small :kind="asking ? 'primary' : 'ghost'" @click="stop">{{ asking ? "Stop it now" : "Stop its agent" }}</Btn>
        </template>
        <p class="hint">This is the agent's own terminal. Click into it and type to talk to the agent.</p>
        <AgentScreen :session="card.session" />
    </SidePanel>
</template>

<style scoped>
.hint {
    margin: 0 0 10px;
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
