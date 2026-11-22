<script setup lang="ts">
import { inject } from 'vue';
import IconButton from './IconButton.vue';
import { panelTitleIdKey } from './panelTitleId';

/**
 * The top of a Panel, 44 high with padding 0 6 0 12 and a --line border below: a leading slot (an Avatar or an Icon),
 * the title in weight 600 that takes the free width and ends in an ellipsis, a small count in --text-small --text-3,
 * and a close IconButton that emits close. The title's id is the one the Panel names itself from.
 */
withDefaults(defineProps<{ title: string; count?: number; closeLabel?: string }>(), {
    count: undefined,
    closeLabel: 'Close',
});

const emit = defineEmits<{ close: [] }>();
const titleId = inject(panelTitleIdKey, undefined);
</script>

<template>
    <div class="flex h-11 shrink-0 items-center gap-2 border-b border-line pr-1.5 pl-3">
        <slot name="leading" />
        <h2 :id="titleId" class="m-0 min-w-0 flex-1 truncate text-body font-semibold text-text">{{ title }}</h2>
        <span v-if="count !== undefined" class="text-small text-text-3">{{ count }}</span>
        <IconButton icon="close" :label="closeLabel" data-panel-close @click="emit('close')" />
    </div>
</template>
