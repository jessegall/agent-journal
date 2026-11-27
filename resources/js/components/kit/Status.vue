<script setup lang="ts">
import { computed } from 'vue';
import Dot from './Dot.vue';
import Icon from './Icon.vue';
import Spinner from './Spinner.vue';
import SwitchCase from './SwitchCase.vue';
import { statusLooks } from './status';
import type { StatusState } from './status';

/**
 * A state as a mark plus a word. `state` picks both (see status.ts); `label` overrides the word; `strong` sets it in
 * --text at weight 500; `live` wraps it in role status so a change is announced.
 */
// secondary draws the word in the second text colour, as the agent bar does.
const props = defineProps<{ state: StatusState; label?: string; strong?: boolean; secondary?: boolean; live?: boolean }>();

const look = computed(() => statusLooks[props.state]);
const emphasised = computed(() => props.strong || look.value.strong);
const wordLook = computed(() => {
    if (emphasised.value) {
        return 'font-medium text-text';
    }

    return props.secondary ? 'text-text-2' : 'text-text-3';
});
</script>

<template>
    <span
        :role="live ? 'status' : undefined"
        class="inline-flex items-center gap-1.5 text-small whitespace-nowrap"
        :class="[
            wordLook,
            look.mark === 'alert' && 'text-danger',
            look.mark === 'spinner' && 'text-text-2',
        ]"
    >
        <SwitchCase :value="look.mark">
            <template #spinner><Spinner /></template>
            <template #tick><Icon name="tick" size="md" /></template>
            <template #alert><Icon name="alert" size="md" /></template>
            <template #hollow><Dot tone="hollow" /></template>
            <template #brand><Dot tone="brand" /></template>
            <template #solid><Dot tone="solid" /></template>
        </SwitchCase>
        {{ label ?? look.word }}
    </span>
</template>
