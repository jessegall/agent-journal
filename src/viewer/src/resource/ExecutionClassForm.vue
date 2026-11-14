<script setup>
import {computed, ref, watch} from "vue";
import {CLASS_LANES, CLASS_PRIORITIES, classOptions} from "./executionClasses.js";

const props = defineProps({read: {type: Function, required: true}, saving: Boolean});
const emit = defineEmits(["send"]);
const draft = ref({name: "", pattern: "", plugin: "", lane: "long", cost: 1, priority: "normal", limit: 0});
const preview = ref(null);
const failure = ref("");
const holds = computed(() => (draft.value.pattern ? ["--pattern", draft.value.pattern] : draft.value.plugin ? ["--plugin", draft.value.plugin] : []));
watch(() => [draft.value.pattern, draft.value.plugin], () => (preview.value = null));
async function showPreview() {
    const answer = await props.read(["queue-class", "preview", ...holds.value]);
    failure.value = answer.ok ? "" : answer.error;
    preview.value = answer.ok ? answer.value.lines : null;
}
function save() {
    emit("send", ["queue-class", "add", draft.value.name, ...holds.value, ...classOptions(draft.value)], () => {
        draft.value = {...draft.value, name: "", pattern: "", plugin: ""};
    });
}
</script>

<template>
    <form class="add" data-class-form @submit.prevent="save">
        <div class="fields">
            <label>Name<input v-model.trim="draft.name" required data-class-name /></label>
            <label>Line pattern<input v-model="draft.pattern" placeholder="for example ^npm run e2e" :disabled="Boolean(draft.plugin)" data-class-pattern /></label>
            <label>Or plugin<input v-model.trim="draft.plugin" :disabled="Boolean(draft.pattern)" data-class-plugin /></label>
            <label>Lane<select v-model="draft.lane"><template v-for="lane in CLASS_LANES" :key="lane"><option :value="lane">{{ lane }}</option></template></select></label>
            <label>Slot units<input v-model.number="draft.cost" type="number" min="0" /></label>
            <label>Priority<select v-model="draft.priority"><template v-for="priority in CLASS_PRIORITIES" :key="priority"><option :value="priority">{{ priority }}</option></template></select></label>
            <label>At once<input v-model.number="draft.limit" type="number" min="0" title="0 for no limit" /></label>
        </div>
        <div class="buttons">
            <button type="button" :disabled="!holds.length" data-class-preview @click="showPreview">Show matching lines</button>
            <button type="submit" :disabled="saving || preview === null || !draft.name" data-class-add>Add class</button>
        </div>
        <template v-if="preview !== null">
            <div class="preview" data-class-preview-lines>
                <template v-if="preview.length"><p>{{ preview.length }} recent lines would have matched:</p><template v-for="line in preview" :key="line"><code>{{ line }}</code></template></template>
                <template v-else><p>No recent line would have matched.</p></template>
            </div>
        </template>
        <template v-else-if="holds.length"><p class="hint">See which recent lines the class would match before you add it.</p></template>
        <template v-if="failure"><p class="failure" role="alert">{{ failure }}</p></template>
    </form>
</template>

<style scoped>
.add { padding:10px 14px; border-top:1px solid var(--border); }
.fields { display:grid; grid-template-columns:repeat(auto-fill, minmax(120px, 1fr)); gap:8px; }
label { display:flex; flex-direction:column; gap:3px; color:var(--text-3); font-size:11.5px; }
input { height:26px; padding:0 6px; border:1px solid var(--border-2); border-radius:5px; background:none; color:var(--text); font:inherit; font-size:12px; }
select { height:26px; font:inherit; font-size:12px; }
.buttons { display:flex; gap:8px; margin-top:10px; }
.buttons button { padding:4px 10px; border:1px solid var(--border-2); border-radius:6px; background:none; color:var(--text-2); font:inherit; font-size:12px; cursor:pointer; }
.buttons button[type="submit"] { border-color:var(--accent); color:var(--accent); }
button:disabled { opacity:.4; cursor:default; }
.preview { margin-top:10px; }
.preview p, .hint { margin:0 0 4px; color:var(--text-3); font-size:12px; }
.hint { margin-top:8px; }
code { display:block; overflow:hidden; color:var(--text-2); font-size:11.5px; text-overflow:ellipsis; white-space:nowrap; }
.failure { margin:8px 0 0; color:var(--danger); font-size:12px; }
</style>
