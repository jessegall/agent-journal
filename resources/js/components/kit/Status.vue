<script setup lang="ts">
import { computed } from 'vue';
import Dot from './Dot.vue';
import Icon from './Icon.vue';
import Spinner from './Spinner.vue';
import { statusLooks } from './status';
import type { StatusState } from './status';

/**
 * A state as a mark plus a word. `state` picks both (see status.ts); `label` overrides the word; `strong` sets it in
 * --text at weight 500; `live` wraps it in role status so a change is announced.
 */
const props = defineProps<{ state: StatusState; label?: string; strong?: boolean; live?: boolean }>();

const look = computed(() => statusLooks[props.state]);
const emphasised = computed(() => props.strong || look.value.strong);
</script>

<template>
    <span
        :role="live ? 'status' : undefined"
        class="inline-flex items-center gap-1.5 text-small whitespace-nowrap"
        :class="[
            emphasised ? 'font-medium text-text' : 'text-text-3',
            look.mark === 'alert' && 'text-danger',
            look.mark === 'spinner' && 'text-text-2',
        ]"
    >
        <Spinner v-if="look.mark === 'spinner'" />
        <Icon v-else-if="look.mark === 'tick'" name="tick" size="md" />
        <Icon v-else-if="look.mark === 'alert'" name="alert" size="md" />
        <Dot v-else :tone="look.mark" />
        {{ label ?? look.word }}
    </span>
</template>
