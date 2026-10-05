<script setup>
import {onUnmounted, watch} from "vue";
import {useAnchoredAction} from "../composables/anchored.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import AgentStopConfirm from "./AgentStopConfirm.vue";
import {ui} from "../state/ui.js";

const props = defineProps({
    environment: {type: String, required: true},
    work: {type: String, default: ""},
    stop: {type: Function, required: true},
    quiet: {type: Boolean, default: false},
    label: {type: String, default: "Stop"},
});
const emit = defineEmits(["stopped"]);
const {anchor, error, busy, toggle, run} = useAnchoredAction();

watch(anchor, (now, before) => Boolean(now) !== Boolean(before) && (ui.stopsOpen += now ? 1 : -1));
onUnmounted(() => anchor.value && (ui.stopsOpen -= 1));

async function stopped() {
    if (await run(props.stop)) emit("stopped");
}
</script>

<template>
    <span class="agent-stop">
        <Btn
            :kind="quiet ? 'ghost' : 'icon'"
            :small="quiet"
            :class="['agent-stop-button', {quiet, open: anchor}]"
            :title="`Stop the agent in ${environment}; it ends its session`"
            :aria-expanded="Boolean(anchor)"
            @click.stop="toggle"
        >
            <Icon name="stop" />
            <template v-if="quiet">{{ label }}</template>
        </Btn>
        <template v-if="anchor">
            <MenuPanel :anchor="anchor" :min-width="280" :max-width="340" @click.stop @close="anchor = null">
                <AgentStopConfirm
                    :environment="environment"
                    :work="work"
                    :busy="busy"
                    :error="error"
                    @cancel="anchor = null"
                    @stop="stopped"
                />
            </MenuPanel>
        </template>
    </span>
</template>

<style scoped>
.agent-stop {
    display: inline-flex;
    flex: none;
}

.agent-stop-button.btn:not(.quiet) {
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
}

.agent-stop-button.btn:not(.quiet) :deep(.ico) {
    width: 15px;
    height: 15px;
}

.agent-stop-button.btn:hover,
.agent-stop-button.btn.open {
    color: var(--danger);
}
</style>
