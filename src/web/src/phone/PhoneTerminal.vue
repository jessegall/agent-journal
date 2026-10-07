<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import TerminalWindow from "../chat/TerminalWindow.vue";
import {leadOf} from "../composables/leadAgent.js";
import {pollKey, usePoll} from "../composables/poll.js";
import BigTitle from "./kit/BigTitle.vue";
import EmptyList from "./kit/EmptyList.vue";
import NavBar from "./kit/NavBar.vue";

const AGENTS_EVERY = 5000;
const AGENTS_KEPT = 20;

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
const agents = ref(null);
const agent = computed(() => leadOf(agents.value || []));

usePoll(
    pollKey(),
    () => api.agents(AGENTS_KEPT),
    AGENTS_EVERY,
    (got) => (agents.value = got)
);
</script>

<template>
    <div class="screen phone-terminal">
        <NavBar title="Terminal" :back="back" @back="emit('back')" />
        <BigTitle title="Terminal" sub="Shows what the agent's terminal shows. A command you type runs there." />
        <template v-if="agents && !agent">
            <div class="screen-scroll">
                <EmptyList icon="terminal" title="No agent yet" reason="Start the agent in this environment and its terminal shows here." />
            </div>
        </template>
        <template v-else>
            <div class="phone-terminal-body">
                <TerminalWindow :agent="agent" />
            </div>
        </template>
    </div>
</template>

<style scoped>
.phone-terminal-body {
    flex: 1;
    min-height: 0;
    padding-bottom: env(safe-area-inset-bottom);
    background: var(--code-bg);
}

.phone-terminal-body :deep(.console) {
    padding: 12px 16px;
    font-size: 12.5px;
}

.phone-terminal-body :deep(.terminal-run) {
    min-height: 44px;
    padding: 4px 16px 8px;
    font-size: 16px;
}
</style>
