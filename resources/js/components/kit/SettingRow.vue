<script setup lang="ts">
import { useId } from 'vue';

/**
 * One setting in a SettingGroup: a title with its hint on one side and its control (a Field, Toggle, SegmentedControl,
 * Button, Status or text) from the slot on the other. Padding 12 14, gap 16, a --line rule below it that the last row
 * drops. A block row stacks the control below the title. The slot receives titleId and hintId, so a control can name
 * itself with aria-labelledby and aria-describedby.
 */
withDefaults(defineProps<{ title: string; hint?: string; block?: boolean }>(), { hint: undefined, block: false });

const titleId = useId();
const hintId = useId();
</script>

<template>
    <div
        class="gap-4 border-b border-line px-3.5 py-3 last:border-b-0"
        :class="block ? 'flex flex-col items-stretch' : 'flex items-center justify-between'"
    >
        <div class="min-w-0">
            <p :id="titleId" class="text-field text-text">{{ title }}</p>
            <p v-if="hint" :id="hintId" class="text-small text-text-3">{{ hint }}</p>
        </div>
        <div :class="block ? '' : 'flex shrink-0 items-center justify-end text-right'">
            <slot :title-id="titleId" :hint-id="hint ? hintId : undefined" />
        </div>
    </div>
</template>
