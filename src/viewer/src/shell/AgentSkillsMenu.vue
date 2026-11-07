<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";

// the skills of the agent the bar is about: the ones it has read, newest last, then the ones it still has to read
const props = defineProps({skills: {type: Array, required: true}});
const emit = defineEmits(["browse"]);
const read = computed(() => props.skills.filter((row) => row.state === "loaded"));
const waiting = computed(() => props.skills.filter((row) => row.state !== "loaded"));
</script>

<template>
    <div class="skills-menu" data-agent-skills-menu>
        <MenuLabel>Read in this conversation</MenuLabel>
        <template v-if="!read.length">
            <p class="skills-none">None yet. Compacting the conversation empties this list.</p>
        </template>
        <template v-for="row in read" :key="row.id">
            <p class="skill-line" data-agent-skill-read><Icon name="book" :size="12" />{{ row.skill }}</p>
        </template>
        <template v-if="waiting.length">
            <MenuLabel>Still to read</MenuLabel>
            <template v-for="row in waiting" :key="row.id">
                <p class="skill-line waiting" data-agent-skill-waiting><Icon name="book" :size="12" />{{ row.skill }}</p>
            </template>
        </template>
        <MenuItem data-agent-skills-browse @click="emit('browse')">Browse every skill</MenuItem>
    </div>
</template>

<style scoped>
.skills-menu {
    min-width: 240px;
}

.skill-line,
.skills-none {
    display: flex;
    gap: 8px;
    align-items: center;
    margin: 0;
    padding: 4px 10px;
    color: var(--text-2);
    font-size: 12.5px;
}

.skill-line.waiting,
.skills-none {
    color: var(--text-3);
}
</style>
