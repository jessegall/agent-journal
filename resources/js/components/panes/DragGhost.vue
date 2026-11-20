<script setup lang="ts">
import { computed } from 'vue';
import Icon from '@/components/kit/Icon.vue';
import { usePaneLayout } from '@/components/panes/usePaneLayout';
import type { WindowDrag } from '@/components/panes/usePaneLayout';

/**
 * Version 5's drag ghost (panes/DragGhost.vue): the dragged window's icon and title beside the pointer, with a hint of
 * where it would land.
 */
const props = defineProps<{ drag: WindowDrag }>();

const store = usePaneLayout();

const window = computed(() =>
    store.windows.value.find((each) => each.key === props.drag.windowKey),
);

const hint = computed(() => {
    const target = props.drag.target;

    if (target === null) {
        return '';
    }

    if (target === 'detach') {
        return 'Detach';
    }

    return {
        tabs: 'Add to these tabs',
        centre: 'Add as a tab',
        left: 'Split to the left',
        right: 'Split to the right',
        above: 'Split above',
        below: 'Split below',
    }[target.zone];
});
</script>

<template>
    <div
        class="pointer-events-none fixed z-400 flex h-[26px] items-center gap-1.5 rounded-control border border-border-3 bg-sel px-2.5 text-small whitespace-nowrap text-text shadow-[0_8px_24px_rgba(0,0,0,.35)]"
        :style="{ left: `${drag.x + 14}px`, top: `${drag.y + 12}px` }"
    >
        <template v-if="window">
            <Icon :name="window.icon" :size="13" />
            <span>{{ window.title }}</span>
        </template>
        <span class="text-text-3">{{ hint }}</span>
    </div>
</template>
