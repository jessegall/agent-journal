<script setup>
import {computed, ref, watch} from "vue";
import {FilterBar, ListReaderLayout, PageHeader, Skeleton, applyFilter, defaultFilter} from "@journal/window-kit";
import {useSkillsPage} from "./useSkillsPage.js";
import SkillReader from "./SkillReader.vue";
import SkillText from "./SkillText.vue";
import {requiredWords, skillFilters, skillItems, skillMenu} from "./skillWords.js";

// the skills as a list and a reader: grouped by where a skill comes from, each with a quiet word for who must read it at the start;
// the reader has what it says, when it is read, who has read it and the profiles that give it. A skill opened from the chat shows its text alone
const LIST_WIDTH = 460;
const {skills, selected, selectedTriggers, requirements, mainAgent, answered, failure, busy, opened, text, openFailure, profiles, draft, marked, load, open, run, requireSkill, readNow} = useSkillsPage();
const filter = ref(defaultFilter(skillFilters));
const words = ref("");
const shown = computed(() => applyFilter(skills.value, skillFilters, filter.value, words.value, ["folder", "description"]));
const items = computed(() => skillItems(shown.value));
const chosen = computed({get: () => opened.value || null, set: (folder) => open(folder ?? "", false)});
const place = (item) => ({head: item.title, items: skillMenu(item.row, {require: (folder, agents) => requireSkill(folder, agents)})});
const add = () => (draft.value = {trigger: null});
const edit = (trigger) => (draft.value = {trigger});
const saved = async () => {
    draft.value = null;
    await load();
};
watch(opened, () => (draft.value = null));
</script>

<template>
    <template v-if="marked">
      <SkillText :skill="text" :failure="openFailure" :back="false" />
    </template>
    <template v-else>
      <ListReaderLayout v-model:chosen="chosen" :items="items" :list-width="LIST_WIDTH" :place="place" empty-title="No skills are installed" pick-line="Choose a skill to read what it says" open-first data-skills-catalogue>
          <template #top>
              <PageHeader title="Skills" :count="skills.length" />
              <FilterBar v-model="filter" v-model:words="words" :fields="skillFilters" :rows="skills" :shown="shown.length" placeholder="Find a skill" />
              <template v-if="requirements.environment_overrides"><p class="note" role="status">This environment uses separate skill lists. Changes here apply to the whole project. The environment lists still take priority.</p></template>
              <template v-if="failure"><p class="note failure" role="alert" data-skills-failure>{{ failure }}</p></template>
          </template>
          <template #empty>
              <template v-if="!answered"><Skeleton shape="rows" /></template>
              <template v-else-if="!skills.length">Add a folder with a SKILL.md file under .agents/skills in this project.</template>
              <template v-else>No skill matches. Try other words or filters.</template>
          </template>
          <template #meta="{item}">
              <template v-if="requiredWords(item.row)">
                <span class="badge-quiet" data-skill-required>{{ requiredWords(item.row) }}</span>
              </template>
          </template>
          <template #reader="{item}">
              <template v-if="selected">
                <SkillReader :skill="selected" :text="text" :failure="openFailure" :triggers="selectedTriggers" :skills="skills" :profiles="profiles" :agent="mainAgent" :draft="draft" :busy="busy.includes(item.id)"
                    @require="(agents, again) => requireSkill(item.id, agents, again)" @read="readNow" @add="add" @edit="edit" @run="run" @saved="saved" @cancel="draft = null" />
              </template>
          </template>
      </ListReaderLayout>
    </template>
</template>

<style scoped>
.note {
    margin: 0;
    padding: 8px var(--inset);
    color: var(--text-2);
    font-size: 12px;
    line-height: 1.6;
}

.failure {
    color: var(--bad, var(--text-2));
}
</style>
