<script setup>
import {computed} from "vue";
import {Icon} from "@journal/window-kit";
import RequiredSkillSwitch from "./RequiredSkillSwitch.vue";
const props = defineProps({skill: {type: Object, required: true}, selected: Boolean, busy: Boolean});
const badges = computed(() => props.skill.groups?.length ? props.skill.groups : ["Main agent"]);
const emit = defineEmits(["open", "require"]);
</script>

<template>
    <div :class="['skill-list-item', {selected}]" :data-skill="skill.folder">
        <button type="button" class="skill-name" :aria-label="skill.folder" @click="emit('open', skill.folder)">
            <span class="name-line"><Icon name="book" :size="13" />{{ skill.folder }}<template v-if="skill.read"><span class="read-dot" title="Read by the main agent" /></template></span>
            <span class="description">{{ skill.description }}</span>
            <span class="groups" data-skill-groups><template v-for="group in badges" :key="group"><span class="group">{{ group }}</span></template></span>
        </button>
        <RequiredSkillSwitch :folder="skill.folder" :required="skill.required" :busy="busy" @change="emit('require', skill.folder, $event)" />
    </div>
</template>

<style scoped>
.skill-list-item { display:flex; align-items:center; gap:10px; padding:8px 14px; border-bottom:1px solid var(--border); }
.skill-list-item.selected { background:var(--hover); box-shadow:inset 2px 0 var(--accent); }
.skill-name { flex:1; min-width:0; padding:0; border:0; background:none; color:var(--text); text-align:left; cursor:pointer; font:inherit; }
.name-line { display:flex; align-items:center; gap:7px; font-size:13px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.description { display:-webkit-box; margin:4px 0 0 20px; font-size:12px; line-height:1.5; color:var(--text-3); overflow:hidden; -webkit-box-orient:vertical; -webkit-line-clamp:2; }
.groups { display:flex; flex-wrap:wrap; gap:4px; margin:6px 0 0 20px; }
.group { padding:1px 6px; border:1px solid var(--border-2); border-radius:5px; font-size:10px; color:var(--text-3); }
.read-dot { width:5px; height:5px; flex:none; border-radius:50%; background:var(--accent); }
</style>
