<script setup>
import {computed, ref} from "vue";
import SkillListItem from "./SkillListItem.vue";
const props = defineProps({title: {type: String, required: true}, skills: {type: Array, required: true}, opened: {type: String, default: ""}, busy: {type: Array, default: () => []}, searching: Boolean});
const emit = defineEmits(["open", "require"]);
const folded = ref(false);
const expanded = ref(new Set());
const SMALLEST_FAMILY = 3;
const prefixOf = (skill) => skill.folder.match(/^[^-]+-[^-]+(?=-)/)?.[0] || "";
const familySizes = computed(() => props.skills.reduce((sizes, skill) => sizes.set(prefixOf(skill), (sizes.get(prefixOf(skill)) || 0) + 1), new Map()));
const familyOf = (skill) => (familySizes.value.get(prefixOf(skill)) >= SMALLEST_FAMILY ? prefixOf(skill) : "");
const singles = computed(() => props.skills.filter((skill) => !familyOf(skill)));
const families = computed(() => [...new Set(props.skills.map(familyOf).filter(Boolean))].map((name) => ({name, skills: props.skills.filter((skill) => familyOf(skill) === name)})));
const toggle = (name) => {const next = new Set(expanded.value); next.has(name) ? next.delete(name) : next.add(name); expanded.value = next;};
</script>

<template>
    <section class="skill-group">
        <button type="button" class="group-head" :aria-expanded="!folded || searching" @click="folded = !folded">{{ folded && !searching ? '›' : '⌄' }} {{ title }} <small>{{ skills.length }}, {{ skills.filter((skill) => skill.required).length }} required</small></button>
        <template v-if="!folded || searching">
            <template v-for="skill in singles" :key="skill.folder"><SkillListItem :skill="skill" :selected="opened === skill.folder" :busy="busy.includes(skill.folder)" @open="emit('open', $event)" @require="(folder, value) => emit('require', folder, value)" /></template>
            <template v-for="family in families" :key="family.name">
                <button type="button" class="group-head family" :aria-expanded="expanded.has(family.name) || searching" @click="toggle(family.name)">{{ expanded.has(family.name) || searching ? '⌄' : '›' }} {{ family.name }} <small>{{ family.skills.length }}</small></button>
                <template v-if="expanded.has(family.name) || searching"><template v-for="skill in family.skills" :key="skill.folder"><SkillListItem :skill="skill" :selected="opened === skill.folder" :busy="busy.includes(skill.folder)" @open="emit('open', $event)" @require="(folder, value) => emit('require', folder, value)" /></template></template>
            </template>
        </template>
    </section>
</template>

<style scoped>
.group-head { display:flex; gap:6px; align-items:center; padding:13px 14px 8px; width:100%; border:0; background:var(--bg); color:var(--text-2); text-align:left; font:inherit; font-size:11px; font-weight:600; cursor:pointer; }
.group-head small { margin-left:auto; color:var(--text-3); font-size:10px; font-weight:400; }
.family { padding-left:25px; }
</style>
