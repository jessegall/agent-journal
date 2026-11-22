<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import type { NavigationCountsData, NavigationData } from '@/types/generated';
import SidebarRow from './SidebarRow.vue';

/**
 * The navigation the server merged for this user, in its order and without group heads, as the design draws it: the
 * pages, then the foot items in their own region, with the current page marked. The sidebar draws it, and the phone's
 * sheet draws it again.
 */
defineProps<{ isMini: boolean }>();

// The navigation comes with every signed-in page, the only pages with a sidebar; its counts follow after the page.
const page = usePage<{
    navigation: NavigationData;
    navigationCounts?: NavigationCountsData;
}>();

const navigation = computed(() => page.props.navigation);
const counts = computed(() => page.props.navigationCounts?.counts ?? {});
const currentKey = computed(() => navigation.value.current.at(-1) ?? null);
// The items above the foot in the server's order, one plain list as the design draws it.
const mainItems = computed(() => navigation.value.items.filter((root) => !root.atFoot));

const footItems = computed(() =>
    navigation.value.items.filter((root) => root.atFoot),
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
    <template v-if="footItems.length > 0">
        <nav
            class="flex shrink-0 flex-col gap-px border-t border-border px-2 pt-1.5"
            aria-label="More pages"
        >
            <template v-for="item in footItems" :key="item.key">
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
