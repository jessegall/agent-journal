<script setup lang="ts">
import { computed } from 'vue';
import MenuItem from '@/components/kit/MenuItem.vue';
import MenuTrigger from '@/components/kit/MenuTrigger.vue';
import { projectLabel, useProject } from '@/composables/useProject';

/**
 * The topbar's project menu: the tab's choice on its button, All projects first, then each project by its label. It
 * is drawn only for the owner, to whom the shell offers projects.
 */
const { projects, isOffered, selected, choose } = useProject();
const buttonLabel = computed(() =>
    selected.value === null ? 'All projects' : projectLabel(selected.value, projects.value),
);
</script>

<template>
    <template v-if="isOffered">
        <MenuTrigger variant="field" :label="buttonLabel">
            <MenuItem radio :checked="selected === null" @click="choose(null)">All projects</MenuItem>
            <template v-for="project in projects" :key="project.id">
                <MenuItem radio :checked="selected?.id === project.id" @click="choose(project.id)">{{
                    projectLabel(project, projects)
                }}</MenuItem>
            </template>
        </MenuTrigger>
    </template>
</template>
