<script setup>
import {Icon} from "@journal/window-kit";
import RequiredSkillSwitch from "./RequiredSkillSwitch.vue";
defineProps({skill: {type: Object, required: true}, selected: Boolean, busy: Boolean});
const emit = defineEmits(["open", "require"]);
</script>

<template>
    <div :class="['skill-list-item', {selected}]" :data-skill="skill.folder">
        <button type="button" class="skill-name" :aria-label="skill.folder" @click="emit('open', skill.folder)">
            <span class="name-line"><Icon name="book" :size="13" />{{ skill.folder }}<template v-if="skill.read"><span class="read-dot" title="Read by the main agent" /></template></span>
            <span class="description">{{ skill.description }}</span>
        </button>
        <RequiredSkillSwitch :folder="skill.folder" :required="skill.required" :busy="busy" @change="emit('require', skill.folder, $event)" />
    </div>
</template>

<style scoped>
.skill-list-item { display:flex; align-items:center; gap:10px; padding:8px 14px; border-bottom:1px solid var(--border); }
.skill-list-item.selected { background:var(--hover); box-shadow:inset 2px 0 var(--accent); }
.skill-name { flex:1; min-width:0; padding:0; border:0; background:none; color:var(--text); text-align:left; cursor:pointer; font:inherit; }
.name-line { display:flex; align-items:center; gap:7px; font-size:13px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.description { display:block; margin:4px 0 0 20px; font-size:12px; line-height:1.5; color:var(--text-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.read-dot { width:5px; height:5px; flex:none; border-radius:50%; background:var(--accent); }
</style>
