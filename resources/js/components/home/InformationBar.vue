<script setup lang="ts">
import { computed } from 'vue';
import Button from '@/components/kit/Button.vue';
import Icon from '@/components/kit/Icon.vue';
import { bringToFront, changeDetached } from '@/components/panes/arrangement';
import { usePaneLayout } from '@/components/panes/usePaneLayout';

/**
 * The information bar, drawn over the desk's top edge instead of in the flow, so the chat below it does not move down
 * when a window floats: it lists the floating windows, each with Restore, which brings a minimised one back at its place
 * and in front. With no floating window it is not there.
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
            class="pointer-events-none absolute inset-x-0 top-0 z-30 flex flex-wrap items-center gap-2 px-4 py-1.5 text-small text-text-3"
        >
            <template v-for="window in floating" :key="window.key">
                <span
                    class="pointer-events-auto inline-flex items-center gap-2 rounded-field border border-border-2 bg-raised py-0.5 pr-1 pl-2 shadow-pop"
                >
                    <Icon :name="window.icon" :size="12" />
                    <span class="text-text-2">{{ window.title }}</span>
                    <Button size="small" variant="ghost" :aria-label="`Restore ${window.title}`" @click="restore(window.key)"
                        >Restore</Button
                    >
                </span>
            </template>
        </div>
    </template>
</template>
