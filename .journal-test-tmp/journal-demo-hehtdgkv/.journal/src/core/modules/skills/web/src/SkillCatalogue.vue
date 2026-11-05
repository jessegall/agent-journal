<script setup>
import {toRef} from "vue";
import {ListTools, useListTools} from "@journal/window-kit";

const props = defineProps({rows: {type: Array, required: true}});
const emit = defineEmits(["open"]);
const tools = useListTools(toRef(props, "rows"), {title: (skill) => skill.folder});
</script>

<template>
    <div class="skills" data-skills-catalogue>
        <h2>All skills</h2>
        <ListTools :tools="tools" />
        <ul class="skills-catalogue">
            <template v-for="skill in tools.shown.value" :key="skill.folder">
                <li>
                    <button type="button" class="skill-entry" @click="emit('open', skill.folder)">
                        <span class="skill-name">{{ skill.folder }}</span>
                        <span class="skill-description">{{ skill.description }}</span>
                    </button>
                </li>
            </template>
        </ul>
    </div>
</template>

<style scoped>
.skills-catalogue {
    margin: 0;
    padding: 0;
    list-style: none;
}

.skill-entry {
    display: flex;
    gap: 8px;
    align-items: baseline;
    width: 100%;
    text-align: left;
    padding: 9px 10px;
    border: 0;
    border-bottom: 1px solid var(--border);
    background: transparent;
    color: var(--text-2);
    font: inherit;
    cursor: pointer;
}
.skill-entry:hover { background: var(--hover); color: var(--text); }
h2 { margin: 0 0 8px; font-size: 13px; font-weight: 600; }

.skill-description {
    color: var(--text-3);
    font-size: 12px;
}
</style>
