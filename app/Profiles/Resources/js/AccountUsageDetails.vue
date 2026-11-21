<script setup lang="ts">
import type { AccountUsageData } from '@generated/types/accounts';
import { computed } from 'vue';
import AccountFactList from './AccountFactList.vue';
import { costFacts, threadFacts, windowFacts } from './accountUsage';

/**
 * The usage an account's programs reported, in its settings: each window with its value, reset and observation, the
 * month's estimated dollars with what they cover, and the latest thread with the parts the program reported.
 */
const props = defineProps<{
    usage: AccountUsageData;
    now: Date;
}>();

const windows = computed(() => windowFacts(props.usage, props.now));
const cost = computed(() =>
    props.usage.monthCost === undefined ? [] : costFacts(props.usage.monthCost),
);
const thread = computed(() =>
    props.usage.latestThread === undefined
        ? []
        : threadFacts(props.usage.latestThread),
);
const facts = computed(() => [
    ...windows.value,
    ...cost.value,
    ...thread.value,
]);
</script>

<template>
    <section class="flex flex-col gap-2" aria-label="Usage">
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
