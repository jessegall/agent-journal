<script setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
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
const depth = ref("normal");
const details = ref("");
const detailing = ref(false);
const files = ref([]);
const DEPTHS = [
    {value: "normal", label: "Normal: a good plan, not every detail"},
    {value: "thorough", label: "Thorough: researched, a to-do for every small thing"},
];
const depths = computed(() => DEPTHS.map((d) => ({...d, current: depth.value === d.value})));
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
            ...(props.type === "plan" ? {depth: depth.value} : {}),
            ...(template.value ? {template: template.value, template_values: {...values}} : {}),
        });
        if (details.value.trim()) await api.act(props.type, resource.n, "section", {title: "Details", body: details.value.trim()});
        for (const file of files.value) await api.upload(props.type, resource.n, file);
        emit("made", resource.n);
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <Dialog :title="`New ${meta(type).title.toLowerCase()}`" @close="emit('close')">
        <form class="new" @submit.prevent="submit">
            <input v-model="title" class="new-title" :placeholder="`${meta(type).title} title`" maxlength="80" autofocus />
            <input v-model="abstract" :placeholder="label(type, 'abstract', 'One short line about it')" maxlength="200" />
            <textarea v-model="brief" :placeholder="label(type, 'brief', 'As long as it needs to be')" rows="10" />
            <template v-if="detailing">
                <textarea v-model="details" placeholder="Extra details, as long as they need to be" rows="6" />
            </template>
            <template v-if="files.length">
                <div class="files">
                    <template v-for="(file, i) in files" :key="file.name + i">
                      <span class="file">
                          {{ file.name }}
                          <button type="button" class="file-x" title="Leave this file out" @click="files.splice(i, 1)">×</button>
                      </span>
                    </template>
                </div>
            </template>
            <div class="extras">
                <template v-if="!detailing">
                    <button type="button" class="extra" @click="detailing = true">Add details</button>
                </template>
                <label class="extra">
                    Attach files
                    <input type="file" multiple hidden @change="files = [...files, ...$event.target.files]" />
                </label>
            </div>
            <template v-if="type === 'plan'">
              <div class="template">
                  <span class="label">How thorough</span>
                  <ChoiceList :choices="depths" @pick="depth = $event" />
              </div>
            </template>
            <template v-if="templates.length">
              <div class="template">
                  <span class="label">Start from</span>
                  <ChoiceList :choices="choices" @pick="template = $event" />
              </div>
            </template>
            <template v-if="fields.length">
                <div class="fields">
                    <template v-for="f in fields" :key="f.name">
                      <label class="field">
                          <span class="label">{{ f.label }}</span>
                          <template v-if="f.kind === 'choice'">
                              <ChoiceList
                                  :choices="f.options.map((o) => ({value: o, label: o, current: values[f.name] === o}))"
                                  @pick="values[f.name] = $event"
                              />
                          </template>
                          <template v-else>
                              <input
                                  v-model="values[f.name]"
                                  :type="f.kind === 'number' ? 'number' : 'text'"
                                  :placeholder="f.default || ''"
                              />
                          </template>
                      </label>
                    </template>
                </div>
            </template>
            <div class="foot">
                <span class="error">{{ error }}</span>
                <Btn @click="emit('close')">Cancel</Btn>
                <Btn kind="primary" @click="submit">{{ word(type, "create").replace(/^\w/, (c) => c.toUpperCase()) }}</Btn>
            </div>
        </form>
    </Dialog>
</template>

<style scoped>
.new {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.new-title {
    font-size: 15px;
    font-weight: 500;
}
input,
textarea {
    padding: 8px 11px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    resize: vertical;
}
.extras {
    display: flex;
    gap: 14px;
}

.extra {
    padding: 0;
    border: none;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
}

.extra:hover {
    color: var(--text);
}

.files {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.file {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-2);
    font-size: 12px;
}

.file-x {
    padding: 0;
    border: none;
    background: none;
    color: var(--text-4);
    cursor: pointer;
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
