<script setup>
import {Btn} from "@journal/window-kit";
import SkillRequirements from "./SkillRequirements.vue";
import SkillTriggerCard from "./SkillTriggerCard.vue";
import SkillTriggerEditor from "./SkillTriggerEditor.vue";

// when a skill is read: whether the agent must read it at the start, the words of the user that make the agent read it, and what the skill itself asks for
const props = defineProps({skill: {type: Object, required: true}, triggers: {type: Array, required: true}, skills: {type: Array, required: true}, draft: {type: Object, default: null}, busy: Boolean});
const emit = defineEmits(["require", "add", "edit", "run", "saved", "cancel"]);
</script>

<template>
    <div class="when" data-skill-when>
        <SkillRequirements :skill="skill" :busy="busy" @change="(agents, again) => emit('require', agents, again)" />
        <section class="block">
            <div class="block-head"><h3>Make the agent read it when your words appear</h3><template v-if="!draft"><Btn small data-skill-trigger-add @click="emit('add')">Add a trigger</Btn></template></div>
            <template v-if="!triggers.length && !draft"><p class="help">No triggers yet. Add one, and the agent must read this skill as soon as your words appear.</p></template>
            <template v-for="trigger in triggers" :key="trigger.id"><template v-if="draft?.trigger?.id !== trigger.id"><SkillTriggerCard :trigger="trigger" @edit="emit('edit', $event)" @run="emit('run', $event)" /></template></template>
            <template v-if="draft"><SkillTriggerEditor :key="draft.trigger?.id || skill.folder" :skill="skill.folder" :trigger="draft.trigger" :skills="skills" @saved="emit('saved')" @cancel="emit('cancel')" /></template>
        </section>
        <template v-if="skill.keywords?.length || skill.commands?.length || skill.events?.length">
            <section class="block"><h3>When the skill itself asks to be read</h3><p class="help">These come with the skill and cannot be changed here.</p>
                <ul>
                    <template v-if="skill.keywords?.length"><li>When you write <code>{{ skill.keywords.join(', ') }}</code></li></template>
                    <template v-if="skill.commands?.length"><li>Before it runs a command about <code>{{ skill.commands.join(', ') }}</code></li></template>
                    <template v-if="skill.events?.length"><li>When these changes happen: <code>{{ skill.events.join(', ') }}</code></li></template>
                </ul>
            </section>
        </template>
    </div>
</template>

<style scoped>
.when { display: flex; flex-direction: column; gap: 22px; padding-top: 16px; font-size: 12px; }
.block { display: flex; flex-direction: column; gap: 12px; padding-top: 18px; border-top: 1px solid var(--border); }
.block-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
h3 { margin: 0; font-size: 13px; font-weight: 600; }
.help { margin: 0; color: var(--text-3); line-height: 1.7; }
ul { margin: 0; padding-left: 20px; color: var(--text-2); line-height: 1.9; }
</style>
