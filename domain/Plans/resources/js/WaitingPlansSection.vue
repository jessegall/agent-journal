<script setup lang="ts">
import { plan as planRoute } from '@generated/routes/plans';
import type { PlanListData } from '@generated/types/plans';
import PlanCard from './PlanCard.vue';

/**
 * The plans waiting for review, in Chat's dock; with none waiting the section takes no space.
 */
defineProps<{ data: PlanListData }>();
</script>

<template>
    <ul v-if="data.rows.length > 0">
        <template v-for="card in data.rows" :key="card.id">
            <li>
                <PlanCard :card="card" :href="planRoute.url({ plan: card.id })" />
            </li>
        </template>
    </ul>
</template>
