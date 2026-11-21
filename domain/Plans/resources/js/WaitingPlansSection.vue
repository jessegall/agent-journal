<script setup lang="ts">
import { plan as planRoute } from '@generated/routes/plans';
import type { PlanListData } from '@generated/types/plans';
import { useHostProp } from '@kit/hostProp';
import PlanCard from './PlanCard.vue';

/**
 * The plans waiting for review, in Chat's dock.
 */
defineProps<{ data: PlanListData }>();

const refresh = [useHostProp()];
</script>

<template>
    <ul>
        <template v-for="card in data.rows" :key="card.id">
            <li>
                <PlanCard
                    :card="card"
                    :href="planRoute.url({ plan: card.id })"
                    :refresh="refresh"
                />
            </li>
        </template>
    </ul>
</template>
