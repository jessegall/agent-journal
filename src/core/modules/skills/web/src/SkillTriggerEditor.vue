<script setup>
import {computed, onUnmounted, reactive, ref, watch} from "vue";
import {useWindow} from "@journal/window-kit";
import TriggerWordFields from "../../../triggers/web/src/TriggerWordFields.vue";
import TriggerConditionFields from "../../../triggers/web/src/TriggerConditionFields.vue";
import {sentence} from "../../../triggers/web/src/triggerWords.js";
const props = defineProps({skill: {type: String, default: ""}, trigger: {type: Object, default: null}, skills: {type: Array, required: true}});
const emit = defineEmits(["saved", "cancel"]);
const view = useWindow();
const draft = reactive({skill: props.trigger?.skill || props.skill, name: props.trigger?.name || "", phrases: [...(props.trigger?.phrases || [])], places: [...(props.trigger?.watch_places || ["messages", "commands", "files"])], match: props.trigger?.match_mode || "word", conditions: JSON.parse(props.trigger?.conditions || "[]")});
const sample = ref("");
const trial = ref(null);
const failure = ref("");
const busy = ref(false);
const confirming = ref(false);
const missing = computed(() => !draft.skill ? "Choose a skill." : !draft.phrases.length ? "Add at least one word." : !draft.places.length ? "Choose where to look." : "");
const summary = computed(() => sentence({...draft, action: "skill"}));
let timer;
let checking = 0;
watch(() => [sample.value, draft.phrases.join(","), draft.match], () => {
    clearTimeout(timer);
    const request = ++checking;
    trial.value = null;
    if (!sample.value.trim() || !draft.phrases.length) return;
    timer = setTimeout(async () => {
        view.state["trial.phrases"] = draft.phrases.join(",");
        view.state["trial.sentence"] = sample.value;
        view.state["trial.match-mode"] = draft.match;
        await view.reload("trial");
        if (request !== checking) return;
        trial.value = view.props.trial.failure.value ? {error: view.props.trial.failure.value} : view.props.trial.data.value;
    }, 150);
});
onUnmounted(() => {clearTimeout(timer); checking++;});

async function save() {
    if (busy.value || missing.value) return;
    busy.value = true;
    const flags = ["--name", draft.name.trim() || `Read ${draft.skill}`, "--skill", draft.skill, "--watch-places", ...draft.places, "--match-mode", draft.match, "--conditions", JSON.stringify(draft.conditions)];
    const line = props.trigger ? ["trigger", "edit", String(props.trigger.id), ...flags, ...draft.phrases.map((phrase) => `--phrases=${phrase}`)] : ["trigger", "make", "--do", "skill", ...flags, "--", draft.phrases.join(", ")];
    const answer = await view.run(line);
    failure.value = answer.ok ? "" : answer.error;
    busy.value = false;
    if (answer.ok) emit("saved");
}

async function end() {
    const answer = await view.run(["trigger", "strike", String(props.trigger.id)]);
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) emit("saved");
}
</script>

<template>
    <form class="skill-trigger-editor" @submit.prevent="save">
        <h3>{{ trigger ? 'Edit this trigger' : 'New trigger' }}<template v-if="draft.skill"> for {{ draft.skill }}</template></h3>
        <template v-if="!skill"><label class="field">Which skill the agent must read<select v-model="draft.skill" aria-label="Which skill the agent must read"><option value="">Choose a skill</option><template v-for="entry in skills" :key="entry.folder"><option :value="entry.folder">{{ entry.folder }}</option></template></select></label></template>
        <TriggerWordFields v-model:phrases="draft.phrases" v-model:places="draft.places" v-model:match="draft.match" />
        <div class="summary"><small>What this trigger does</small><p>{{ summary }}</p></div>
        <label class="field">Try a sentence<input v-model="sample" aria-label="Try a sentence" placeholder="For example: take notes about the plan"></label>
        <template v-if="trial"><p class="trial" role="status">{{ trial.error || (trial.matches ? 'This would fire.' : 'This would not fire.') }}</p></template>
        <details :open="Boolean(trigger)"><summary>More choices: its name and when it applies</summary><div class="more"><label class="field">Name<input v-model="draft.name" aria-label="Name" :placeholder="`Read ${draft.skill || 'the skill'}`"></label><TriggerConditionFields v-model="draft.conditions" /></div></details>
        <p class="help" role="status">{{ failure || missing }}</p>
        <div class="actions">
            <template v-if="trigger"><button type="button" class="danger" @click="confirming ? end() : (confirming = true)">{{ confirming ? 'Yes, end it' : 'End this trigger' }}</button></template>
            <button type="button" @click="emit('cancel')">Cancel</button>
            <button type="submit" class="primary" :disabled="busy || Boolean(missing)">{{ trigger ? 'Save' : 'Create trigger' }}</button>
        </div>
    </form>
</template>

<style scoped>
.skill-trigger-editor { display:flex; flex-direction:column; gap:16px; padding:20px; border:1px solid var(--border-2); border-radius:10px; background:var(--bg); font-size:12px; }
h3 { margin:0; font-size:14px; font-weight:600; overflow-wrap:anywhere; }
.field { display:flex; flex-direction:column; gap:7px; color:var(--text-2); font-size:12px; }
input,select { min-width:0; border:1px solid var(--border-2); border-radius:6px; background:var(--bg); color:var(--text); padding:8px; font:inherit; }
.summary { padding:12px; border-radius:8px; background:var(--bg-2); line-height:1.6; }
.summary small,.help { color:var(--text-3); }
p { margin:0; }
.summary p { margin-top:4px; }
.more { display:flex; flex-direction:column; gap:12px; padding-top:14px; }
summary { color:var(--text-3); cursor:pointer; }
.trial { color:var(--accent); }
.actions { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:8px; }
button { padding:6px 10px; border:1px solid var(--border-2); border-radius:6px; background:var(--bg); color:var(--text-2); font:inherit; cursor:pointer; }
.primary { background:var(--accent); border-color:var(--accent); color:#fff; }
button:disabled { opacity:.5; cursor:default; }
.danger { color:var(--red, #cc4b4b); margin-right:auto; }
</style>
