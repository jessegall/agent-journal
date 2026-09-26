<script setup>
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import {meta} from "../state/store.js";
import ChoiceList from "../kit/ChoiceList.vue";
import DropList from "../kit/DropList.vue";
import LineList from "../kit/LineList.vue";
import MarkedText from "../kit/MarkedText.vue";
import Switch from "../kit/Switch.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import TextInput from "../kit/TextInput.vue";

const props = defineProps({resource: {type: Object, required: true}});
const kind = computed(() => meta(props.resource.type));
const picks = ref({});

watch(
    () => [props.resource.type, props.resource.n, props.resource.data.board],
    () =>
        api
            .fieldChoices(props.resource.type, props.resource.n)
            .then((got) => (picks.value = got || {}))
            .catch(() => (picks.value = {})),
    {immediate: true}
);

const shapeOf = (name) =>
    (kind.value.fixed_fields || []).includes(name)
        ? "fixed"
        : picks.value[name]
          ? "pick"
          : kind.value.choices[name]
            ? "choice"
            : kind.value.fields[name];

const shown = computed(() =>
    kind.value.shown_fields.map((name) => ({
        name,
        label: kind.value.labels[name] || name,
        shape: shapeOf(name),
        value: props.resource.data[name],
    }))
);

const save = (name, value) => api.act(props.resource.type, props.resource.n, "set", {key: name, value});
const lines = (value) => (Array.isArray(value) ? value.join("\n") : String(value || ""));
const choices = (field) =>
    kind.value.choices[field.name].map((option) => ({value: option, label: option, current: field.value === option}));
const pickedLabel = (field) =>
    (picks.value[field.name] || []).find((item) => item.key === String(field.value ?? ""))?.label || "Choose…";
const fixedText = (field) => (field.value ? (field.name === "plan" ? `plan ${field.value}` : String(field.value)) : "—");

function pick(field, item) {
    if (field.name !== "board") return save(field.name, item.key);
    return api.act(props.resource.type, props.resource.n, "update", {board: Number(item.key), stage: item.first_stage});
}
</script>

<template>
    <section class="data-fields">
        <template v-for="field in shown" :key="field.name">
            <div :class="['data-field', field.shape]">
                <span class="data-label">{{ field.label }}</span>
                <SwitchCase :value="field.shape">
                    <template #fixed>
                        <MarkedText class="data-fixed" :text="fixedText(field)" />
                    </template>
                    <template #pick>
                        <DropList
                            wide
                            :label="pickedLabel(field)"
                            :items="picks[field.name]"
                            :picked="String(field.value ?? '')"
                            @pick="(item) => pick(field, item)"
                        />
                    </template>
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
    display: grid;
    grid-template-columns: max-content 1fr;
    align-items: center;
    gap: 10px 16px;
    margin: 4px 0 18px;
}

.data-field {
    display: contents;
}

.data-label {
    color: var(--text-3);
    font-size: 11.5px;
    font-weight: 500;
}

.data-fixed {
    color: var(--text-2);
    font-size: 13px;
}
</style>
