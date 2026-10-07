<script setup>
import {useAnchoredAction} from "../composables/anchored.js";
import {PROVIDER_CHOICES} from "../domain/agents.js";
import Btn from "../kit/Btn.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";

const props = defineProps({environment: {type: String, required: true}, start: {type: Function, required: true}});
const emit = defineEmits(["started"]);
const {anchor, error, toggle, run} = useAnchoredAction();

async function started(provider) {
    if (await run(() => props.start(provider))) emit("started");
}
</script>

<template>
    <span class="agent-start">
        <Btn small :class="{open: anchor}" :title="`Start an agent in ${environment}`" :aria-expanded="Boolean(anchor)" @click.stop="toggle">Start</Btn>
        <template v-if="anchor">
            <MenuPanel :anchor="anchor" :min-width="220" :max-width="280" @click.stop @close="anchor = null">
                <p class="agent-start-head">Start an agent in {{ environment }}</p>
                <template v-for="p in PROVIDER_CHOICES" :key="p.key">
                    <MenuItem @click="started(p.key)">{{ p.label }}</MenuItem>
                </template>
                <template v-if="error">
                    <p class="agent-start-error">{{ error }}</p>
                </template>
            </MenuPanel>
        </template>
    </span>
</template>

<style scoped>
.agent-start {
    display: inline-flex;
    flex: none;
}

.agent-start-head,
.agent-start-error {
    margin: 0;
    padding: 6px 12px;
    color: var(--text-3);
    font-size: 12px;
}

.agent-start-error {
    color: var(--danger);
}
</style>
