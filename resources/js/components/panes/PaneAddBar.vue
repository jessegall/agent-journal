<script setup lang="ts">
import Icon from '@/components/kit/Icon.vue';
import type { PaneWindow } from './paneLayout';

/**
 * Version 5's add bar (windows/PaneAddBar.vue): under the tab strip, every window not open yet as a small button;
 * a click adds it to this pane, a drag places it.
 */
defineProps<{ windows: PaneWindow[] }>();

const emit = defineEmits<{ grab: [event: PointerEvent, key: string] }>();
</script>

<template>
    <div
        role="menu"
        class="absolute top-[34px] right-[5px] left-[5px] z-6 flex flex-wrap gap-1 rounded-field border border-border-2 bg-raised p-1.5 shadow-[0_8px_24px_rgba(0,0,0,.4)]"
    >
        <template v-for="window in windows" :key="window.key">
            <button
                type="button"
                role="menuitem"
                :title="window.title"
                class="inline-flex h-6 items-center gap-1.5 rounded-control border border-border-2 px-2 text-small text-text-2 hover:bg-hover hover:text-text"
                @pointerdown="emit('grab', $event, window.key)"
            >
                <Icon :name="window.icon" :size="12" />{{ window.title }}
            </button>
        </template>
        <template v-if="!windows.length">
            <span class="px-1.5 py-1 text-small text-text-3"
                >Every window is open</span
            >
        </template>
    </div>
</template>
