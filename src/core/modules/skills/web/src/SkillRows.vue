<script setup>
import {WindowRoom} from "@journal/window-kit";
import {useSkillsPage} from "./useSkillsPage.js";
import SkillsList from "./SkillsList.vue";
import SkillDetails from "./SkillDetails.vue";
import SkillText from "./SkillText.vue";
import SkillTriggerCard from "./SkillTriggerCard.vue";
import SkillTriggerEditor from "./SkillTriggerEditor.vue";

const {skills, selected, selectedTriggers, triggers, requirements, mainAgent, answered, failure, busy, opened, text, openFailure, tab, draft, marked, load, open, run, requireSkill, readNow} = useSkillsPage();
const requireRow = (folder, required) => requireSkill(folder, required ? "all" : "none");
const add = () => (draft.value = {trigger: null});
const edit = (trigger) => (draft.value = {trigger});
const saved = async () => {draft.value = null; await load();};
const switchTab = (value) => {tab.value = value; draft.value = null;};
</script>

<template>
    <WindowRoom padding="0">
        <template v-if="marked"><SkillText :skill="text" :failure="openFailure" :back="false" /></template>
        <template v-else>
            <main :class="['skills-page', {'skill-open': tab === 'skills' && Boolean(opened), 'trigger-open': tab === 'triggers' && Boolean(draft)}]">
                <header class="page-head"><div><h1>Skills</h1><p>Instructions the agent reads before starting work. Choose which skills the agent must read, and when. These settings apply to the whole project.</p></div><nav aria-label="Skills views"><button type="button" :aria-pressed="tab === 'skills'" @click="switchTab('skills')">Skills</button><button type="button" :aria-pressed="tab === 'triggers'" @click="switchTab('triggers')">Triggers</button></nav></header>
                <template v-if="requirements.environment_overrides"><p class="warning" role="status">This environment uses separate skill lists. Changes here apply to the whole project. The environment lists still take priority.</p></template>
                <template v-if="failure"><div class="warning" role="alert">{{ failure }} <button type="button" @click="load">Try again</button></div></template>
                <template v-if="!answered"><p class="empty">Reading the skills…</p></template>
                <template v-else-if="tab === 'skills'">
                    <div class="panes">
                        <SkillsList :skills="skills" :opened="opened" :busy="busy" @open="open" @require="requireRow" />
                        <article class="skill-pane">
                            <button type="button" class="phone-back" @click="open('')">Back</button>
                            <template v-if="openFailure"><div class="empty"><strong>Could not read this skill</strong><p>{{ openFailure }}</p><button type="button" @click="open(opened, false)">Try again</button></div></template>
                            <template v-else-if="selected"><SkillDetails :skill="selected" :text="text" :triggers="selectedTriggers" :skills="skills" :agent="mainAgent" :draft="draft" :busy="busy.includes(opened)" @require="(agents, again) => requireSkill(opened, agents, again)" @read="readNow" @add="add" @edit="edit" @run="run" @saved="saved" @cancel="draft = null" /></template>
                            <template v-else><div class="empty centre"><strong>Choose a skill to read what it says</strong><p>Switch on Required to make the agent read a skill at the start. Open a skill to add words that make the agent read it later.</p></div></template>
                        </article>
                    </div>
                </template>
                <template v-else>
                    <div class="panes">
                        <aside class="triggers-list"><div class="trigger-head"><p>Triggers that make an agent read a skill. Other triggers stay under Triggers.</p><button type="button" @click="add">Add a trigger</button></div>
                            <template v-if="triggers.length"><div class="trigger-cards"><template v-for="trigger in triggers" :key="trigger.id"><SkillTriggerCard :trigger="trigger" @edit="edit" @run="run" /></template></div></template>
                            <template v-else><div class="empty"><strong>You have no triggers yet</strong><p>A trigger makes the agent read a skill as soon as your words appear.</p><button type="button" @click="add">Add a trigger</button></div></template>
                        </aside>
                        <article class="skill-pane trigger-pane">
                            <template v-if="draft"><div class="trigger-form"><SkillTriggerEditor :key="draft.trigger?.id || 'new'" :trigger="draft.trigger" :skills="skills" @saved="saved" @cancel="draft = null" /></div></template>
                            <template v-else><div class="empty centre"><strong>Choose Edit on a trigger to change it</strong><p>Or add a new one. Each trigger makes the agent read one skill.</p></div></template>
                        </article>
                    </div>
                </template>
            </main>
        </template>
    </WindowRoom>
</template>

<style scoped>
.skills-page { display:flex; flex-direction:column; height:100%; min-height:0; background:var(--bg); color:var(--text); }
.page-head { display:flex; align-items:flex-end; justify-content:space-between; flex:none; gap:24px; padding:16px 20px 14px; border-bottom:1px solid var(--border); }
h1 { margin:0; font-size:16px; font-weight:600; }
.page-head p { margin:7px 0 0; max-width:650px; font-size:12px; line-height:1.7; color:var(--text-3); }
nav { display:flex; flex:none; gap:4px; padding:3px; border:1px solid var(--border); border-radius:7px; }
nav button { border:0; background:none; color:var(--text-3); padding:5px 13px; font:inherit; font-size:12px; cursor:pointer; border-radius:4px; }
nav button[aria-pressed=true] { background:var(--hover); color:var(--text); }
.panes { display:flex; flex:1; min-height:0; overflow:hidden; }
.skill-pane { flex:1; min-width:0; min-height:0; overflow:auto; }
.empty { padding:30px; color:var(--text-3); font-size:12px; line-height:1.7; }
.empty strong { color:var(--text-2); font-weight:500; font-size:14px; }
.centre { max-width:420px; margin:60px auto; text-align:center; }
.phone-back { display:none; }
.triggers-list { flex:none; width:440px; border-right:1px solid var(--border); overflow:auto; }
.trigger-head { padding:16px; border-bottom:1px solid var(--border); font-size:12px; line-height:1.6; color:var(--text-3); }
.trigger-head p { margin:0 0 10px; }
.trigger-cards { display:flex; flex-direction:column; gap:10px; padding:16px; }
.trigger-form { max-width:800px; padding:24px 28px; margin:auto; }
.warning { padding:12px 24px; margin:0; background:var(--bg-2); border-bottom:1px solid var(--border); color:var(--text-2); font-size:12px; line-height:1.6; }
button { padding:6px 10px; border:1px solid var(--border-2); border-radius:6px; background:var(--bg); color:var(--text-2); font:inherit; cursor:pointer; }
@media(max-width:700px) {
    .page-head { padding:16px; flex-wrap:wrap; gap:12px; }
    .page-head h1 { font-size:18px; }
    .skill-open .page-head,.trigger-open .page-head { display:none; }
    .page-head p { display:none; }
    .panes { overflow:auto; }
    .skill-pane { display:none; }
    .skill-open .skills-list { display:none; }
    .skill-open .skill-pane { display:block; }
    .skill-open .phone-back { display:block; margin:12px 16px 0; }
    .triggers-list { width:100%; border:0; }
    .trigger-open .triggers-list { display:none; }
    .trigger-open .trigger-pane { display:block; }
    .trigger-form { padding:16px; }
}
</style>
