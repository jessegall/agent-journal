<script setup>
import ColorSwatch from "../../kit/ColorSwatch.vue";
import SwitchCase from "../../kit/SwitchCase.vue";
import TimingChip from "../../kit/TimingChip.vue";
import Cell from "../kit/Cell.vue";
import PhoneSettingButtons from "./PhoneSettingButtons.vue";
import PhoneSettingChoice from "./PhoneSettingChoice.vue";
import PhoneSettingField from "./PhoneSettingField.vue";
import PhoneSettingSwitch from "./PhoneSettingSwitch.vue";

defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["change", "timing", "act"]);
</script>

<template>
    <SwitchCase :value="row.kind">
        <template #switch>
            <PhoneSettingSwitch :row="row" @change="emit('change', $event)" @timing="emit('timing', $event)" />
        </template>
        <template #always>
            <Cell :label="row.label" :sub="row.hint" still>
                <template #end><span class="always">Always on</span></template>
            </Cell>
        </template>
        <template #timing>
            <Cell :label="row.label" still>
                <TimingChip sheet :timing="row.timing" :label="row.label" @change="emit('timing', $event)" />
            </Cell>
        </template>
        <template #number>
            <PhoneSettingField :row="row" @change="emit('change', $event)" />
        </template>
        <template #text>
            <PhoneSettingField :row="row" @change="emit('change', $event)" />
        </template>
        <template #choice>
            <PhoneSettingChoice :row="row" @change="emit('change', $event)" />
        </template>
        <template #color>
            <Cell :label="row.label" :sub="row.hint" still>
                <template #end>
                    <ColorSwatch :value="row.value" :label="row.label" @change="emit('change', $event)" />
                </template>
            </Cell>
        </template>
        <template #buttons>
            <PhoneSettingButtons :row="row" @act="emit('act', $event)" />
        </template>
        <template #danger>
            <PhoneSettingButtons :row="row" tone="danger" @act="emit('act', $event)" />
        </template>
    </SwitchCase>
</template>

<style scoped>
.always {
    color: var(--text-3);
    font-size: 0.875rem;
}
</style>
