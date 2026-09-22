<script setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import ChoiceList from "../kit/ChoiceList.vue";
import {route} from "../route.js";
import {label, meta, word} from "../state/store.js";

const props = defineProps({type: String});
const emit = defineEmits(["made", "close"]);
const title = ref("");
const abstract = ref("");
const brief = ref("");
const error = ref("");
const templates = ref([]);
const template = ref(0);
const values = reactive({});
const fields = computed(() => templates.value.find((t) => t.n === template.value)?.data?.fields || []);
watch(fields, (list) => {
    Object.keys(values).forEach((key) => delete values[key]);
    list.forEach((f) => (values[f.name] = f.default || (f.kind === "choice" ? f.options[0] : "")));
});

const choices = computed(() => [
    {value: 0, label: "No template", current: template.value === 0},
    ...templates.value.map((t) => ({value: t.n, label: t.title, current: template.value === t.n})),
]);

onMounted(async () => {
    if (props.type === "template") {
        return;
    }
    const rows = await api.all("template").catch(() => []);
    templates.value = rows.filter(
        (t) => !t.completed && !t.deleted && (!(t.data?.applies_to || []).length || t.data.applies_to.includes(props.type))
    );
});

async function submit() {
    error.value = "";
    try {
        const resource = await api.create(props.type, {
            title: title.value,
            abstract: abstract.value,
            brief: brief.value,
            ...(template.value ? {template: template.value, template_values: {...values}} : {}),
        });
        emit("made", resource.n);
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <form class="new" @submit.prevent="submit">
        <input v-model="title" :placeholder="`${meta(type).title} title`" maxlength="80" autofocus @keydown.esc="emit('close')" />
        <input v-model="abstract" :placeholder="label(type, 'abstract', 'One short line about it')" maxlength="200" />
        <textarea v-model="brief" :placeholder="label(type, 'brief', 'As long as it needs to be')" rows="3" />
        <div v-if="templates.length" class="template">
            <span class="label">Start from</span>
            <ChoiceList :choices="choices" @pick="template = $event" />
        </div>
        <template v-if="fields.length">
            <div class="fields">
                <label v-for="f in fields" :key="f.name" class="field">
                    <span class="label">{{ f.label }}</span>
                    <template v-if="f.kind === 'choice'">
                        <ChoiceList
                            :choices="f.options.map((o) => ({value: o, label: o, current: values[f.name] === o}))"
                            @pick="values[f.name] = $event"
                        />
                    </template>
                    <template v-else>
                        <input v-model="values[f.name]" :type="f.kind === 'number' ? 'number' : 'text'" :placeholder="f.default || ''" />
                    </template>
                </label>
            </div>
        </template>
        <div class="foot">
            <span class="error">{{ error }}</span>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn kind="primary" @click="submit">{{ word(type, "create").replace(/^\w/, (c) => c.toUpperCase()) }}</Btn>
        </div>
    </form>
</template>

<style scoped>
.new {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 22px;
    border-bottom: 1px solid var(--border);
    background: var(--raised);
}
input,
textarea {
    padding: 8px 11px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    resize: vertical;
}
.template {
    display: flex;
    align-items: center;
    gap: 10px;
}
.label {
    color: var(--text-3);
    font-size: 12px;
}
.foot {
    display: flex;
    align-items: center;
    gap: 8px;
}
.error {
    flex: 1;
    color: var(--danger);
    font-size: 12px;
}

.fields {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
}
.field {
    display: flex;
    align-items: center;
    gap: 10px;
}
.field input {
    flex: 1;
}
</style>
