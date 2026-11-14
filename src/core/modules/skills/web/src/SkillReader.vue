<script setup>
import {computed, ref} from "vue";
import {ActionsMenu, Reader, SwitchCase, TextDisplay, openFileInspector} from "@journal/window-kit";
import SkillProfiles from "./SkillProfiles.vue";
import SkillReadBy from "./SkillReadBy.vue";
import SkillToProfile from "./SkillToProfile.vue";
import SkillWhen from "./SkillWhen.vue";
import {skillMarkdown} from "./skillMarkdown.js";
import {SOURCE_WORDS, profilesOffering, requiredWords, sourceOf} from "./skillWords.js";

// one skill read whole: what it says, when it is read, who has read it and the profiles that give it, and the Actions menu: who must read it, a profile that must, a trigger, and its SKILL.md in the files
const props = defineProps({skill: {type: Object, required: true}, text: {type: Object, default: null}, failure: {type: String, default: ""}, triggers: {type: Array, required: true}, skills: {type: Array, required: true},
    profiles: {type: Array, required: true}, agent: {type: Number, default: null}, draft: {type: Object, default: null}, busy: Boolean});
const emit = defineEmits(["require", "read", "add", "edit", "run", "saved", "cancel"]);
const tab = ref("text");
const choosing = ref(false);
const tabs = computed(() => [
    {key: "text", label: "What it says"},
    {key: "when", label: "When it is read", count: props.triggers.length},
    {key: "readby", label: "Read by"},
    {key: "profiles", label: "Profiles", count: profilesOffering(props.profiles, props.skill.folder).length},
]);
const facts = computed(() => [
    {name: "source", label: "From", value: SOURCE_WORDS[sourceOf(props.skill)]},
    {name: "required", label: "Required", value: requiredWords(props.skill) || "No"},
]);
const readers = [["all", "Every agent"], ["main", "Main agent"], ["none", "None"]];
const path = computed(() => props.skill.path?.startsWith("/") ? `.claude/skills/${props.skill.folder}/SKILL.md` : props.skill.path || `.claude/skills/${props.skill.folder}/SKILL.md`);
const items = computed(() => [
    {label: "Readers", group: "own", children: readers.map(([agents, label]) => ({label, run: () => emit("require", agents, true)}))},
    {label: "Require in a profile", group: "own", disabled: !props.profiles.length, reason: "No profiles", run: () => (choosing.value = true)},
    {label: "Add a trigger", group: "own", run: () => { tab.value = "when"; emit("add"); }},
    {label: "Open SKILL.md in Files", group: "open", run: () => openFileInspector(path.value)},
]);
</script>

<template>
    <Reader v-model:tab="tab" :title="skill.folder" :abstract="skill.description" :tabs="tabs" :facts="facts" data-skill-reader>
        <template #actions>
            <ActionsMenu :items="items" :head="skill.folder" />
        </template>
        <SwitchCase :value="tab">
            <template #text>
                <template v-if="text"><div class="text" data-skill-text><TextDisplay :text="skillMarkdown(text.text)" :row-names="false" /></div></template>
                <template v-else><p class="note" :role="failure ? 'alert' : null">{{ failure || "Reading the skill…" }}</p></template>
            </template>
            <template #when><SkillWhen :skill="skill" :triggers="triggers" :skills="skills" :draft="draft" :busy="busy" @require="(agents, again) => emit('require', agents, again)" @add="emit('add')" @edit="emit('edit', $event)" @run="emit('run', $event)" @saved="emit('saved')" @cancel="emit('cancel')" /></template>
            <template #readby><SkillReadBy :skill="skill" :agent="agent" @read="emit('read')" /></template>
            <template #profiles><SkillProfiles :folder="skill.folder" :profiles="profiles" /></template>
        </SwitchCase>
        <template v-if="choosing"><SkillToProfile :folder="skill.folder" :profiles="profiles" @close="choosing = false" /></template>
    </Reader>
</template>

<style scoped>
.text {
    padding-top: 16px;
    font-size: 12.5px;
}

.note {
    margin: 16px 0 0;
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
