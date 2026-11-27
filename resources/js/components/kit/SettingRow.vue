<script setup lang="ts">
import { useId } from 'vue';

/**
 * One setting in a SettingGroup: a title with its hint on one side and its control from the slot on the other, or below
 * it in a block row. The slot receives titleId and hintId, so a control can name itself with them. Measures:
 * docs/designs/kit-components.md.
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
            <p :id="titleId" class="text-body text-text">{{ title }}</p>
            <template v-if="hint">
                <p :id="hintId" class="text-small text-text-3">{{ hint }}</p>
            </template>
        </div>
        <div :class="block ? '' : 'flex shrink-0 items-center justify-end text-right'">
            <slot :title-id="titleId" :hint-id="hint ? hintId : undefined" />
        </div>
    </div>
</template>
