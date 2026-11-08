<script setup>
import {computed, reactive, ref, watch} from "vue";
import {Switch, useWindow} from "@journal/window-kit";
import NumberStep from "./NumberStep.vue";
import SettingRow from "./SettingRow.vue";
import SettingsFoot from "./SettingsFoot.vue";

const props = defineProps({group: {type: String, required: true}});
const view = useWindow();
const work = view.props.work;
const draft = reactive({});
const base = ref("");
const failure = ref("");
const pending = ref(false);

const fields = computed(() => (work.data.value?.fields ?? []).filter((field) => field.group === props.group));
// a field shows only while every switch it depends on is on in the draft
const shownFields = computed(() => fields.value.filter((field) => (work.data.value?.depends?.[field.key] ?? []).every((key) => draft[key] !== false)));
const original = (field) => (field.type === "flag" ? Boolean(field.value) : String(field.value));
const isChanged = (field) => (field.type === "flag" ? draft[field.key] : String(draft[field.key])) !== original(field);
const changed = computed(() => fields.value.filter(isChanged));
const dirty = computed(() => changed.value.length > 0);
const stale = computed(() => dirty.value && base.value && work.data.value?.revision !== base.value);
const word = (field) => (field.type === "flag" ? (draft[field.key] ? "on" : "off") : String(draft[field.key]).trim());
const blank = computed(() => changed.value.some((field) => field.type !== "flag" && word(field) === ""));

function reset() {
    for (const field of fields.value) draft[field.key] = original(field);
    base.value = work.data.value?.revision ?? "";
    failure.value = "";
}

watch(() => work.data.value, () => { if (!base.value || !dirty.value) reset(); }, {immediate: true});

const problem = computed(() => failure.value || (stale.value ? "These settings changed since you opened them. Cancel to read them again." : "") || (blank.value ? "A number is missing." : ""));

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
        <template v-for="field in shownFields" :key="field.key">
            <SettingRow :label="field.title" :help="field.description" :source="field.source" :changed="isChanged(field)" :data-control="field.key">
                <template v-if="field.type === 'flag'">
                    <Switch :on="draft[field.key]" :disabled="view.readOnly" @change="draft[field.key] = !draft[field.key]" /><span class="sw-word">{{ draft[field.key] ? "On" : "Off" }}</span>
                </template>
                <template v-else-if="field.choices?.length">
                    <select class="choice" :value="draft[field.key]" :disabled="view.readOnly" :data-field="field.key" @change="draft[field.key] = $event.target.value">
                        <template v-for="choice in field.choices" :key="choice"><option :value="String(choice)">{{ choice / 1000 }}k</option></template>
                    </select>
                </template>
                <template v-else>
                    <NumberStep v-model="draft[field.key]" :disabled="view.readOnly" :data-field="field.key" />
                </template>
            </SettingRow>
        </template>
        <SettingsFoot :changes="changed.length" :pending="pending" :problem="problem" :blocked="stale || blank" @cancel="reset" @apply="apply" />
    </section>
</template>

<style scoped>
.group { margin-top: 14px; }
.sw-word { color: var(--text-2); font-size: 12px; }
.choice { padding: 4px 6px; border: 1px solid var(--border-2); border-radius: 6px; background: var(--bg); color: var(--text); font: inherit; font-size: 12px; }
</style>
