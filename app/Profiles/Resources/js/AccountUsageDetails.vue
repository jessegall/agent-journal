<script setup lang="ts">
import type { AccountUsageData } from '@generated/types/accounts';
import { computed } from 'vue';
import AccountFactList from './AccountFactList.vue';
import {
    costFacts,
    currentReadings,
    threadFacts,
    windowFacts,
} from './accountUsage';

/**
 * The usage an account's programs reported, in its settings: each window with its value, reset and observation, the
 * month's estimated dollars with what they cover, and the latest thread with the parts the program reported.
 */
const props = defineProps<{
    usage: AccountUsageData;
    now: Date;
}>();

const usage = computed(() => currentReadings(props.usage, props.now));
const windows = computed(() => windowFacts(usage.value, props.now));
const cost = computed(() =>
    usage.value.monthCost === undefined ? [] : costFacts(usage.value.monthCost),
);
const thread = computed(() =>
    usage.value.latestThread === undefined
        ? []
        : threadFacts(usage.value.latestThread),
);
const facts = computed(() => [
    ...windows.value,
    ...cost.value,
    ...thread.value,
]);
</script>

<template>
    <section
        v-if="facts.length > 0"
        class="flex flex-col gap-2"
        aria-label="Usage"
    >
        <span class="text-text-3">Usage</span>
        <template v-if="usage.monthCost !== undefined">
            <p class="text-small text-text-2">
                Estimated USD value observed by the journal. It covers only the
                sessions the journal ran.
            </p>
        </template>
        <AccountFactList :facts="facts" />
    </section>
</template>
