<script setup>
import Switch from "../../kit/Switch.vue";
import TimingChip from "../../kit/TimingChip.vue";
import Cell from "../kit/Cell.vue";
import PhoneSettingReset from "./PhoneSettingReset.vue";

defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["change", "timing"]);
</script>

<template>
    <Cell :label="row.label" :sub="row.hint" still>
        <template v-if="row.timing">
            <TimingChip class="timing" sheet :timing="row.timing" :prefix="row.prefix" :label="row.label" @change="emit('timing', $event)" />
        </template>
        <PhoneSettingReset :row="row" @change="emit('change', $event)" @timing="emit('timing', $event)" />
        <template #end>
            <Switch large :on="row.value" :title="row.label" @change="emit('change', $event)" />
        </template>
    </Cell>
</template>

<style scoped>
.timing {
    margin-top: 6px;
}
</style>
