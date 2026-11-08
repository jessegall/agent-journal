<script setup>
import {computed, reactive, ref, watch} from "vue";
import {Btn, Switch, useWindow} from "@journal/window-kit";

const CONTROLS = [
    {key: "journal.suites.coding.auto-mode", label: "Auto mode", line: "The journal hands the main agent its next task, and it keeps going while tasks are left"},
    {key: "journal.suites.coding.main-writes-code", label: "Main agent writes code", line: "The main agent may change project files itself; off, it plans, delegates and merges"},
    {key: "journal.suites.coding.workers.main-dispatches-workers", label: "Main agent sends workers", line: "Whether the main agent may send workers to do tasks."},
    {key: "journal.suites.coding.continue-while-delegatable", label: "Keep going while work can be delegated", line: "Keep the main agent working while open tasks can still be sent to workers."},
    {key: "journal.suites.coding.workers.merger-on", label: "Merger takes in workers", line: "A helper merges workers whose tests passed, and passes on what the main agent must judge."},
    {key: "journal.suites.coding.main-starts-helpers", label: "Use ordinary helpers", line: "Whether the main agent may start ordinary helpers."},
    {key: "journal.suites.coding.designer-enabled", label: "Use a designer", line: "Whether the main agent may start a designer, which writes a design document and changes no code."},
    {key: "journal.suites.coding.workers.main-agent-may-merge", label: "Main agent may merge workers", line: "Whether the main agent may merge the work of a worker itself."},
];
const PRESETS = [{key: "builder", label: "Builder"}, {key: "orchestrator", label: "Orchestrator"}];
const AUTO = CONTROLS[0].key;
const DISPATCHES = CONTROLS[1].key;

const view = useWindow();
const work = view.props.work;
const draft = reactive({});
const base = ref("");
const failure = ref("");
const pending = ref(false);

const changed = computed(() => CONTROLS.filter((control) => draft[control.key] !== work.data.value?.controls?.[control.key]));
const dirty = computed(() => changed.value.length > 0);
const stale = computed(() => dirty.value && work.data.value && base.value && work.data.value.revision !== base.value);
const workflow = computed(() => work.data.value?.workflow ?? "");
const nothingStarts = computed(() => draft[AUTO] === false && draft[DISPATCHES] === false);

function reset() {
    const current = work.data.value;
    if (!current) return;
    for (const control of CONTROLS) draft[control.key] = current.controls[control.key];
    base.value = current.revision;
    failure.value = "";
}

watch(() => work.data.value, () => { if (!dirty.value) reset(); }, {immediate: true});

async function send(words) {
    pending.value = true;
    const answer = await view.run(words);
    pending.value = false;
    if (answer.ok) {
        await view.reload("work");
        reset();
    } else {
        failure.value = answer.error;
        await view.reload("work");
    }
}

const apply = () => send(`work-settings apply --revision ${base.value} ${changed.value.map((control) => `${control.key}=${draft[control.key] ? "on" : "off"}`).join(" ")}`);
const usePreset = (name) => send(`work-settings preset ${name} --revision ${base.value}`);
</script>

<template>
    <section class="work" data-agent-settings-work>
        <p class="work-flow" data-work-flow>Workflow: <strong>{{ workflow || "unknown" }}</strong></p>
        <div class="work-presets">
            <Btn v-for="preset in PRESETS" :key="preset.key" :disabled="pending || stale" :data-preset="preset.key" @click="usePreset(preset.key)">{{ preset.label }}</Btn>
        </div>
        <label v-for="control in CONTROLS" :key="control.key" class="work-row" :data-control="control.key">
            <span class="work-text"><span class="work-label">{{ control.label }}</span><span class="work-line">{{ control.line }}</span></span>
            <Switch :on="draft[control.key]" @change="draft[control.key] = !draft[control.key]" />
        </label>
        <p v-if="nothingStarts" class="work-hint" data-work-hint>With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.</p>
        <p v-if="stale" class="work-hint" role="alert" data-work-stale>These settings changed since you opened them. Cancel to read them again.</p>
        <p v-if="failure" class="work-failure" role="alert" data-work-failure>{{ failure }}</p>
        <div class="work-buttons">
            <Btn :disabled="!dirty || pending" data-work-cancel @click="reset">Cancel</Btn>
            <Btn :disabled="!dirty || pending || stale" data-work-apply @click="apply">Apply</Btn>
        </div>
    </section>
</template>

<style scoped>
.work { display: flex; flex-direction: column; gap: 10px; padding: 12px; }
.work-flow { margin: 0; color: var(--text-2); font-size: 12.5px; }
.work-presets { display: flex; gap: 8px; }
.work-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.work-text { display: flex; flex-direction: column; }
.work-label { font-size: 13px; color: var(--text); }
.work-line { font-size: 12px; color: var(--text-2); }
.work-hint { margin: 0; font-size: 12px; color: var(--text-2); }
.work-failure { margin: 0; font-size: 12px; color: var(--danger); }
.work-buttons { display: flex; justify-content: flex-end; gap: 8px; }
</style>
