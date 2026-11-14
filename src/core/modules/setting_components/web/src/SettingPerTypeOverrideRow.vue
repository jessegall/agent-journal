<script setup>
import {computed} from "vue";
import SettingNumberField from "./SettingNumberField.vue";
import SettingRow from "./SettingRow.vue";

// one limit on a helper type screen: the value every profile has until the type is given a value of its own. An edit
// gives an own value and never changes the value of every profile; Back to every profile gives the own value up.
const props = defineProps({
    label: {type: String, required: true},
    help: {type: String, default: ""},
    everyValue: {type: Number, required: true},
    ownValue: {type: Number, default: null},
    unit: {type: String, default: ""},
    error: {type: String, default: ""},
    disabled: {type: Boolean, default: false},
});
const emit = defineEmits(["update:ownValue"]);

const isOwn = computed(() => props.ownValue !== null);
const shown = computed(() => (isOwn.value ? props.ownValue : props.everyValue));
const edit = (text) => emit("update:ownValue", text === "" ? text : Number(text));
</script>

<template>
    <SettingRow :label="label" :help="help" :source="isOwn ? 'own' : 'profile-wide'" :error="error">
        <SettingNumberField :model-value="shown" :unit="unit" :disabled="disabled" @update:model-value="edit" />
        <template v-if="isOwn">
            <button type="button" class="back" :disabled="disabled" data-back-to-every-profile @click="emit('update:ownValue', null)">Back to every profile</button>
        </template>
    </SettingRow>
</template>

<style scoped>
.back { padding: 0; border: 0; background: none; color: var(--accent-text); font: inherit; font-size: 12px; cursor: pointer; }
.back[disabled] { cursor: default; opacity: 0.5; }
</style>
