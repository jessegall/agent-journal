<script setup lang="ts">
import MenuItem from '@/components/kit/MenuItem.vue';
import MenuTrigger from '@/components/kit/MenuTrigger.vue';
import { useEnvironment } from '@/composables/useEnvironment';

/**
 * The topbar's environment menu: the environment in use on its button and one radio item for each the viewer may
 * work in. It is drawn only when the page supplies environments.
 */
const { environments, active, choose } = useEnvironment();
</script>

<template>
    <template v-if="active !== undefined">
        <MenuTrigger variant="field" :label="active.label">
            <template v-for="environment in environments" :key="environment.key">
                <MenuItem radio :checked="environment.key === active.key" @click="choose(environment.key)">{{
                    environment.label
                }}</MenuItem>
            </template>
        </MenuTrigger>
    </template>
</template>
