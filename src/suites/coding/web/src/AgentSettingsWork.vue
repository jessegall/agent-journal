<script setup>
import {computed, reactive, ref, watch} from "vue";
import {Segmented, useWindow} from "@journal/window-kit";
import SettingRow from "./SettingRow.vue";
import SettingSwitchRow from "./SettingSwitchRow.vue";
import SettingsFoot from "./SettingsFoot.vue";

const CONTROLS = [
    {key: "journal.suites.coding.auto-mode", label: "Auto mode", line: "The journal hands the main agent its next task, and it keeps going while tasks are left"},
    {key: "journal.suites.coding.main-writes-code", label: "Main agent writes code", line: "The main agent may change project files itself; off, it plans, delegates and merges"},
    {key: "journal.suites.coding.workers.main-dispatches-workers", label: "Main agent sends workers", line: "Whether the main agent may send workers to do tasks."},
    {key: "journal.suites.coding.continue-while-delegatable", label: "Keep going while work can be delegated", line: "Keep the main agent working while open tasks can still be sent to workers."},
    {key: "journal.suites.coding.workers.merger-on", label: "Merger takes in workers", line: "A helper merges workers whose tests passed, and passes on what the main agent must judge."},
    {key: "journal.suites.coding.main-starts-read-only-helpers", label: "Use read-only helpers", line: "Whether the main agent may start read-only helpers."},
    {key: "journal.suites.coding.designer-enabled", label: "Use a designer", line: "Whether the main agent may start a designer, which writes a design document and changes no code."},
    {key: "journal.suites.coding.workers.main-agent-may-merge", label: "Main agent may merge workers", line: "Whether the main agent may merge the work of a worker itself."},
];
const PRESETS = [{key: "builder", label: "Builder"}, {key: "orchestrator", label: "Orchestrator"}];
const AUTO = "journal.suites.coding.auto-mode";
const TAKING_ON_WORK = [AUTO];
const DISPATCHES = "journal.suites.coding.workers.main-dispatches-workers";

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
// a control shows only while every switch it depends on is on in the draft
const depends = computed(() => work.data.value?.depends ?? {});
const shown = (control) => (depends.value[control.key] ?? []).every((key) => draft[key] !== false);
const taking = computed(() => CONTROLS.filter((control) => TAKING_ON_WORK.includes(control.key) && shown(control)));
const working = computed(() => CONTROLS.filter((control) => !TAKING_ON_WORK.includes(control.key) && shown(control)));
const problem = computed(() => failure.value || (stale.value ? "These settings changed since you opened them. Cancel to read them again." : ""));
const nothingStarts = computed(() => draft[AUTO] === false && draft[DISPATCHES] === false);

function reset() {
    const current = work.data.value;
    if (!current) return;
    for (const control of CONTROLS) draft[control.key] = current.controls[control.key];
    base.value = current.revision;
    failure.value = "";
}

watch(() => work.data.value, () => { if (!base.value || !dirty.value) reset(); }, {immediate: true});

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
        <div class="section">
            <p class="section-title">Taking on work</p>
            <SettingRow label="Workflow" help="A preset sets the switches below at once; Custom is any other mix." data-work-flow>
                <Segmented :options="PRESETS" :value="workflow" @pick="usePreset" />
            </SettingRow>
            <SettingSwitchRow v-for="control in taking" :key="control.key" :control="control" :on="draft[control.key]" :disabled="view.readOnly" @change="draft[control.key] = !draft[control.key]" />
        </div>
        <div class="section">
            <p class="section-title">How the main agent works</p>
            <p class="section-help">Your models, maximums and tests stay as you set them.</p>
            <SettingSwitchRow v-for="control in working" :key="control.key" :control="control" :on="draft[control.key]" :disabled="view.readOnly" @change="draft[control.key] = !draft[control.key]" />
            <template v-if="nothingStarts"><p class="section-help warn" data-work-hint>With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.</p></template>
        </div>
        <SettingsFoot :changes="changed.length" :pending="pending" :problem="problem" :blocked="stale" @cancel="reset" @apply="apply" />
    </section>
</template>

<style scoped>
.section { margin-top: 18px; }
.section-title { margin: 0 0 2px; color: var(--text); font-size: 12.5px; font-weight: 600; }
.section-help { margin: 0 0 6px; color: var(--text-3); font-size: 12px; text-wrap: pretty; }
.section-help.warn { margin-top: 8px; color: var(--warn); }
</style>
