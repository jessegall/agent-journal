<script setup>
import {Switch} from "@journal/window-kit";
import SettingRow from "./SettingRow.vue";

// one setting that is on or off: its name and what it does, and the switch with its word
defineProps({control: {type: Object, required: true}, on: {type: Boolean, default: false}, disabled: {type: Boolean, default: false}});
defineEmits(["change"]);
</script>

<template>
    <SettingRow :label="control.label" :help="control.line" :data-control="control.key">
        <Switch :on="on" :disabled="disabled" @change="$emit('change')" /><span class="sw-word">{{ on ? "On" : "Off" }}</span>
    </SettingRow>
</template>

<style scoped>
.sw-word { color: var(--text-2); font-size: 12px; }
</style>
