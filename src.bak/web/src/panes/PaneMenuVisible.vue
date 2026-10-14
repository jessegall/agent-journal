<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import PaneMenuBack from "./PaneMenuBack.vue";
import PaneMenuLine from "./PaneMenuLine.vue";
import PaneMenuToggle from "./PaneMenuToggle.vue";
import {visibilityChoices, toggled} from "../domain/chatVisibility.js";

const props = defineProps({hidden: {type: Array, required: true}});
const emit = defineEmits(["back", "hide"]);
const choices = computed(() => visibilityChoices(props.hidden));
</script>

<template>
    <PaneMenuBack @click="emit('back')">Show in chat</PaneMenuBack>
    <template v-for="group in choices" :key="group.title">
        <MenuLabel>{{ group.title }}</MenuLabel>
        <template v-for="kind in group.kinds" :key="kind.key">
            <PaneMenuToggle :on="kind.on" :icon="kind.icon" @click="emit('hide', toggled(hidden, kind.key))">
                {{ kind.label }}
            </PaneMenuToggle>
        </template>
    </template>
    <PaneMenuLine />
    <MenuItem :disabled="!hidden.length" @click="emit('hide', [])">
        <Icon name="restore" :size="14" />
        Show everything
    </MenuItem>
</template>
