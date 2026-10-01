<script setup>
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import ToggleItem from "../kit/ToggleItem.vue";
import PaneMenuBack from "./PaneMenuBack.vue";
import PaneMenuLine from "./PaneMenuLine.vue";
import PaneMenuPick from "./PaneMenuPick.vue";
import PaneMenuToggle from "./PaneMenuToggle.vue";
import {agentView, resetAgentView} from "../composables/agentsShown.js";
import {KIND_SWITCHES, ORDERS, STATE_SWITCHES} from "../domain/orchestra.js";

const emit = defineEmits(["back"]);
</script>

<template>
    <PaneMenuBack @click="emit('back')">View</PaneMenuBack>
    <MenuLabel>Show agents that are</MenuLabel>
    <template v-for="s in STATE_SWITCHES" :key="s.key">
        <PaneMenuToggle :on="agentView.states[s.key]" :icon="s.icon" @click="agentView.states[s.key] = !agentView.states[s.key]">
            {{ s.label }}
        </PaneMenuToggle>
    </template>
    <MenuLabel>Working for</MenuLabel>
    <template v-for="s in KIND_SWITCHES" :key="s.key">
        <PaneMenuToggle :on="agentView.kinds[s.key]" :icon="s.icon" @click="agentView.kinds[s.key] = !agentView.kinds[s.key]">
            {{ s.label }}
        </PaneMenuToggle>
    </template>
    <ToggleItem :on="agentView.unfinished" icon="flag" @click="agentView.unfinished = !agentView.unfinished">
        Only with an unfinished plan
    </ToggleItem>
    <MenuLabel>Order</MenuLabel>
    <template v-for="o in ORDERS" :key="o.key">
        <PaneMenuPick :icon="o.icon" :label="o.label" :current="agentView.order === o.key" @click="agentView.order = o.key" />
    </template>
    <PaneMenuLine />
    <MenuItem @click="resetAgentView">
        <Icon name="restore" :size="14" />
        Show every agent
    </MenuItem>
</template>
