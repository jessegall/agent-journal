<script setup>
import RequiredSkillSwitch from "./RequiredSkillSwitch.vue";
const props = defineProps({skill: {type: Object, required: true}, busy: Boolean});
const emit = defineEmits(["change"]);
const toggle = (value) => emit("change", value ? "all" : "none", true);
</script>

<template>
    <section class="requirements">
        <div class="block-head"><div><h3>Must the agent read it at the start?</h3><p>When a conversation starts, the agent must read this skill before it may do anything else.</p></div><span class="switch-label">Required <RequiredSkillSwitch :folder="skill.folder" :required="skill.required" :busy="busy" @change="toggle" /></span></div>
        <template v-if="skill.required"><div class="choices"><label>Which agents must read it<select :value="skill.agents" aria-label="Which agents must read it" :disabled="busy" @change="emit('change', $event.target.value, skill.again)"><option value="all">Every agent</option><option value="main">Only the main agent</option></select></label>
            <template v-if="skill.agents === 'main'"><p>The main agent reads it at the start and again after every compaction.</p></template>
            <template v-else><label class="again"><span>Read it again after the conversation is compacted<small>Compacting empties what the agent has read.</small></span><input type="checkbox" :checked="skill.again" :disabled="busy" aria-label="Read it again after the conversation is compacted" @change="emit('change', skill.agents, $event.target.checked)"></label></template>
        </div></template>
    </section>
</template>

<style scoped>
h3 { margin:0; font-size:13px; font-weight:600; }
p { margin:6px 0 0; color:var(--text-3); font-size:12px; line-height:1.6; }
.block-head { display:flex; align-items:flex-start; justify-content:space-between; gap:18px; }
.switch-label { display:flex; align-items:center; gap:7px; flex:none; color:var(--text-3); font-size:11px; }
.choices { margin-top:16px; padding-left:16px; border-left:2px solid var(--border); }
label { display:flex; flex-direction:column; gap:8px; font-size:12px; color:var(--text-2); }
select { align-self:flex-start; max-width:100%; }
.again { flex-direction:row; align-items:center; justify-content:space-between; margin-top:16px; line-height:1.6; }
small { display:block; color:var(--text-3); font-size:11px; }
@media(max-width:700px) { .block-head { flex-wrap:wrap; } }
</style>
