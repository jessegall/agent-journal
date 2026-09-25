<script setup>
import {computed} from "vue";
import {api} from "../api/client.js";
import {meta} from "../state/store.js";
import ChoiceList from "../kit/ChoiceList.vue";
import LineList from "../kit/LineList.vue";
import Switch from "../kit/Switch.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import TextInput from "../kit/TextInput.vue";

const props = defineProps({resource: {type: Object, required: true}});
const kind = computed(() => meta(props.resource.type));
const shown = computed(() =>
    kind.value.shown_fields.map((name) => ({
        name,
        label: kind.value.labels[name] || name,
        shape: kind.value.choices[name] ? "choice" : kind.value.fields[name],
        value: props.resource.data[name],
    }))
);

const save = (name, value) => api.act(props.resource.type, props.resource.n, "set", {key: name, value});
const lines = (value) => (Array.isArray(value) ? value.join("\n") : String(value || ""));
const choices = (field) =>
    kind.value.choices[field.name].map((option) => ({value: option, label: option, current: field.value === option}));
</script>

<template>
    <section class="data-fields">
        <template v-for="field in shown" :key="field.name">
            <div :class="['data-field', field.shape]">
                <span class="data-label">{{ field.label }}</span>
                <SwitchCase :value="field.shape">
                    <template #list>
                        <LineList :value="lines(field.value)" @change="(value) => save(field.name, value.split('\n').filter(Boolean))" />
                    </template>
                    <template #flag>
                        <Switch :on="Boolean(field.value)" :title="field.label" @change="(on) => save(field.name, on)" />
                    </template>
                    <template #choice>
                        <ChoiceList :choices="choices(field)" @pick="(value) => save(field.name, value)" />
                    </template>
                    <template #default>
                        <TextInput :value="field.value || ''" @change="save(field.name, $event.target.value)" />
                    </template>
                </SwitchCase>
            </div>
        </template>
    </section>
</template>

<style scoped>
.data-fields {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 4px 0 18px;
}

.data-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.data-field.flag {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.data-label {
    color: var(--text-3);
    font-size: 11.5px;
    font-weight: 500;
}
</style>
