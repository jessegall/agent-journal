<script setup>
import {computed, nextTick, onMounted, reactive, ref} from "vue";
import Segmented from "../../kit/Segmented.vue";
import Button from "./Button.vue";
import Field from "./Field.vue";
import PhoneSheet from "../PhoneSheet.vue";

const props = defineProps({
    title: {type: String, required: true},
    sub: {type: String, default: ""},
    fields: {type: Array, default: () => []},
    button: {type: String, required: true},
    keep: {type: String, default: "Cancel"},
    danger: {type: Boolean, default: false},
});
const emit = defineEmits(["close", "submit"]);
const values = reactive(Object.fromEntries(props.fields.map((field) => [field.key, field.value || ""])));
const form = ref(null);
const ready = computed(() => props.fields.every((field) => !field.required || String(values[field.key]).trim()));
let sent = null;

onMounted(() => nextTick(() => form.value?.querySelector("input, textarea")?.focus({preventScroll: true})));

function submit(close) {
    if (!ready.value) return;
    sent = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, String(value).trim()]));
    close();
}

function closed() {
    if (sent) emit("submit", sent);
    emit("close");
}
</script>

<template>
    <PhoneSheet v-slot="{close}" :label="title" :body-drag="!fields.length" :tall="fields.some((field) => field.area)" @close="closed">
        <h2 class="form-title">{{ title }}</h2>
        <template v-if="sub">
            <p class="form-sub">{{ sub }}</p>
        </template>
        <form ref="form" class="form-body" @submit.prevent="submit(close)">
            <template v-for="field in fields" :key="field.key">
                <template v-if="field.options">
                    <div class="form-field">
                        <span :id="`form-${field.key}`" class="form-label">{{ field.label }}</span>
                        <Segmented
                            :options="field.options"
                            :value="values[field.key]"
                            fill
                            :aria-labelledby="`form-${field.key}`"
                            @pick="values[field.key] = $event"
                        />
                    </div>
                </template>
                <template v-else>
                    <Field
                        v-model="values[field.key]"
                        :label="field.label"
                        :area="field.area"
                        :verbatim="field.verbatim"
                        :placeholder="field.placeholder || ''"
                        :list="field.choices ? `form-${field.key}` : null"
                    />
                    <template v-if="field.choices">
                        <datalist :id="`form-${field.key}`">
                            <template v-for="choice in field.choices" :key="choice">
                                <option :value="choice" />
                            </template>
                        </datalist>
                    </template>
                </template>
            </template>
            <div class="form-controls">
                <Button :kind="danger ? 'danger' : 'primary'" fill :disabled="!ready" @click="submit(close)">{{ button }}</Button>
                <Button kind="plain" fill @click="close">{{ keep }}</Button>
            </div>
        </form>
    </PhoneSheet>
</template>

<style scoped>
.form-title {
    margin: 4px 0 6px;
    font-size: 1.0625rem;
    font-weight: 600;
    text-align: center;
}

.form-sub {
    margin: 0 0 12px;
    color: var(--text-3);
    font-size: 0.875rem;
    text-align: center;
    text-wrap: pretty;
}

.form-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 12px;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-label {
    color: var(--text-2);
    font-size: 0.8125rem;
}

.form-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: auto;
    padding-top: 4px;
}
</style>
