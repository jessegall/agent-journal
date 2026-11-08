<script setup>
import {computed, ref} from "vue";
import {ListTools, useListTools} from "@journal/window-kit";
import SkillListGroup from "./SkillListGroup.vue";
const props = defineProps({skills: {type: Array, required: true}, opened: {type: String, default: ""}, busy: {type: Array, default: () => []}});
const emit = defineEmits(["open", "require"]);
const filter = ref("all");
const newest = computed(() => [...props.skills].sort((one, two) => (two.modified_at || 0) - (one.modified_at || 0)));
const tools = useListTools(newest, {title: (skill) => skill.folder});
tools.order.value = "title";
const filters = computed(() => [{key: "all", label: "All", count: props.skills.length}, {key: "required", label: "Required", count: props.skills.filter((skill) => skill.required).length}, {key: "read", label: "Read by the main agent", count: props.skills.filter((skill) => skill.read).length}]);
const shown = computed(() => tools.shown.value.filter((skill) => ({all: true, required: skill.required, read: skill.read})[filter.value]));
const sourceOf = (skill) => skill.module?.startsWith("plugin:") ? "plugin" : skill.shipped ? "journal" : "project";
const groups = computed(() => [{key: "journal", title: "From the journal"}, {key: "plugin", title: "From a plugin"}, {key: "project", title: "From this project"}].map((group) => ({...group, skills: shown.value.filter((skill) => sourceOf(skill) === group.key)})).filter((group) => group.skills.length));
const empty = computed(() => {
    if (!props.skills.length) return ["No skills are installed", "Add a folder with a SKILL.md file under .agents/skills in this project."];
    if (tools.words.value.trim()) return ["No skill matches", "Try other words."];
    return filter.value === "required" ? ["No skill is required", "Switch on Required beside a skill to make the agent read it at the start."] : ["No skill is read in this conversation", "Skills appear here after the main agent reads them."];
});
</script>

<template>
    <aside class="skills-list" data-skills-catalogue>
        <ListTools :tools="tools" placeholder="Find a skill" />
        <div class="filters"><template v-for="choice in filters" :key="choice.key"><button type="button" :aria-pressed="filter === choice.key" @click="filter = choice.key">{{ choice.label }} <small>{{ choice.count }}</small></button></template></div>
        <div class="skill-list-scroll">
            <template v-if="shown.length">
                <div class="column-head"><span>Skill</span><span>Required</span></div>
                <template v-for="group in groups" :key="group.key"><SkillListGroup :title="group.title" :skills="group.skills" :opened="opened" :busy="busy" :searching="tools.filtering.value || filter !== 'all'" @open="emit('open', $event)" @require="(folder, value) => emit('require', folder, value)" /></template>
            </template>
            <template v-else><div class="skills-empty"><strong>{{ empty[0] }}</strong><p>{{ empty[1] }}</p><template v-if="tools.words.value"><button type="button" @click="tools.words.value = ''">Clear the search</button></template></div></template>
        </div>
    </aside>
</template>

<style scoped>
.skills-list { display:flex; flex-direction:column; width:540px; min-width:310px; flex:none; border-right:1px solid var(--border); min-height:0; }
.filters { display:flex; flex-wrap:wrap; gap:3px; padding:10px 12px; border-bottom:1px solid var(--border); }
.filters button { padding:5px 7px; border:0; border-radius:6px; font:inherit; font-size:11px; background:none; color:var(--text-3); cursor:pointer; }
.filters button[aria-pressed=true] { background:var(--hover); color:var(--text); }
.filters small { margin-left:4px; font-size:10px; }
.skill-list-scroll { overflow:auto; flex:1; min-height:0; }
.column-head { display:flex; justify-content:space-between; padding:8px 14px; color:var(--text-3); font-size:10px; }
.skills-empty { padding:24px; font-size:12px; color:var(--text-3); line-height:1.6; }
.skills-empty strong { color:var(--text); }
@media (max-width:1000px) { .skills-list { width:340px; min-width:280px; } }
@media (max-width:700px) { .skills-list { width:100%; min-width:0; border:0; } }
</style>
