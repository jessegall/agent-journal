<script setup>
import {computed, ref, watch} from "vue";
import {TextDisplay} from "@journal/window-kit";
import {skillMarkdown} from "./skillMarkdown.js";
import SkillRequirements from "./SkillRequirements.vue";
import SkillTriggerCard from "./SkillTriggerCard.vue";
import SkillTriggerEditor from "./SkillTriggerEditor.vue";
const props = defineProps({skill: {type: Object, required: true}, text: {type: Object, default: null}, triggers: {type: Array, required: true}, skills: {type: Array, required: true}, agent: {type: Number, default: null}, draft: {type: Object, default: null}, busy: Boolean});
const emit = defineEmits(["require", "read", "add", "edit", "run", "saved", "cancel"]);
const source = computed(() => props.skill.module?.startsWith("plugin:") ? "From a plugin" : props.skill.shipped ? "From the journal" : "From this project");
const status = computed(() => {
    if (!props.agent) return "No main agent is running in this environment.";
    if (props.skill.changed) return "This skill changed after the main agent read it.";
    if (props.skill.held?.state === "due") return "The main agent still has to read this skill. It cannot do anything else first.";
    if (props.skill.read) return `The main agent read this skill at ${new Date(props.skill.held.loaded_at).toLocaleString()}.`;
    return "The main agent has not read this skill in this conversation.";
});
const file = ref("");
watch(() => props.text, (text, previous, cleanup) => {
    if (!text) return;
    const address = URL.createObjectURL(new Blob([text.text], {type: "text/plain;charset=utf-8"}));
    file.value = address;
    cleanup(() => URL.revokeObjectURL(address));
}, {immediate: true});
</script>

<template>
    <div class="skill-details">
        <header><h2>{{ skill.folder }} <small>{{ source }}</small></h2><p>{{ skill.description }}</p></header>
        <div class="status"><span>{{ status }}</span><template v-if="agent && skill.held?.state !== 'due'"><button type="button" @click="emit('read')">{{ skill.read ? 'Make the agent read it again' : 'Make the agent read it now' }}</button></template></div>
        <SkillRequirements :skill="skill" :busy="busy" @change="(agents, again) => emit('require', agents, again)" />
        <section class="block"><div class="block-head"><h3>Make the agent read it when your words appear</h3><template v-if="!draft"><button type="button" @click="emit('add')">Add a trigger</button></template></div>
            <template v-if="!triggers.length && !draft"><p class="help">No triggers yet. Add one, and the agent must read this skill as soon as your words appear.</p></template>
            <template v-for="trigger in triggers" :key="trigger.id"><template v-if="draft?.trigger?.id !== trigger.id"><SkillTriggerCard :trigger="trigger" @edit="emit('edit', $event)" @run="emit('run', $event)" /></template></template>
            <template v-if="draft"><SkillTriggerEditor :key="draft.trigger?.id || skill.folder" :skill="skill.folder" :trigger="draft.trigger" :skills="skills" @saved="emit('saved')" @cancel="emit('cancel')" /></template>
        </section>
        <template v-if="skill.keywords?.length || skill.commands?.length || skill.events?.length"><section class="block"><h3>When the skill itself asks to be read</h3><p class="help">These come with the skill and cannot be changed here.</p><ul>
            <template v-if="skill.keywords?.length"><li>When you write <code>{{ skill.keywords.join(', ') }}</code></li></template>
            <template v-if="skill.commands?.length"><li>Before it runs a command about <code>{{ skill.commands.join(', ') }}</code></li></template>
            <template v-if="skill.events?.length"><li>When these changes happen: <code>{{ skill.events.join(', ') }}</code></li></template>
        </ul></section></template>
        <section class="block"><div class="block-head"><h3>What the skill says</h3><template v-if="file"><a :href="file" target="_blank" rel="noopener">Open SKILL.md</a></template></div><template v-if="text"><div data-skill-text><TextDisplay :text="skillMarkdown(text.text)" :row-names="false" /></div></template><template v-else><p class="help">Reading the skill…</p></template></section>
    </div>
</template>

<style scoped>
.skill-details { display:flex; flex-direction:column; gap:24px; padding:18px 24px 40px; font-size:12px; }
h2 { display:flex; align-items:center; flex-wrap:wrap; gap:10px; font-size:15px; margin:0; font-weight:600; overflow-wrap:anywhere; }
h2 small { border:1px solid var(--border-2); border-radius:5px; padding:3px 6px; font-size:10px; color:var(--text-3); font-weight:400; }
header p,.help { color:var(--text-3); line-height:1.7; margin:7px 0 0; }
h3 { font-size:13px; margin:0; font-weight:600; }
.status { display:flex; flex-wrap:wrap; align-items:center; gap:12px; padding:13px 15px; border:1px solid var(--border); border-radius:8px; background:var(--bg-2); line-height:1.6; color:var(--text-2); }
.status span { flex:1; min-width:160px; }
.block { display:flex; flex-direction:column; gap:12px; padding-top:22px; border-top:1px solid var(--border); }
.block-head { display:flex; align-items:center; justify-content:space-between; gap:10px; }
button,a { flex:none; padding:6px 9px; border:1px solid var(--border-2); border-radius:6px; background:var(--bg); color:var(--text-2); font:inherit; cursor:pointer; text-decoration:none; font-size:11px; }
ul { padding-left:20px; line-height:1.9; margin:0; color:var(--text-2); }
@media(max-width:700px) { .skill-details { padding:20px 16px 35px; } .block-head { flex-wrap:wrap; } }
</style>
