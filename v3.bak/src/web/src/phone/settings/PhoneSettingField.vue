<script setup>
import Field from "../kit/Field.vue";
import PhoneSettingReset from "./PhoneSettingReset.vue";

const props = defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["change", "timing"]);
const typed = (event) => emit("change", props.row.kind === "number" ? Number(event.target.value) : event.target.value);
</script>

<template>
    <div class="field">
        <Field
            :model-value="row.value"
            :label="row.label"
            label-size="large"
            :type="row.kind"
            :unit="row.unit"
            :hint="row.hint"
            min="0"
            :inputmode="row.kind === 'number' ? 'numeric' : undefined"
            @change="typed"
        />
        <PhoneSettingReset :row="row" @change="emit('change', $event)" @timing="emit('timing', $event)" />
    </div>
</template>

<style scoped>
.field {
    padding: 10px 14px 12px;
}
</style>
