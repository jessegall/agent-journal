<script setup>
import {computed} from "vue";
import PaneMenuBack from "./PaneMenuBack.vue";
import PaneMenuLine from "./PaneMenuLine.vue";
import PaneMenuLink from "./PaneMenuLink.vue";
import PaneMenuToggle from "./PaneMenuToggle.vue";
import {presets, presetOf} from "../domain/chatVisibility.js";

const props = defineProps({hidden: {type: Array, required: true}});
const emit = defineEmits(["back", "hide", "open"]);
const preset = computed(() => presetOf(props.hidden));
const choices = computed(() => presets());
</script>

<template>
    <PaneMenuBack @click="emit('back')">Show in chat</PaneMenuBack>
    <template v-for="choice in choices" :key="choice.key">
        <PaneMenuToggle :on="preset === choice.key" :icon="choice.icon" @click="emit('hide', choice.hidden)">
            {{ choice.label }}
        </PaneMenuToggle>
    </template>
    <PaneMenuLine />
    <PaneMenuLink icon="eye" label="Chat marks" :note="hidden.length ? `${hidden.length} hidden` : ''" @click="emit('open')" />
</template>
