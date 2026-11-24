<script setup lang="ts">
import Icon from '@kit/Icon';
import Menu from '@kit/Menu';
import MenuItem from '@kit/MenuItem';
import MenuItemLabel from '@kit/MenuItemLabel';
import type { PlanCardData } from '@generated/types/plans';
import StartPlanForm from './StartPlanForm.vue';

/**
 * A plan row's actions menu: start the plan when it may start, with a check when the start's outcome is unknown, and
 * open the plan.
 */
defineProps<{ card: PlanCardData; href: string; name: string }>();
</script>

<template>
    <Menu :label="`Actions for ${name}`">
        <template v-if="card.start">
            <StartPlanForm
                :key="card.start.planId"
                :start="card.start"
            >
                <template #default="{ pending }">
                    <MenuItem type="submit" :pending="pending">
                        <template #leading>
                            <Icon name="start" :size="14" />
                        </template>
                        <MenuItemLabel>Start plan</MenuItemLabel>
                    </MenuItem>
                </template>
                <template #unknown="{ check }">
                    <p class="px-2 py-1 text-small text-text-2">
                        Outcome unknown
                    </p>
                    <MenuItem @click="check">
                        <template #leading>
                            <Icon name="search" :size="14" />
                        </template>
                        <MenuItemLabel>Check plan</MenuItemLabel>
                    </MenuItem>
                </template>
            </StartPlanForm>
        </template>
        <MenuItem :href="href" preserve-scroll>
            <template #leading>
                <Icon name="arrow" :size="14" />
            </template>
            <MenuItemLabel>Open plan</MenuItemLabel>
        </MenuItem>
    </Menu>
</template>
