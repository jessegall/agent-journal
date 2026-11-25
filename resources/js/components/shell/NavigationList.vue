<script setup lang="ts">
import { computed } from 'vue';
import { useAppContext } from '@/framework/appContext';
import SidebarRow from './SidebarRow.vue';

/**
 * The navigation the server merged for this user, in its order and without group heads, as the design draws it: the
 * pages, then the foot items in their own region, with the current page marked. The sidebar draws it, and the phone's
 * sheet draws it again.
 */
defineProps<{ isMini: boolean }>();

// The navigation comes with every signed-in page, the only pages with a sidebar; its counts follow after the page, and a
// count not there yet is still loading.
const { navigation, navigationCounts } = useAppContext();

const counts = computed(() => navigationCounts.value?.counts ?? {});
const currentKey = computed(() => navigation.value?.current.at(-1) ?? null);
// The items above the foot in the server's order, one plain list as the design draws it.
const sidebarItems = computed(() => (navigation.value?.items ?? []).filter((root) => root.isInSidebar));
const mainItems = computed(() => sidebarItems.value.filter((root) => !root.isAtBottom));

const bottomItems = computed(() =>
    sidebarItems.value.filter((root) => root.isAtBottom),
);
</script>

<template>
    <nav
        class="flex min-h-0 flex-1 [scrollbar-width:none] flex-col gap-px overflow-y-auto px-2"
        aria-label="Pages"
    >
        <template v-for="item in mainItems" :key="item.key">
            <SidebarRow
                :item="item"
                :current-key="currentKey"
                :counts="counts"
                :is-mini="isMini"
                :depth="0"
            />
        </template>
    </nav>
    <template v-if="bottomItems.length > 0">
        <nav
            class="flex shrink-0 flex-col gap-px border-t border-border px-2 pt-1.5"
            aria-label="More pages"
        >
            <template v-for="item in bottomItems" :key="item.key">
                <SidebarRow
                    :item="item"
                    :current-key="currentKey"
                    :counts="counts"
                    :is-mini="isMini"
                    :depth="0"
                />
            </template>
        </nav>
    </template>
</template>
