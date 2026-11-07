<script setup>
import {computed, reactive, ref, watch} from "vue";
import {Btn, Switch, useWindow} from "@journal/window-kit";

const props = defineProps({group: {type: String, required: true}});
const view = useWindow();
const work = view.props.work;
const draft = reactive({});
const base = ref("");
const failure = ref("");
const pending = ref(false);

const fields = computed(() => (work.data.value?.fields ?? []).filter((field) => field.group === props.group));
const original = (field) => (field.type === "flag" ? Boolean(field.value) : String(field.value));
const changed = computed(() => fields.value.filter((field) => draft[field.key] !== original(field)));
const dirty = computed(() => changed.value.length > 0);
const stale = computed(() => dirty.value && base.value && work.data.value?.revision !== base.value);
const word = (field) => (field.type === "flag" ? (draft[field.key] ? "on" : "off") : String(draft[field.key]).trim());
const blank = computed(() => changed.value.some((field) => field.type !== "flag" && word(field) === ""));

function reset() {
    for (const field of fields.value) draft[field.key] = original(field);
    base.value = work.data.value?.revision ?? "";
    failure.value = "";
}

watch(() => work.data.value, () => { if (!dirty.value) reset(); }, {immediate: true});

async function apply() {
    pending.value = true;
    const answer = await view.run(`work-settings apply --revision ${base.value} ${changed.value.map((field) => `${field.key}=${word(field)}`).join(" ")}`);
    pending.value = false;
    failure.value = answer.ok ? "" : answer.error;
    await view.reload("work");
    if (answer.ok) reset();
}
</script>

<template>
    <section class="group" :data-agent-settings-group="group">
        <label v-for="field in fields" :key="field.key" class="group-row" :data-control="field.key">
            <span class="group-text">
                <span class="group-label">{{ field.title }}</span>
                <span class="group-line">{{ field.description }}</span>
                <span class="group-source">{{ field.source }}</span>
            </span>
            <Switch v-if="field.type === 'flag'" :on="draft[field.key]" @change="draft[field.key] = !draft[field.key]" />
            <input v-else v-model="draft[field.key]" class="group-input" type="number" min="0" step="any" :data-field="field.key">
        </label>
        <p v-if="blank" class="group-hint" data-group-blank>A number is missing.</p>
        <p v-if="stale" class="group-hint" role="alert" data-group-stale>These settings changed since you opened them. Cancel to read them again.</p>
        <p v-if="failure" class="group-failure" role="alert" data-group-failure>{{ failure }}</p>
        <div class="group-buttons">
            <Btn :disabled="!dirty || pending" data-group-cancel @click="reset">Cancel</Btn>
            <Btn :disabled="!dirty || pending || stale || blank" data-group-apply @click="apply">Apply</Btn>
        </div>
    </section>
</template>

<style scoped>
.group { display: flex; flex-direction: column; gap: 10px; padding: 12px; }
.group-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.group-text { display: flex; flex-direction: column; }
.group-label { font-size: 13px; color: var(--text); }
.group-line, .group-source { font-size: 12px; color: var(--text-2); }
.group-input { width: 90px; }
.group-hint { margin: 0; font-size: 12px; color: var(--text-2); }
.group-failure { margin: 0; font-size: 12px; color: var(--danger); }
.group-buttons { display: flex; justify-content: flex-end; gap: 8px; }
</style>
