<script setup lang="ts">
import { computed } from 'vue';
import Icon from '@/components/kit/Icon.vue';
import ChipButton from '@/components/kit/ChipButton.vue';
import { bringToFront, changeDetached } from '@/components/panes/arrangement';
import { usePaneLayout } from '@/components/panes/usePaneLayout';

/**
 * The information bar, a row between the agent bar and the desk while a window floats: Floating, then a chip for each
 * floating window that brings it to front, and shows a minimised one whole again at its place. With no floating window
 * it is not there.
 */
const store = usePaneLayout();
const floating = computed(() =>
    store.detached.value.flatMap((each) => {
        const window = store.windowOf(each.key);

        return window === undefined ? [] : [{ ...each, title: window.title, icon: window.icon }];
    }),
);

function restore(key: string): void {
    const unfolded = changeDetached(store.arrangement.value, key, { isMinimised: false }, store.screen());

    store.apply(bringToFront(unfolded, key));
}
</script>

<template>
    <template v-if="floating.length > 0">
        <div
            role="region"
            aria-label="Floating windows"
            class="flex min-h-[30px] flex-none flex-wrap items-center gap-2 border-b border-border pr-[5px] pl-3.5 text-small text-text-3"
        >
            <span>Floating</span>
            <template v-for="window in floating" :key="window.key">
                <ChipButton tone="quiet" :aria-label="`Restore ${window.title}`" @click="restore(window.key)">
                    <template #leading>
                        <Icon :name="window.icon" :size="13" />
                    </template>
                    {{ window.isMinimised ? `${window.title} · bar only` : window.title }}
                </ChipButton>
            </template>
        </div>
    </template>
</template>
