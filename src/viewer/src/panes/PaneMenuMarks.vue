<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import PaneMenuBack from "./PaneMenuBack.vue";
import PaneMenuLine from "./PaneMenuLine.vue";
import PaneMenuLink from "./PaneMenuLink.vue";
import PaneMenuToggle from "./PaneMenuToggle.vue";
import {allMarks, groupSwitched, mainOnlyToggled, toggled, visibilityChoices} from "../domain/chatVisibility.js";

const props = defineProps({hidden: {type: Array, required: true}});
const emit = defineEmits(["back", "hide"]);
const choices = computed(() => visibilityChoices(props.hidden));
const opened = ref("");
const group = computed(() => choices.value.find((choice) => choice.key === opened.value));
const shownCount = (choice) => choice.kinds.filter((kind) => kind.on).length;
</script>

<template>
    <template v-if="group">
        <PaneMenuBack @click="opened = ''">{{ group.title }}</PaneMenuBack>
        <PaneMenuToggle :on="group.on" :icon="group.icon" @click="emit('hide', groupSwitched(hidden, group))">
            Show its marks
        </PaneMenuToggle>
        <template v-if="group.on">
            <template v-if="group.details">
                <PaneMenuToggle :on="group.mainOnly" icon="list" @click="emit('hide', mainOnlyToggled(hidden, group))">
                    Only its main marks
                </PaneMenuToggle>
            </template>
            <PaneMenuLine />
            <template v-for="kind in group.kinds" :key="kind.key">
                <PaneMenuToggle :on="kind.on" :icon="kind.icon" @click="emit('hide', toggled(hidden, kind.key))">
                    {{ kind.label }}
                </PaneMenuToggle>
            </template>
        </template>
    </template>
    <template v-else>
        <PaneMenuBack @click="emit('back')">Chat marks</PaneMenuBack>
        <template v-for="choice in choices" :key="choice.key">
            <PaneMenuToggle :on="choice.on" :icon="choice.icon" @click="emit('hide', groupSwitched(hidden, choice))">
                {{ choice.title }}
            </PaneMenuToggle>
            <template v-if="choice.on">
                <PaneMenuLink
                    icon="eye"
                    :label="`${choice.title} marks`"
                    :note="`${shownCount(choice)} of ${choice.kinds.length} shown`"
                    @click="opened = choice.key"
                />
            </template>
        </template>
        <PaneMenuLine />
        <MenuItem :disabled="!hidden.length" @click="emit('hide', [])">
            <Icon name="restore" :size="14" />
            Show every chat mark
        </MenuItem>
        <MenuItem :disabled="hidden.length === allMarks().length" @click="emit('hide', allMarks())">
            <Icon name="eye" :size="14" />
            Hide every chat mark
        </MenuItem>
    </template>
</template>
